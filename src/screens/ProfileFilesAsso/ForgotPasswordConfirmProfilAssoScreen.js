import React from 'react';
import {
	Text,
	View,
	SafeAreaView,
	TouchableOpacity,
	TextInput,
	StyleSheet,
	Image,
	Dimensions,
	Platform,
	Linking
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import * as Font from 'expo-font';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

import BackButton from '../Components/BackButton';
import { ScrollView } from 'react-native-gesture-handler';

import Icon from 'react-native-vector-icons/FontAwesome';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
// import { Progress } from 'nachos-ui';
import { ProgressBar, Colors } from 'react-native-paper';
import { DatePicker } from 'native-base';
import { Input, Button, Divider } from 'react-native-elements';
import {
	BottomNavigation,
	BottomNavigationTab,
	// Icon,
	IconRegistry,
	Layout,
	ApplicationProvider,
	OverflowMenu,
	Select,
	NativeDateService
} from '@ui-kitten/components';

import { mapping, light as lightTheme } from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';

import toPx from '../../utils/percentageToPx';
import dateToday from '../../utils/dateToday';

import Curseur from '../../../assets/svg-js/curseur';
import PhotoProfil from '../../../assets/svg-js/photo_profil';
import Suivant from '../../../assets/svg-js/suivant';
import ModifierRouge from '../../../assets/svg-js/modifier-rouge';

import BottomButton from '../Components/BottomButton';
import ProfilHeader from '../Components/ProfilHeader';
const Device = require('react-native-device-detection');

import firebase from 'react-native-firebase';
import { NavigationActions } from 'react-navigation';

const styles = StyleSheet.create({
	droidSafeArea: {
		flex: 1,
		backgroundColor: 'white'
	},
	mainContainer: {
		top: hp('8%'),
		width: wp('100%'),
		marginTop: 'auto',
		marginBottom: 'auto',
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
		color: '#FFBB01',
		fontSize: hp('3%'),
		fontWeight: 'bold',
		textAlign: 'center'
	},
	info: {
		fontSize: hp('1.5%'),
		color: 'black'
	},
	subText: {
		fontSize: hp('2%'),
		color: 'black',
		textAlign: 'center',
		fontWeight: '300'
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

	state = {
		profil: null,
		cover: null
	};
	static navigationOptions = {
		header: null
	};

	appWokeUp = url => {
		const signedIn = firebase.auth().currentUser ? true : false;
		if (!signedIn) return;
		if (url) {
			const regex = /[?&]([^=#]+)=([^&#]*)/g;
			let params = {};
			let match;
			while ((match = regex.exec(url.url))) {
				params[match[1]] = match[2];
			}
			let actionNav = null;
			if (params.mode === 'resetPassword') {
				actionNav = NavigationActions.navigate({
					routeName: 'ForgotPasswordProfilAsso',
					params: { params }
				});
			}
			if (actionNav) this.props.navigation.dispatch(actionNav);
		}
	};

	componentWillUnmount() {
		Linking.removeEventListener('url', this.appWokeUp);
	}

	async componentDidMount() {
		if (!this.props.navigation.getParam('redirected', false))
			Linking.addEventListener('url', this.appWokeUp);
		try {
			const userUid = firebase.auth().currentUser.uid;
			const profil = await firebase
				.storage()
				.ref(`users/${userUid}/profilPhoto`)
				.getDownloadURL()
				.catch(err => console.log(err) === 1);
			const profilDefault = await firebase
				.storage()
				.ref(`icone-profil-association.png`)
				.getDownloadURL()
				.catch(err => console.log(err) === 1);
			const cover = await firebase
				.storage()
				.ref(`users/${userUid}/coverPhoto`)
				.getDownloadURL()
				.catch(err => console.log(err) === 1);
			if (cover) this.setState({ cover });
			if (profil) this.setState({ profil });
			else this.setState({ profil: profilDefault });
			//console.log(cover, profil);
			const email = firebase.auth().currentUser.email;
			if (this.props.navigation.getParam('backWithLink', false))
				this.props.navigation.push('ForgotPasswordProfilAsso', {
					params: this.props.navigation.getParam('params', {})
				});
			else await firebase.auth().sendPasswordResetEmail(email);
		} catch (err) {
			console.log(err);
		}
	}

	render() {
		const { goBack } = this.props.navigation;

		const { cover, profil } = this.state;

		return (
			<ApplicationProvider mapping={mapping} theme={lightTheme}>
				<View style={styles.droidSafeArea}>
					<IconRegistry icons={EvaIconsPack} />
					<ProfilHeader profil={profil} cover={cover} />

					<View
						style={{
							top: hp('15%')
						}}
					>
						<BackButton
							text='Retour'
							color='black'
							goBack={goBack}
						/>
					</View>
					<View style={styles.mainContainer}>
						<Text style={styles.title}>
							Je confirme mon adresse e-mail
						</Text>
						<View style={{ paddingBottom: hp('5%') }} />
						<Text style={styles.subText}>
							Un e-mail a été envoyé à{' '}
							<Text
								style={{ color: '#FFBB01', fontWeight: 'bold' }}
							>
								{this.props.navigation.getParam(
									'email',
									'votre adresse e-mail'
								)}
							</Text>
							. Pour mettre à jour le mot de passe, ouvrez le et
							cliquez sur le lien qui apparaît.
						</Text>
					</View>
					<View />
				</View>
				<TouchableOpacity
					style={{
						height: hp('7%'),
						width: wp('100%'),
						backgroundColor: '#FFBB01'
					}}
					onPress={() => {
						const url =
							Platform.OS === 'ios'
								? 'mail://'
								: 'https://mail.google.com/mail/u/0/#inbox';
						Linking.canOpenURL(url)
							.then(supported => {
								if (!supported) {
									console.log("Can't handle url: " + url);
								} else {
									return Linking.openURL(url);
								}
							})
							.catch(err =>
								console.log('An error occurred', err)
							);
					}}
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
						Je vais voir mes mails
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={{
						height: hp('13%'),
						width: wp('100%'),
						backgroundColor: '#FFBB01'
					}}
					onPress={() => {
						const url =
							Platform.OS === 'ios'
								? 'mail://'
								: 'https://mail.google.com/mail/u/0/#inbox';
						Linking.canOpenURL(url)
							.then(supported => {
								if (!supported) {
									console.log("Can't handle url: " + url);
								} else {
									return Linking.openURL(url);
								}
							})
							.catch(err =>
								console.log('An error occurred', err)
							);
					}}
				/>
			</ApplicationProvider>
		);
	}
}
