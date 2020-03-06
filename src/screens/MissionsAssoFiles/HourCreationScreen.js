import React, { Fragment, useState, useEffect } from "react";
import {
    Text,
    View,
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
import { ScrollView } from "react-native-gesture-handler";

import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { Divider } from "react-native-elements";
import {
    IconRegistry,
    ApplicationProvider,
    Input
} from "@ui-kitten/components";
import { mapping, light as lightTheme } from "@eva-design/eva";
import { EvaIconsPack } from "@ui-kitten/eva-icons";

import BackButton from "../Components/BackButton";
import BottomButton from "../Components/BottomButton";

import uuid from "uuid/v1";
import firebase from "react-native-firebase";

import Pop from "../../../assets/svg-js/Pop";

const Device = require("react-native-device-detection");

const styles = StyleSheet.create({
    droidSafeArea: {
        flex: 1,
        backgroundColor: "white"
    },
    mainContainer: {
        width: wp("100%"),
        marginLeft: "auto",
        marginRight: "auto",
        paddingLeft: wp("10%")
        // paddingRight: wp("10%")
    },
    //
    // Text
    //
    title: {
        textAlign: "center",
        color: "#FFBB01",
        fontSize: hp("2.5%"),
        fontWeight: "bold",
        paddingRight: wp("10%")
    },
    desc: {
        textAlign: "left",
        fontSize: hp("1.8%"),
        fontWeight: "300",
        paddingRight: wp("10%")
    },
    //
    // Input
    //
    input: {
        width: "37%"
    },
    //
    // FlexRow
    //
    flexRow: {
        flexDirection: "row",
        paddingRight: wp("10%")
    },
    //
    // Divider
    //
    hourDivider: {
        width: "26%",
        paddingLeft: "5%",
        paddingRight: "5%",
        marginTop: "auto",
        marginBottom: "auto",
        top: 8
    }
});

function HourFill(props) {
    const [startTime, setStartTime] = useState(props.startTime);
    const [endTime, setEndTime] = useState(props.endTime);

    return (
        <View>
            <View style={styles.flexRow}>
                <View style={styles.input}>
                    <Input
                        label="DÉBUT"
                        labelStyle={{
                            ...styles.desc,
                            textAlign: "center",
                            fontSize: hp("1.5%")
                        }}
                        size="small"
                        status="warning"
                        placeholder="10:00"
                        keyboardType="number-pad"
                        onChangeText={text => {
                            if (text.length <= 5) {
                                const array1 = text.split("");
                                const reducer = (
                                    accumulator,
                                    currentValue,
                                    index,
                                    initialArray
                                ) => {
                                    if (
                                        startTime.length < text.length &&
                                        index === 1 &&
                                        initialArray[index + 1] !== ":"
                                    )
                                        return accumulator + currentValue + ":";
                                    return accumulator + currentValue;
                                };
                                if (array1.length)
                                    setStartTime(array1.reduce(reducer));
                                else setStartTime(text);
                            }
                        }}
                        onEndEditing={() =>
                            props.saveEntry(startTime, "startTime", props.index)
                        }
                        value={startTime}
                        // onChangeText={text => {
                        // 	this.setState({ startTime0: text });
                        // }}
                        // value={startTime0}
                    />
                </View>
                <View style={styles.hourDivider}>
                    <Divider />
                </View>
                <View style={styles.input}>
                    <Input
                        label="FIN"
                        labelStyle={{
                            ...styles.desc,
                            textAlign: "center",
                            fontSize: hp("1.5%")
                        }}
                        size="small"
                        status="warning"
                        placeholder="12:00"
                        keyboardType="number-pad"
                        onChangeText={text => {
                            if (text.length <= 5) {
                                const array1 = text.split("");
                                const reducer = (
                                    accumulator,
                                    currentValue,
                                    index,
                                    initialArray
                                ) => {
                                    if (
                                        endTime.length < text.length &&
                                        index === 1 &&
                                        initialArray[index + 1] !== ":"
                                    )
                                        return accumulator + currentValue + ":";
                                    return accumulator + currentValue;
                                };
                                if (array1.length)
                                    setEndTime(array1.reduce(reducer));
                                else setEndTime(text);
                            }
                        }}
                        onEndEditing={() =>
                            props.saveEntry(endTime, "endTime", props.index)
                        }
                        value={endTime}
                        // value={endTime[i]}
                    />
                </View>
                <TouchableOpacity
                    onPress={props.removeRangeTime}
                    style={{ height: "100%", width: hp("10%") }}
                >
                    <Pop style={{ top: hp("4%"), left: hp("1%") }} />
                </TouchableOpacity>
            </View>
            <View style={{ paddingBottom: hp("2%") }} />
        </View>
    );
}

export default class App extends React.Component {
    constructor() {
        super();
    }

    static navigationOptions = {
        header: null
    };

    state = {
        fontLoaded: false,
        hourCompter: 1,
        startTime: [],
        endTime: [],
        mission: {},
        missionUid: ""
    };

    async componentDidMount() {
        await Font.loadAsync({
            "SF-pro": require("../../../assets/fonts/SF-Pro-Text-Regular.otf"),
            "Montserrat-light": require("../../../assets/fonts/Montserrat-Light.ttf")
        });
        const missionUid = this.props.navigation.getParam("missionUid", "");
        this.setState({ fontLoaded: true, missionUid });
        try {
            const { uid } = firebase.auth().currentUser;
            const ref = firebase
                .firestore()
                .collection("missions")
                .doc(uid);
            const snap = await ref.get();
            const { [missionUid]: mission } = snap.data();
            this.setState({ mission });
        } catch (error) {
            console.log(error);
        }
    }

    saveEntry = (text, field, index) => {
        const { startTime, endTime } = this.state;
        const tmpTab = [null, null, null, null];
        if (field === "startTime") {
            tmpTab[index] = text;
            const newStart = [];
            for (let i = 0; i < tmpTab.length; i++) {
                const elem = tmpTab[i];
                if (elem) newStart.push(elem);
                else newStart.push(startTime[i]);
            }
            this.setState({ startTime: newStart });
        } else if (field === "endTime") {
            tmpTab[index] = text;
            const newEnd = [];
            for (let i = 0; i < tmpTab.length; i++) {
                const elem = tmpTab[i];
                if (elem) newEnd.push(elem);
                else newEnd.push(endTime[i]);
            }
            this.setState({ endTime: newEnd });
        }
    };

    validationFunc = async () => {
        const { mission, missionUid, startTime, endTime } = this.state;
        const rangeTime = [];
        for (let i = 0; i < startTime.length && i < endTime.length; i++) {
            const start = startTime[i];
            const end = endTime[i];
            if (start && end) rangeTime.push({ start, end });
        }
        try {
            const { uid } = firebase.auth().currentUser;
            const ref = firebase
                .firestore()
                .collection("missions")
                .doc(uid);
            await ref.set(
                { [missionUid]: { ...mission, rangeTime } },
                { merge: true }
            );
            this.props.navigation.navigate("PlaceCreation", { missionUid });
        } catch (error) {
            console.log(error);
        }
    };

    removeRangeTime = index => {
        let { hourCompter, startTime, endTime } = this.state;

        hourCompter--;
        startTime = startTime.filter((val, i) => i !== index);
        endTime = endTime.filter((val, i) => i !== index);
        this.setState({ hourCompter, startTime, endTime });
    };

    render() {
        const { hourCompter, startTime, endTime } = this.state;
        const { goBack } = this.props.navigation;

        const HourInput = () => {
            const hourDisplayTable = [false, false, false, false].map(
                (display, index) => {
                    if (index <= hourCompter - 1) return true;
                    return display;
                }
            );
            const Hour = hourDisplayTable.map((elem, index) => {
                if (elem)
                    return (
                        <HourFill
                            index={index}
                            startTime={startTime[index]}
                            endTime={endTime[index]}
                            saveEntry={this.saveEntry}
                            removeRangeTime={this.removeRangeTime.bind(
                                this,
                                index
                            )}
                            key={uuid()}
                        />
                    );
            });
            return <View>{Hour}</View>;
        };
        const Header = () => {
            return (
                <View style={{ height: "10%" }}>
                    <View style={{ paddingBottom: hp("3%") }} />

                    <BackButton text="Retour" color="black" goBack={goBack} />
                </View>
            );
        };
        return (
            <ApplicationProvider mapping={mapping} theme={lightTheme}>
                <View style={styles.droidSafeArea}>
                    <View style={{ paddingBottom: hp("3%") }} />

                    <BackButton text="Retour" color="black" goBack={goBack} />
                    <View style={{ paddingBottom: hp("3%") }} />
                    <View style={styles.mainContainer}>
                        <View style={{ paddingBottom: hp("3%") }} />
                        <Text style={styles.title}>Trouver des bénévoles</Text>

                        <View style={{ paddingBottom: hp("5%") }} />
                        <Text style={styles.desc}>
                            Un système de matching est prévu pour aider les
                            bénévoles à trouver des missions.{"\n"}
                            Renseignez les profils que vous recherchez.
                        </Text>
                        <View style={{ paddingBottom: hp("5%") }} />
                        <ScrollView style={{ height: "50%" }}>
                            <HourInput />
                        </ScrollView>
                        <TouchableOpacity
                            onPress={() =>
                                hourCompter < 4
                                    ? this.setState({
                                          hourCompter: hourCompter + 1
                                      })
                                    : 0
                            }
                        >
                            <View style={{ paddingBottom: hp("4%") }} />
                            <Text
                                style={{ ...styles.desc, textAlign: "center" }}
                            >
                                + Ajouter une plage horaire
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity
                    style={{
                        height: hp("7%"),
                        width: wp("100%"),
                        backgroundColor: "#FFBB01"
                    }}
                    onPress={this.validationFunc}
                >
                    <Text
                        style={{
                            marginLeft: "auto",
                            marginRight: "auto",
                            marginTop: "auto",
                            marginBottom: "auto",
                            color: "white",
                            fontSize: hp("2.8%"),
                            fontWeight: "bold"
                        }}
                    >
                        Je continue
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        height: hp("13%"),
                        width: wp("100%"),
                        backgroundColor: "#FFBB01"
                    }}
                    onPress={this.validationFunc}
                />
            </ApplicationProvider>
        );
    }
}
