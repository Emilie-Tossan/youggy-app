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
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import * as Font from 'expo-font';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

import { ScrollView } from 'react-native-gesture-handler';

import { Input, Button, Divider } from 'react-native-elements';

import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import toPx from '../../utils/percentageToPx';
import ProfilHeader from '../Components/ProfilHeader';

import PhotoProfil from '../../../assets/svg-js/photo_profil';
import Cadenas from '../../../assets/svg-js/cadenas';
import Deconnection from '../../../assets/svg-js/deconnection';
import Benevoles from '../../../assets/svg-js/Benevoles';
import Presentation from '../../../assets/svg-js/presentation';
import ModifierInformations from '../../../assets/svg-js/modifier-informations';
import PlaceAsso from '../Other/PlaceAsso';

import firebase from 'react-native-firebase';
import {
	NavigationActions,
	SwitchActions,
	StackActions
} from 'react-navigation';

const Device = require('react-native-device-detection');

const styles = StyleSheet.create({
	droidSafeArea: {
		backgroundColor: 'white',
		width: '100%',
		height: '100%'
	},
	mainContainer: {
		width: wp('100%'),
		marginLeft: 'auto',
		marginRight: 'auto',

		paddingLeft: wp('10%'),
		paddingRight: wp('10%')
	},
	//
	// Picture
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
	name: {
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: hp('3%')
	},
	info: {
		textAlign: 'center',

		fontSize: hp('2.2%')
	},
	subTitle: {
		textAlign: 'center',
		color: '#FFBB01',
		fontSize: hp('2.3%'),
		fontWeight: 'bold'
	},
	text: {
		textAlign: 'center',
		fontSize: hp('1.7%'),
		fontWeight: '300'
	},
	//
	// Profile
	//

	param: {
		left: wp('90%'),
		top: hp('20%'),
		height: hp('5%'),
		width: hp('5%'),
		position: 'absolute'
	},
	//
	// Menu
	//
	menuTile: {
		height: hp('6%'),
		marginLeft: 'auto',
		marginRight: 'auto',
		marginTop: 'auto',
		marginBottom: 'auto',
		width: '100%',
		flexDirection: 'row',
		backgroundColor: 'white'
	},
	menuIconContainer: {
		paddingLeft: hp('2.8%'),
		paddingRight: hp('2.3%'),
		marginTop: 'auto',
		marginBottom: 'auto'
	},
	textMenuTile: {
		textAlign: 'center',
		marginTop: 'auto',
		marginBottom: 'auto',
		fontSize: hp('2%')
	},
	//
	// Bottom container
	//
	bottomContainer: {
		height: hp('10%'),
		top: hp('-47.5%')
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
		whoWeAre: '',
		whoWeSearch: '',
		associationName: '',
		activitySector: '',
		whereWeAre: []
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
			switch (params.mode) {
				case 'resetPassword':
					actionNav = NavigationActions.navigate({
						routeName: 'ForgotPasswordConfirmProfilAsso',
						params: { backWithLink: true, params }
					});
					break;
				case 'verifyEmail':
					actionNav = NavigationActions.navigate({
						routeName: 'ChangeMailConfirmAsso',
						params: { backWithLink: true, params }
					});
					break;
				default:
					break;
			}
			if (actionNav) this.props.navigation.dispatch(actionNav);
		}
	};

	componentWillUnmount() {
		Linking.removeEventListener('url', this.appWokeUp);
	}

	async componentDidMount() {
		if (!this.props.navigation.getParam('redirected', false)) {
			Linking.getInitialURL()
				.then(url => {
					if (url) {
						this.appWokeUp({ url });
					}
				})
				.catch(e => {
					console.log(e);
				});
			Linking.addEventListener('url', this.appWokeUp);
		}
		await Font.loadAsync({
			'SF-pro': require('../../../assets/fonts/SF-Pro-Text-Regular.otf'),
			'Montserrat-light': require('../../../assets/fonts/Montserrat-Light.ttf')
		});
		this.setState({ fontLoaded: true });
		try {
			const userUid = firebase.auth().currentUser.uid;
			const emailVerified = firebase.auth().currentUser.emailVerified;
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
				.ref(`icone-profil-association.png`)
				.getDownloadURL()
				.catch(err => console.log(err) === 1);
			const refresh = this.props.navigation.getParam('refresh', false);
			const coverRef = this.props.navigation.getParam('cover', null);
			const profilRef = this.props.navigation.getParam('profil', null);
			if (cover)
				this.setState({
					cover: refresh && coverRef ? coverRef : cover
				});
			if (profil)
				this.setState({
					profil: refresh && profilRef ? profilRef : profil
				});
			else
				this.setState({
					profil: refresh && profilRef ? profilRef : profilDefault
				});

			const userRef = firebase
				.firestore()
				.collection('associationUsers')
				.doc(userUid);
			const snapshotDb = await userRef.get();
			if (emailVerified && !snapshotDb.data().verifiedEmail)
				await userRef.set(
					{ verifiedEmail: emailVerified },
					{ merge: true }
				);
			if (!emailVerified && snapshotDb.data().verifiedEmail)
				await userRef.set(
					{ verifiedEmail: emailVerified },
					{ merge: true }
				);
			this.setState({
				whoWeAre: snapshotDb.data().whoWeAre,
				whoWeSearch: snapshotDb.data().whoWeSearch,
				associationName: snapshotDb.data().associationName,
				activitySector: snapshotDb.data().activitySector,
				whereWeAre: snapshotDb.data().whereWeAre
					? snapshotDb.data().whereWeAre
					: []
			});
		} catch (err) {
			console.log(err);
		}
		// if (this.props.navigation.getParam('refresh', false))
		// 	this.props.navigation.reset(
		// 		[StackActions.push({ routeName: 'ProfileAsso' })],
		// 		0
		// 	);
	}

	render() {
		// const { goBack } = this.props.navigation;
		const {
			cover,
			profil,
			menu,
			whoWeAre,
			whoWeSearch,
			associationName,
			activitySector,
			whereWeAre
		} = this.state;

		const Menu = () => {
			return (
				<View style={{ position: 'absolute', width: '100%' }}>
					<Divider />
					<TouchableOpacity
						style={styles.menuTile}
						onPress={() => {
							this.setState({ menu: !menu });
							this.props.navigation.navigate('ProfileFillAsso2');
						}}
					>
						<View style={styles.menuIconContainer}>
							<Presentation />
						</View>
						<Text style={styles.textMenuTile}>
							Mes Informations Personnelles
						</Text>
					</TouchableOpacity>
					<Divider />
					<TouchableOpacity
						style={styles.menuTile}
						onPress={() => {
							this.setState({ menu: !menu });
							this.props.navigation.push('Bio2');
						}}
					>
						<View style={styles.menuIconContainer}>
							<Benevoles />
						</View>
						<Text style={styles.textMenuTile}>
							Mes compétences/Centres d'Intêret
						</Text>
					</TouchableOpacity>
					<Divider />
					<TouchableOpacity
						style={styles.menuTile}
						onPress={() => {
							this.setState({ menu: !menu });
							this.props.navigation.push(
								'ChangePasswordProfilAsso'
							);
						}}
					>
						<View style={styles.menuIconContainer}>
							<Cadenas color='#FFBB01' />
						</View>
						<Text style={styles.textMenuTile}>
							Changer Le Mot De Passe
						</Text>
					</TouchableOpacity>
					<Divider />
					<TouchableOpacity
						onPress={async () => {
							await firebase.auth().signOut();
							this.props.navigation.dispatch(
								SwitchActions.jumpTo({ routeName: 'loggedOut' })
							);
							/*
							this.props.navigation.reset(
								[
									NavigationActions.navigate({
										routeName: 'loggedOut'
									})
								],
								0
							);*/
							//this.props.navigation.navigate('loggedOut');
						}}
						style={styles.menuTile}
					>
						<View style={styles.menuIconContainer}>
							<Deconnection color='#FFBB01' />
						</View>
						<Text style={styles.textMenuTile}>Déconnexion</Text>
					</TouchableOpacity>
				</View>
			);
		};
		return (
			<View>
				<View style={styles.droidSafeArea}>
					<ScrollView style={styles.mainContainer}>
						<View style={{ paddingBottom: hp('27%') }} />
						<Text style={styles.name}>{associationName}</Text>
						<Text style={styles.info}>{activitySector}</Text>
						<View style={{ paddingBottom: hp('5%') }} />
						<Text style={styles.subTitle}>QUI SOMMES-NOUS?</Text>
						<View style={{ paddingBottom: hp('2%') }} />
						<Divider />
						<View style={{ paddingBottom: hp('2%') }} />
						<Text style={styles.text}>{whoWeAre}</Text>
						<View style={{ paddingBottom: hp('3%') }} />
						<Text style={styles.subTitle}>NOS BESOINS</Text>
						<View style={{ paddingBottom: hp('2%') }} />
						<Divider />
						<View style={{ paddingBottom: hp('2%') }} />
						<Text style={styles.text}>{whoWeSearch}</Text>
						<View style={{ paddingBottom: hp('2%') }} />
						<Divider />
						<View style={{ paddingBottom: hp('2%') }} />
						<PlaceAsso
							itemsList={whereWeAre}
							isNotRemovable={true}
						/>
						<View style={{ paddingBottom: hp('3%') }} />
						<View style={{ paddingBottom: hp('45%') }} />
					</ScrollView>
				</View>

				<View style={styles.bottomContainer}>
					{menu ? <Menu /> : <View />}
				</View>
				<ProfilHeader profil={profil} cover={cover} />
				<TouchableOpacity
					style={styles.param}
					onPress={() => this.setState({ menu: !menu })}
				>
					<ModifierInformations />
				</TouchableOpacity>
			</View>
		);
	}
}
