import React, { Fragment } from "react";
import {
    Text,
    View,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Platform,
    Image
} from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import * as Font from "expo-font";

import { Divider } from "react-native-elements";
import { IconRegistry, ApplicationProvider } from "@ui-kitten/components";
import { mapping, light as lightTheme } from "@eva-design/eva";
import ProfilHeader from "../Components/ProfilHeader";
import uuid from "uuid/v1";

const Device = require("react-native-device-detection");
import PhotoProfil from "../../../assets/svg-js/photo_profil";

import Badges from "../../../assets/badges";

import firebase from "react-native-firebase";

import MessageDesactive from "../../../assets/svg-js/MessageDesactive";
import FlexRow from "../Other/FlexRow";
const styles = StyleSheet.create({
    droidSafeArea: {
        flex: 1,
        backgroundColor: "white",
        height: "100%"
    },
    mainContainer: {
        top: hp("25%"),

        width: wp("100%"),
        marginLeft: "auto",
        marginRight: "auto",

        paddingLeft: wp("10%"),
        paddingRight: wp("10%")
    },
    //
    // Text
    //
    name: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: hp("3%")
    },
    info: {
        textAlign: "center",

        fontSize: hp("2.2%")
    },
    //
    // Bouton
    //
    bouton1: {
        marginLeft: "auto",
        marginRight: "auto",
        height: hp("6%"),
        width: "100%"
    },
    boutonText1: {
        marginTop: "auto",
        marginBottom: "auto",
        marginLeft: "auto",
        marginRight: "auto",
        fontSize: hp("2.8%"),
        fontWeight: "bold",
        textAlign: "center",
        color: "#FFBB01"
    },
    bouton2: {
        marginLeft: "auto",
        marginRight: "auto",
        height: hp("6%"),
        width: "100%",
        backgroundColor: "#FFBB01",
        borderRadius: 100
    },
    boutonText2: {
        marginTop: "auto",
        marginBottom: "auto",
        marginLeft: "auto",
        marginRight: "auto",
        fontSize: hp("3%"),
        fontWeight: "bold",
        textAlign: "center",
        color: "white"
    }
});

export default class App extends React.Component {
    constructor() {
        super();
    }

    static navigationOptions = {
        header: null
    };

    state = {
        fontLoaded: false,
        cover: null,
        profil: null,
        menu: false,
        biographie: "",
        age: null,
        lastName: "",
        firstName: "",
        degreeName: "",
        hoursDone: 0,
        competenceAndInterest: []
    };

    async componentDidMount() {
        await Font.loadAsync({
            "SF-pro": require("../../../assets/fonts/SF-Pro-Text-Regular.otf"),
            "Montserrat-light": require("../../../assets/fonts/Montserrat-Light.ttf")
        });
        this.setState({ fontLoaded: true });
        try {
            const userUid = this.props.navigation.getParam("id", "noUser");
            const cover = await firebase
                .storage()
                .ref(`users/${userUid}/coverPhoto`)
                .getDownloadURL()
                .catch(err => console.log(err) === 1);
            const profil = await firebase
                .storage()
                .ref(`users/${userUid}/profilPhoto`)
                .getDownloadURL()
                .catch(err => console.log(err) === 1);
            const profilDefault = await firebase
                .storage()
                .ref(`icone-profil-benevole.png`)
                .getDownloadURL()
                .catch(err => console.log(err) === 1);
            if (cover) this.setState({ cover });
            if (profil) this.setState({ profil });
            else if (profilDefault) this.setState({ profil: profilDefault });
            const snapshotDb = await firebase
                .firestore()
                .collection("benevoleUsers")
                .doc(userUid)
                .get();
            const snapshotAll = await firebase
                .firestore()
                .collection("hoursRegistry")
                .get();

            let hoursDone = 0;
            snapshotAll.forEach(assoDeclared => {
                const snapshotUser = assoDeclared.data();
                //console.log(snapshotUser);
                const { [`${userUid}`]: userHours } = snapshotUser;
                //console.log(userHours);
                hoursDone += userHours;
            });
            //console.log(hoursDone);
            const dateBirth = new Date(snapshotDb.data().birthDate);
            const today = new Date();
            this.setState({
                hoursDone,
                biographie: snapshotDb.data().biographie,
                age: today.getFullYear() - dateBirth.getFullYear(),
                lastName: snapshotDb.data().lastName,
                firstName: snapshotDb.data().firstName,
                degreeName: snapshotDb.data().degreeName,
                competenceAndInterest: snapshotDb.data().competenceAndInterest
            });
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        const {
            cover,
            profil,
            menu,
            biographie,
            age,
            lastName,
            firstName,
            degreeName,
            hoursDone,
            competenceAndInterest
        } = this.state;
        const { goBack, getParam } = this.props.navigation;
        const which = getParam("id", "noUser");
        const missionUid = getParam("missionUid", "noMission");
        const title = getParam("title", "noTitle");
        const Profil = () => {
            return (
                <View style={styles.droidSafeArea}>
                    <ProfilHeader profil={profil} cover={cover} />

                    <TouchableOpacity
                        style={{
                            marginLeft: "auto",
                            top: hp("19%"),
                            left: hp("-2%")
                        }}
                        onPress={async () => {
                            try {
                                const {
                                    uid: userUid
                                } = firebase.auth().currentUser;
                                const assoMessagesRef = await firebase
                                    .firestore()
                                    .collection("messages")
                                    .doc(userUid)
                                    .get();
                                //look conversation with the bénévole
                                const assoMessages = assoMessagesRef.data();
                                const {
                                    [which]: toThisBenevole
                                } = assoMessages;
                                let convExist = false;
                                let idConv = "";
                                for (
                                    let i = 0;
                                    i < toThisBenevole.length;
                                    i++
                                ) {
                                    const conv = toThisBenevole[i];
                                    if (conv.uid === missionUid) {
                                        convExist = true;
                                        idConv = conv.uid;
                                        break;
                                    }
                                }
                                const name = `${firstName} ${lastName}`;
                                if (!convExist) {
                                    //create new conversation with the bénévole
                                    await firebase
                                        .firestore()
                                        .collection("messages")
                                        .doc(userUid)
                                        .set(
                                            {
                                                [which]: [
                                                    ...toThisBenevole,
                                                    {
                                                        desc: title,
                                                        messages: [],
                                                        messagesViewed: [],
                                                        uid: missionUid
                                                    }
                                                ]
                                            },
                                            { merge: true }
                                        );
                                    idConv = missionUid;
                                }
                                this.props.navigation.push("MessagesAsso", {
                                    mission: title,
                                    destinataire: which,
                                    profil,
                                    idConv,
                                    name
                                });
                            } catch (error) {
                                console.log(error);
                            }
                        }}
                    >
                        <MessageDesactive />
                    </TouchableOpacity>

                    <ScrollView style={styles.mainContainer}>
                        <Text style={styles.name}>
                            {firstName} {lastName}
                        </Text>
                        <Text style={styles.info}>
                            {age} ans - {degreeName}
                        </Text>
                        <View style={{ paddingBottom: hp("1%") }} />
                        <Badges
                            hours={hoursDone}
                            height={150}
                            width={150}
                            style={{
                                marginLeft: "auto",
                                marginRight: "auto",
                                left: -hp("0.5%"),
                                marginTop: -20,
                                marginBottom: -20
                            }}
                        />
                        <View style={{ paddingBottom: hp("1%") }} />
                        <Divider />
                        <View style={{ paddingBottom: hp("2%") }} />
                        <Text>{biographie}</Text>
                        <View style={{ paddingBottom: hp("2%") }} />
                        <Divider />
                        <View style={{ paddingBottom: hp("3%") }} />

                        <FlexRow
                            itemsList={competenceAndInterest}
                            removeIt={() => {}}
                            isAsso={true}
                            isCross={false}
                        />
                    </ScrollView>
                </View>
            );
        };

        return (
            <ApplicationProvider mapping={mapping} theme={lightTheme}>
                <Profil />
                <View
                    style={{
                        top: hp("-15%"),
                        paddingLeft: wp("8%"),
                        paddingRight: wp("8%")
                    }}
                >
                    <TouchableOpacity
                        style={styles.bouton1}
                        onPress={async () => {
                            try {
                                const { uid } = firebase.auth().currentUser;
                                const ref = firebase
                                    .firestore()
                                    .collection("missions")
                                    .doc(uid);
                                const snap = await ref.get();
                                const missions = snap.data();
                                const mission = missions[missionUid];
                                const {
                                    acceptedBenevole,
                                    refusedBenevole
                                } = mission;
                                const newAcceptedBenevole = acceptedBenevole.filter(
                                    beneId => beneId !== which
                                );
                                await ref.set(
                                    {
                                        [missionUid]: {
                                            ...mission,
                                            refusedBenevole: [
                                                ...refusedBenevole,
                                                which
                                            ],
                                            acceptedBenevole: newAcceptedBenevole
                                        }
                                    },
                                    { merge: true }
                                );
                                goBack();
                            } catch (error) {
                                console.log(error);
                            }
                        }}
                    >
                        <Text style={styles.boutonText1}>
                            {"  "}Ça sera pour une autre fois{"  "}
                        </Text>
                    </TouchableOpacity>
                    <View style={{ paddingTop: hp("1%") }} />
                    <TouchableOpacity
                        style={styles.bouton2}
                        onPress={async () => {
                            try {
                                const { uid } = firebase.auth().currentUser;
                                const ref = firebase
                                    .firestore()
                                    .collection("missions")
                                    .doc(uid);
                                const snap = await ref.get();
                                const missions = snap.data();
                                const mission = missions[missionUid];
                                const { acceptedBenevole } = mission;
                                const newAcceptedBenevole = acceptedBenevole.filter(
                                    beneId => beneId !== which
                                );
                                await ref.set(
                                    {
                                        [missionUid]: {
                                            ...mission,
                                            acceptedBenevole: [
                                                ...newAcceptedBenevole,
                                                which
                                            ]
                                        }
                                    },
                                    { merge: true }
                                );
                                goBack();
                            } catch (error) {
                                console.log(error);
                            }
                        }}
                    >
                        <Text style={styles.boutonText2}>
                            {"  "}J'accepte{"  "}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ApplicationProvider>
        );
    }
}
