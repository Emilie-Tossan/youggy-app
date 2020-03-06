import React, { Component, Fragment } from "react";
import {
	Text,
	View,
	TouchableOpacity,
	TextInput,
	StyleSheet
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { NavigationActions } from "react-navigation";
import CodeInput from "react-native-confirmation-code-input";
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp
} from "react-native-responsive-screen";

import Validation from "../Components/ValidationComponentScreen";
import BackButton from "../Components/BackButton";
import * as Font from "expo-font";
import Editer from "../../../assets/svg-js/editer";
import Envoyer from "../../../assets/svg-js/envoyer";

import firebase from "react-native-firebase";

const Device = require("react-native-device-detection");

const styles = StyleSheet.create({
	screenContainer: {
		width: "100%",
		height: "100%"
	},
	mainContainer: {
		marginLeft: "auto",
		marginRight: "auto",
		marginTop: "auto",
		marginBottom: "auto",
		paddingLeft: Device.isTablet ? wp("25%") : wp("13%"),
		paddingRight: Device.isTablet ? wp("25%") : wp("13%"),
		width: wp("100%")
	},
	//
	// Text
	//
	title: {
		fontSize: hp("3.2%"),
		fontWeight: "bold",
		color: "white",
		paddingBottom: hp("4%"),
		textAlign: "center"
	},
	desc: {
		fontSize: hp("2%"),
		color: "white",
		textAlign: "center"
	},
	info: {
		fontSize: hp("2.3%"),
		color: "white",
		textAlign: "center",
		fontWeight: "bold"
	},
	valide: {
		fontSize: hp("2.8%"),
		color: "white",
		textAlign: "center",
		fontWeight: "bold"
	},
	help: {
		fontSize: hp("2%"),
		color: "white",
		textAlign: "center",
		fontWeight: "600"
	},
	//
	// InputCode
	//
	inputContainer: {
		top: hp("1%"),
		left: hp("0.7%"),
		marginLeft: "auto",
		marginRight: "auto",
		alignItems: "center",
		flexDirection: "row"
	},
	inputTextContainer: {
		// left: hp('-0.8%'),
		marginLeft: "auto",
		marginRight: "auto",
		paddingBottom: hp("2%")
	},
	input: {
		fontSize: hp("2.5%"),
		fontWeight: "bold",
		color: "white",
		textAlign: "right"
	},
	//
	// Code
	//
	codeInputContainer: {
		color: "white",
		fontSize: hp("2%"),
		marginLeft: "auto",
		marginRight: "auto",
		marginTop: "auto",
		marginBottom: "auto",
		paddingBottom: hp("4%")
	},
	codeInputText: {
		height: hp("1.6%"),
		top: hp("4.7%"),
		color: "white",
		fontSize: hp("1.5%"),
		fontWeight: "900",
		marginLeft: "auto",
		marginRight: "auto",
		marginTop: "auto",
		marginBottom: "auto"
	},
	//
	// Bottom button
	//
	bottomContainer: {
		height: hp("8%")
	},
	button: {
		height: "100%",
		borderTopColor: "white",
		borderTopWidth: 1
	},
	textButton: {
		marginLeft: "auto",
		marginRight: "auto",
		marginTop: "auto",
		marginBottom: "auto",
		textAlign: "center",
		color: "white",
		fontSize: hp("2.5%"),
		fontWeight: "bold"
	},
	//
	// Utils
	//
	space: {
		paddingBottom: hp("2%")
	},
	space2: {
		paddingBottom: hp("2.2%")
	},
	bold: {
		fontWeight: "bold"
	},
	extraBold: {
		fontWeight: "900"
	}
});

export default class App extends React.Component {
	constructor() {
		super();
		this.state = {
			myText: "",
			count: 0,
			animation1: false,
			animation2: false,
			code: "",
			state: false,
			fontLoaded: false,
			phoneSnapshot: null,
			newEntryRef: null,
			internationalPhone: ""
		};
	}

	async componentDidMount() {
		await Font.loadAsync({
			"SF-pro": require("../../../assets/fonts/SF-Pro-Text-Regular.otf"),
			"Montserrat-light": require("../../../assets/fonts/Montserrat-Light.ttf")
		});
		this.setState({ fontLoaded: true });
		//fetch le code de confirmation pour le mail ou le phone
		const { getParam } = this.props.navigation;
		const newEntryRef = getParam("newEntryRef", null);
		const phoneSnapshot = getParam("phoneSnapshot", null);
		const internationalPhone = getParam("internationalPhone", null);
		this.setState({
			phoneSnapshot,
			newEntryRef,
			internationalPhone
		});
	}

	static navigationOptions = {
		header: null
	};
	_onFulfill = code => {
		this.setState({ code: code, state: true });
	};

	checkCode = async () => {
		const { code, phoneSnapshot, newEntryRef, count } = this.state;
		const { verificationId } = phoneSnapshot;
		try {
			const cred = firebase.auth.PhoneAuthProvider.credential(
				verificationId,
				code
			);
			console.log(cred);
			const linkCred = await firebase
				.auth()
				.currentUser.linkWithCredential(cred);
			console.log(linkCred);
			//code correspond
			await newEntryRef.set({ verifiedPhone: true }, { merge: true });
			this.setState({ count: 0 });
			this.setState({ myText: " " });
			if (
				this.props.navigation.getParam(
					"mailOrPhone",
					"default value"
				) === "adresse e-mail"
			)
				this.setState({ animation2: true });
			else {
				this.setState({ animation1: true });
			}
		} catch (err) {
			this.setState({ count: count + 1 });
			this.setState({
				myText: "  Ceci n'est pas le bon code.  ",
				state: false
			});
			this.refs.code.clear();
			//bloquer au bout de 5 essaies
			if (count >= 1)
				this.setState({ myText: "  Ceci n'est pas le bon code.  " });
			console.log(err);
		}
	};

	resendCode = async () => {
		if (
			this.props.navigation.getParam("mailOrPhone", "default value") ===
			"adresse e-mail"
		)
			return;
		const { internationalPhone } = this.state;
		try {
			const phoneSnapshot = await firebase
				.auth()
				.verifyPhoneNumber(internationalPhone);
			this.setState({ phoneSnapshot });
		} catch (err) {
			console.log(err);
		}
	};

	render() {
		const { goBack, getParam, push } = this.props.navigation;
		const { newEntryRef } = this.state;

		return (
			<View style={styles.screenContainer}>
				<Validation
					display={this.state.animation1}
					text="Votre numéro est confirmé !"
					next={() => {
						/*push('ContactConfirmAsso', {
							mailOrPhone: 'adresse e-mail',
							mailOrSms: 'e-mail',
							pronom: 'l',
							email: getParam('email', 'default value')
						})*/
						this.setState({ animation1: false });
						push("PasswordCreationAsso", {
							email: getParam("email", "default value"),
							newEntryRef
						});
					}}
					side="asso"
					typo="white"
				/>
				<Validation
					display={this.state.animation2}
					text="Votre adresse e-mail est confirmée !"
					next={() => {
						this.setState({ animation2: false });
						push("PasswordCreationAsso");
					}}
					side="asso"
					typo="white"
				/>
				<LinearGradient
					colors={["#FFA901", "#FFCC48", "#FFA901"]}
					style={{ flex: 1 }}
					start={{ x: 0, y: 0 }}
					end={{ x: 0, y: 1 }}
				>
					<BackButton text="Retour" goBack={goBack} />
					<View style={styles.mainContainer}>
						<Text style={styles.title}>
							Confirmez votre{" "}
							{getParam("mailOrPhone", "default value")}
						</Text>
						<Text style={styles.desc}>
							Vous avez reçu un{" "}
							<Text style={styles.extraBold}>
								{getParam("mailOrSms", "default value")}
							</Text>{" "}
							avec un code pour{" "}
							<Text style={styles.extraBold}>confirmer</Text>{" "}
							votre {getParam("mailOrPhone", "default value")}.
						</Text>
						<View style={styles.space} />
						<View style={styles.codeInputContainer}>
							<CodeInput
								keyboardType="number-pad"
								autoFocus={false}
								className={"border-b"}
								codeLength={6}
								space={hp("0.5%")}
								size={hp("4%")}
								inputPosition="center"
								onFulfill={code => this._onFulfill(code)}
								codeInputStyle={{
									fontWeight: "bold",
									fontSize: hp("3.5%"),
									paddingBottom: 5
								}}
								onChange={() => this.setState({ myText: " " })}
								ref="code"
							/>
							{/* <View style={{ paddingBottom: hp('0.01%') }} /> */}
							<Text style={styles.codeInputText}>
								{this.state.myText}
							</Text>
						</View>
						<View style={{ paddingBottom: hp("3%") }} />

						{!this.state.state ? (
							<View>
								<Text style={styles.info}>
									{getParam(
										"mailOrPhone",
										"default value"
									) === "numéro de téléphone portable"
										? getParam("phone", "default value")
										: getParam("email", "default value")}
								</Text>
								<View style={{ paddingBottom: hp("2.5%") }} />
							</View>
						) : (
							<TouchableOpacity onPress={() => this.checkCode()}>
								<Text style={styles.valide}>Je valide</Text>
								<View style={{ paddingBottom: hp("2%") }} />
							</TouchableOpacity>
						)}
					</View>
					<TouchableOpacity
						onPress={() =>
							push("NeedHelpAsso", {
								mailOrPhone: this.props.navigation.getParam(
									"mailOrPhone",
									"contact"
								)
							})
						}
					>
						<Text style={styles.help}>Besoin d'aide ?</Text>
					</TouchableOpacity>
					<View style={{ paddingBottom: hp("4%") }} />

					<View style={styles.bottomContainer}>
						<TouchableOpacity
							onPress={this.resendCode}
							style={styles.button}
						>
							<Text style={styles.textButton}>
								{"  "}Recevoir{" "}
								{getParam("mailOrSms", "default value") ===
								"SMS"
									? "le "
									: "l'"}
								{getParam("mailOrSms", "default value")}
								{"  "}
							</Text>
						</TouchableOpacity>
					</View>
				</LinearGradient>
			</View>
		);
	}
}
