import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Text as TextSVG, TSpan } from 'react-native-svg';
import * as ImagePicker from 'expo-image-picker';
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import * as Font from 'expo-font';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

import CountryPicker from 'react-native-country-picker-modal';

import { ScrollView } from 'react-native-gesture-handler';

import Icon5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
// import { Progress } from 'nachos-ui';
import { Input, Divider } from 'react-native-elements';
import {
	IconRegistry,
	ApplicationProvider,
	Select
} from '@ui-kitten/components';

import { mapping, light as lightTheme } from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';

import toPx from '../../utils/percentageToPx';

import PhotoProfil from '../../../assets/svg-js/photo_profil';

import BottomButton from '../Components/BottomButton';
import ProfilePicker from '../Components/ProfilPicker';

import firebase from 'react-native-firebase';

const Device = require('react-native-device-detection');

const styles = StyleSheet.create({
	droidSafeArea: {
		flex: 1,
		backgroundColor: 'white'
	},
	mainContainer: {
		top: hp('8%'),
		width: wp('100%'),
		marginLeft: 'auto',
		marginRight: 'auto',
		paddingLeft: wp('10%'),
		paddingRight: wp('10%')
	},
	//
	// Picture Picker
	//
	CoverPicturePicker: {
		height: hp('18%'),
		width: '100%',
		backgroundColor: '#EFEFEF',
		overflow: 'hidden'
	},
	ProfilePicturePicker: {
		top: hp('-10'),
		width: wp('49%'),
		height: hp('16%') * 1.609 * 0.50758 + 20,
		overflow: 'hidden',
		marginLeft: 'auto',
		marginRight: 'auto'
	},
	//
	// Text
	//
	title: {
		textAlign: 'left',
		color: '#FFA901',
		fontSize: hp('2.5%'),
		fontWeight: 'bold'
	},
	info: {
		fontSize: hp('1.5%'),
		color: 'black'
	},
	subText: {
		fontSize: hp('1.8%'),
		color: 'grey',
		textAlign: 'center'
	},
	//
	// Input
	//
	inputText: {
		width: '100%',
		height: hp('10%'),
		color: 'black',

		fontSize: hp('2.2%')
	},
	inputContainer: {
		flexDirection: 'row',
		// borderBottomColor: '#E5E5E5',
		//borderBottomWidth: 1,
		marginBottom: 5,
		color: 'black',
		fontSize: hp('2.2%'),
		paddingBottom: 5
	},
	inputContainerStyle: {
		left: -10,
		paddingTop: hp('1.5%')
	},
	inputTextContainer: {
		left: 5,
		top: Device.isTablet ? hp('-1%') : hp('-1.5%'),
		width: '100%',
		height: hp('5.5%'),
		textAlign: 'right'
	},
	inputDoubleContainer: {
		paddingRight: Device.isTablet ? wp('5%') : hp('3.5%'),
		width: '45%',
		flexDirection: 'row',
		borderBottomColor: 'black',
		borderBottomWidth: 1,
		marginBottom: 5,
		color: 'black',
		fontSize: hp('2.2%'),
		paddingBottom: 5
	},
	inputImageContainer: {
		top: Device.isTablet ? hp('-2%') : hp('-1%'),
		height: hp('6.4%')
	},
	oeil: {
		top: hp('-0.5%'),
		height: hp('2.2%'),
		width: hp('2.2%') * 1.5625
	},
	DatePicker: {
		marginLeft: 'auto',
		marginRight: 'auto',
		marginTop: 'auto',
		marginBottom: 'auto'
	},
	DatePickerContainer: {
		height: hp('4.5%'),
		width: hp('4.5%'),
		left: hp('-1%'),
		top: hp('1%')
	},
	//
	// Utils
	//
	shadow: {
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 6
		},
		shadowOpacity: 0.37,
		shadowRadius: 7.49

		// elevation: 12
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
		coverUrl: false,
		profilUrl: false,
		cover: null,
		profil: null,
		fontLoaded: false,
		cca2: 'FR',
		callingCode: '33',
		color: '#FFFFFF',
		regexEmail: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
		//
		// Input
		//
		name: '',
		activity: '',
		country: '',
		mail: '',
		falseEmail: false
	};

	async componentDidMount() {
		await Font.loadAsync({
			'SF-pro': require('../../../assets/fonts/SF-Pro-Text-Regular.otf'),
			'Montserrat-light': require('../../../assets/fonts/Montserrat-Light.ttf')
		});
		try {
			const userUid = firebase.auth().currentUser.uid;
			const dataRef = firebase
				.firestore()
				.collection('associationUsers')
				.doc(userUid);
			const snapshot = await dataRef.get();
			const dataAll = snapshot.data();
			this.setState({
				cca2: dataAll.countryCCA2,
				name: dataAll.associationName,
				activity: dataAll.activitySector,
				mail: dataAll.email,
				country: dataAll.countryName
			});
			const profil = await firebase
				.storage()
				.ref(`users/${userUid}/profilPhoto`)
				.getDownloadURL()
				.catch(err => console.log(err) === 1);
			let profilUrl = false;
			//console.log(profil);
			if (profil) profilUrl = true;
			this.setState({ profil, profilUrl });
			const cover = await firebase
				.storage()
				.ref(`users/${userUid}/coverPhoto`)
				.getDownloadURL()
				.catch(err => console.log(err) === 1);
			let coverUrl = false;
			//console.log(cover);
			if (cover) coverUrl = true;
			this.setState({ cover, coverUrl });
		} catch (err) {
			console.log(err);
		}
		await this.getPermissionAsync();
		this.setState({ fontLoaded: true });
	}

	publieHandler = async () => {
		const {
			name: associationName,
			activity: activitySector,
			mail: email,
			country: countryName,
			cca2: countryCCA2,
			profil: profilPhoto,
			cover: coverPhoto,
			coverUrl,
			profilUrl,
			falseEmail
		} = this.state;

		if (falseEmail) return;
		try {
			const userUid = firebase.auth().currentUser.uid;
			const entryRef = firebase
				.firestore()
				.collection('associationUsers')
				.doc(userUid);
			await entryRef.set(
				{
					associationName,
					activitySector,
					email,
					countryName,
					countryCCA2
				},
				{ merge: true }
			);
			await firebase
				.auth()
				.currentUser.updateProfile({ displayName: associationName });
			const userBucket = firebase.storage().ref('users');
			if (profilPhoto && !profilUrl)
				userBucket.child(`${userUid}/profilPhoto`).putFile(profilPhoto);
			if (coverPhoto && !coverUrl)
				userBucket.child(`${userUid}/coverPhoto`).putFile(coverPhoto);
			this.props.navigation.push('Bio');
		} catch (err) {
			console.log(err);
		}
	};

	getPermissionAsync = async () => {
		if (Constants.platform.ios) {
			const { status } = await Permissions.askAsync(
				Permissions.CAMERA_ROLL
			);
			if (status !== 'granted') {
				alert(
					'Sorry, we need camera roll permissions to make this work!'
				);
			}
		}
	};

	_pickCover = async () => {
		let width = toPx(100, true);
		let height = toPx(18);
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [width, height],
			quality: 1
		});
		if (!result.cancelled) {
			this.setState({ cover: result.uri });
		}
	};

	_pickProfil = async () => {
		//let width = toPx(15);
		//let height = toPx(15);
		let width = toPx(15) * 1.609 * 0.50758;
		let height = toPx(16) * 1.609 * 0.50758 + 6;
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [width, height],
			quality: 1
		});
		if (!result.cancelled) {
			this.setState({ profil: result.uri });
		}
	};

	onSelect = country => {
		// console.log(country);
		// setCountryCode(country.cca2);
		// setCountry(country);
		this.setState({
			cca2: country.cca2,
			callingCode: country.callingCode[0],
			country: country.name
		});
	};

	render() {
		const { goBack } = this.props.navigation;
		const { cover, profil, name, mail, regexEmail } = this.state;

		const Picker = () => {
			return (
				<View
					style={{
						width: '100%',
						position: 'absolute',

						zIndex: 1,
						marginHorizontal: 'auto'
					}}
				>
					<TouchableOpacity
						style={styles.CoverPicturePicker}
						onPress={this._pickCover}
					>
						{cover ? (
							<Image
								source={{ uri: cover }}
								style={{ width: '100%', height: hp('18%') }}
							/>
						) : (
							<View style={{ top: '82%', left: '93%' }}>
								<MaterialIcon
									name='add-a-photo'
									size={hp('2.3%')}
									color='grey'
								/>
							</View>
						)}
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.ProfilePicturePicker}
						onPress={this._pickProfil}
					>
						<View
							style={{
								alignItems: 'center',
								width: '100%'
								// top: -(hp('15%') + hp('16%') / 2),
								// zIndex: -1
							}}
						>
							<PhotoProfil
								photoStyle={{
									width: hp('15%') * 1.609 * 0.50758,
									height: hp('16%') * 1.609 * 0.50758 + 6
								}}
								profil={profil}
								style={{
									width: hp('15%') * 1.60975,
									height: hp('15%'),
									position: 'absolute'
								}}
								displayText={
									Constants.platform.ios ? true : false
								}
								text={
									<TextSVG
										fill='#000'
										fontSize='7'
										fontWeight='regular'
										x='9'
										y='-12'
										strokeWidth='0'
									>
										j'ajoute{' '}
										<TSpan x='5' dy='9'>
											le logo
										</TSpan>
									</TextSVG>
								}
							/>
						</View>
					</TouchableOpacity>
				</View>
			);
		};

		return (
			<ApplicationProvider mapping={mapping} theme={lightTheme}>
				<View style={styles.droidSafeArea}>
					<IconRegistry icons={EvaIconsPack} />

					<ScrollView style={styles.mainContainer}>
						<View style={{ paddingBottom: hp('17%') }} />
						<View style={{ paddingBottom: hp('1.5%') }} />
						<Text style={styles.subText}>
							Pensez à confirmer votre adresse e-mail avant de
							publier vos missions.
						</Text>
						<View style={{ paddingBottom: hp('3%') }} />
						<Divider style={{ backgroundColor: '#E5E5E5' }} />

						<View style={{ paddingBottom: hp('3%') }} />
						<Text style={styles.title}>Nos informations</Text>
						<View style={{ paddingBottom: hp('5%') }} />
						<Text style={styles.info}>NOM DE L'ASSOCIATION</Text>
						<View style={styles.inputContainer}>
							<Input
								containerStyle={styles.inputContainerStyle}
								inputStyle={{
									marginLeft: 3,
									fontSize: hp('2%')
								}}
								inputContainerStyle={{
									borderBottomColor: '#E5E5E5'
								}}
								onChangeText={text => {
									this.setState({
										name: text
									});
								}}
								value={this.state.name}
							/>
						</View>
						<View style={{ paddingBottom: 5 }} />
						<Text style={styles.info}>SECTEUR D'ACTIVITÉ</Text>
						<View style={styles.inputContainer}>
							<Input
								containerStyle={styles.inputContainerStyle}
								inputStyle={{
									marginLeft: 3,
									fontSize: hp('2%')
								}}
								inputContainerStyle={{
									borderBottomColor: '#E5E5E5'
								}}
								onChangeText={text => {
									this.setState({
										activity: text
									});
								}}
								value={this.state.activity}
							/>
						</View>
						<View style={{ paddingBottom: 5 }} />
						<Text style={styles.info}>PAYS DE PROVENANCE</Text>
						<View style={{ paddingBottom: hp('2%') }} />

						<CountryPicker
							// withFilter={true}
							withFlag={true}
							withCountryNameButton={true}
							// withCallingCodeButton={true}
							withAlphaFilter={true}
							// withCallingCode={true}
							withEmoji={true}
							onSelect={this.onSelect}
							// visible
							countryCode={this.state.cca2}
							translation={'fra'}
							theme={{
								onBackgroundTextColor: '#000'
							}}
							// onOpen={() => this.setState({ color: '#000000' })}
							// onClose={() =>
							// 	this.setState({
							// 		color: '#FFFFFF'
							// 	})}
						/>

						<Divider
							style={{
								marginTop: hp('1%'),
								backgroundColor: '#E5E5E5',
								height: 1,
								marginRight: '2.5%'
							}}
						/>
						<View style={{ paddingBottom: hp('2%') }} />

						<Text style={styles.info}>ADRESSE E-MAIL</Text>
						<View style={styles.inputContainer}>
							<Input
								containerStyle={styles.inputContainerStyle}
								inputStyle={{
									marginLeft: 3,
									fontSize: hp('2%')
								}}
								inputContainerStyle={{
									borderBottomColor: '#E5E5E5'
								}}
								onChangeText={text => {
									this.setState({
										mail: text
									});
									if (!regexEmail.test(text))
										this.setState({ falseEmail: true });
									else this.setState({ falseEmail: true });
								}}
								value={this.state.mail}
							/>
						</View>

						<View style={{ paddingBottom: hp('7%') }} />
					</ScrollView>

					<TouchableOpacity
						style={{
							height: hp('7%'),
							width: wp('100%'),
							backgroundColor: '#FFBB01'
						}}
						onPress={this.publieHandler}
					>
						<Text
							style={{
								marginLeft: 'auto',
								marginRight: 'auto',
								marginTop: 'auto',
								marginBottom: 'auto',
								color: 'white',
								fontSize: hp('2.8%'),
								fontWeight: 'bold'
							}}
						>
							Je publie
						</Text>
					</TouchableOpacity>
				</View>

				<ProfilePicker
					profil={profil}
					cover={cover}
					_pickCover={this._pickCover}
					_pickProfil={this._pickProfil}
				/>
			</ApplicationProvider>
		);
	}
}
