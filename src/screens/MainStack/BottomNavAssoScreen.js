import {
	BottomNavigation,
	BottomNavigationTab,
	Icon,
	IconRegistry,
	Layout,
	ApplicationProvider,
	Tab,
	TabView
} from '@ui-kitten/components';
import { Input, Divider } from 'react-native-elements';

import { mapping, light as lightTheme } from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';

import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import React, { Component, Fragment } from 'react';
import {
	Text,
	View,
	TouchableOpacity,
	TextInput,
	StyleSheet,
	Platform
} from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { LinearGradient } from 'expo-linear-gradient';
import { NavigationActions } from 'react-navigation';
import CodeInput from 'react-native-confirmation-code-input';
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';

import ProfileActive from '../../../assets/svg-js/ProfileActive';
import ProfileDesactive from '../../../assets/svg-js/ProfileDesactive';
import MissionActive from '../../../assets/svg-js/MissionActive';
import MissionDesactive from '../../../assets/svg-js/MissionDesactive';
import MessageActive from '../../../assets/svg-js/MessageActive';
import MessageDesactive from '../../../assets/svg-js/MessageDesactive';
import Notification from '../../../assets/svg-js/Notification';

// Écrans de profile Association

import ProfileAssoScreen from '../ProfileFilesAsso/ProfileAssoScreen';
import ProfileFillAssoScreen from '../ProfileFilesAsso/ProfileFillAssoScreen';
import ProfileFillAsso2Screen from '../ProfileFilesAsso/ProfileFillAsso2Screen';
import BioScreen from '../ProfileFilesAsso/BioScreen';
import Bio2Screen from '../ProfileFilesAsso/Bio2Screen';
import ChangeMailAssoScreen from '../ProfileFilesAsso/ChangeMailAssoScreen';
import ChangeMailConfirmAssoScreen from '../ProfileFilesAsso/ChangeMailConfirmAssoScreen';
import ChangePasswordProfilAssoScreen from '../ProfileFilesAsso/ChangePasswordProfilAssoScreen';
import ForgotPasswordConfirmProfilAssoScreen from '../ProfileFilesAsso/ForgotPasswordConfirmProfilAssoScreen';
import ForgotPasswordProfilAssoScreen from '../ProfileFilesAsso/ForgotPasswordProfilAssoScreen';

// Écrans de missions Associations

import AcceptScreen from '../MissionsAssoFiles/AcceptScreen';
import PublishedMissionsScreen from '../MissionsAssoFiles/PublishedMissionsScreen';
import MissionCreationScreen from '../MissionsAssoFiles/MissionCreationScreen';
import MissionModificationScreen from '../MissionsAssoFiles/MissionModificationScreen';
import DateCreationScreen from '../MissionsAssoFiles/DateCreationScreen';
import HourCreationScreen from '../MissionsAssoFiles/HourCreationScreen';
import PlaceCreationScreen from '../MissionsAssoFiles/PlaceCreationScreen';
import AcceptProfileScreen from '../MissionsAssoFiles/AcceptProfileScreen';
import RemoveProfileScreen from '../MissionsAssoFiles/RemoveProfileScreen';

// Écrans messages association

import MessagesAssoScreen from '../MessageAssoFiles/MessagesAssoScreen';
import InBoxAssoScreen from '../MessageAssoFiles/InBoxAssoScreen';

import firebase from 'react-native-firebase';
// import { Notifications } from 'react-native-notifications';
import uuid from 'uuid';

const Device = require('react-native-device-detection');

const styles = StyleSheet.create({
	screenContainer: {
		width: '100%',
		height: '100%'
	},
	mainContainer: {
		marginLeft: 'auto',
		marginRight: 'auto',
		height: '100%',
		width: '100%',
		top: '-2%'
	},
	//
	// Bottom navigator
	//
	bottomContainer: {
		top: -hp('10%'),
		height: hp('10%')
	},
	bottomNavigation: {
		height: hp('10%')
	}
});

const ProfileAssoStack = createStackNavigator(
	{
		ProfileAsso: ProfileAssoScreen,
		ProfileFillAsso: ProfileFillAssoScreen,
		ProfileFillAsso2: ProfileFillAsso2Screen,
		Bio: BioScreen,
		Bio2: Bio2Screen,
		ChangeMailAsso: ChangeMailAssoScreen,
		ChangeMailConfirmAsso: ChangeMailConfirmAssoScreen,
		ChangePasswordProfilAsso: ChangePasswordProfilAssoScreen,
		ForgotPasswordConfirmProfilAsso: ForgotPasswordConfirmProfilAssoScreen,
		ForgotPasswordProfilAsso: ForgotPasswordProfilAssoScreen
	},
	{
		initialRouteName: 'ProfileAsso',
		headerMode: 'none',
		header: null
	}
);
const ProfileAssoRoute = createAppContainer(ProfileAssoStack);

const MissionAssoStack = createStackNavigator(
	{
		Accept: AcceptScreen,
		PublishedMissions: PublishedMissionsScreen,
		MissionCreation: MissionCreationScreen,
		MissionModification: MissionModificationScreen,
		DateCreation: DateCreationScreen,
		HourCreation: HourCreationScreen,
		PlaceCreation: PlaceCreationScreen,
		AcceptProfile: AcceptProfileScreen,
		RemoveProfile: RemoveProfileScreen,
		MessagesAsso: MessagesAssoScreen
	},
	{
		initialRouteName: 'PublishedMissions',
		headerMode: 'none',
		header: null
	}
);
const MissionAssoRoute = createAppContainer(MissionAssoStack);

const MessageAssoStack = createStackNavigator(
	{
		InBoxAsso: InBoxAssoScreen,
		MessagesAsso: MessagesAssoScreen
	},
	{
		initialRouteName: 'InBoxAsso',
		headerMode: 'none',
		header: null
	}
);
const MessageAssoRoute = createAppContainer(MessageAssoStack);

export default class App extends React.Component {
	state = {
		topSelectedIndex: 0,
		bottomSelectedIndex: 0,
		selectedIndex: 0,
		MissionsNotif: 0,
		MessagesNotif: 0,
		missionsRegister: [],
		messagesRegister: [],
		logo: ''
	};

	static navigationOptions = {
		header: null
	};

	async componentDidMount() {
		try {
			const logo = await firebase
				.storage()
				.ref('ic_launcher.png')
				.getDownloadURL();
			if (Platform.OS === 'ios') PushNotificationIOS.requestPermissions();
			this.setState({ logo });
		} catch (error) {
			console.log(error);
		}
	}

	missionsNotifFunc = async (missionList = []) => {
		let { missionsRegister, logo } = this.state;
		let notif = 0;
		const ids = [];
		for (let i = 0; i < missionList.length; i++) {
			const { demande: one, id } = missionList[i];
			if (one) {
				notif += 1;
				ids.push(id);
			} else {
				missionsRegister = missionsRegister.filter(old => old !== id);
			}
		}
		let thereIsNew = false;
		for (let i = 0; i < ids.length; i++) {
			const old = ids[i];
			let breaked = false;
			for (let ii = 0; ii < missionsRegister.length; ii++) {
				const newId = missionsRegister[ii];
				if (newId === old) {
					breaked = true;
					break;
				}
			}
			if (!breaked) {
				thereIsNew = true;
				missionsRegister.push(old);
			}
		}
		//console.log('tab1 :', missionsRegister);
		//console.log('tab2 :', ids);
		this.setState({
			MissionsNotif: notif,
			missionsRegister
		});
		if (notif > 0 && thereIsNew) {
			if (Platform.OS === 'ios') {
				// Notifications.ios
				// 	.checkPermissions()
				// 	.then(permissions => {
				// 		if (permissions.badge) {
				// 			let localNotification = Notifications.postLocalNotification(
				// 				{
				// 					body:
				// 						'Un ou plusieurs bénévole(s) a/ont envoyé une candidature pour une mission.',
				// 					title:
				// 						'Nouvelle(s) candidature(s) reçue(s)!'
				// 				}
				// 			);
				// 		}
				// 	})
				// 	.catch(e => console.log(e));
				const notification = new firebase.notifications.Notification()
					.setNotificationId(uuid())
					.setTitle('YOUGGY ASSO')
					.setBody('Nouvelle(s) candidature(s) reçue(s)!');

				notification.android
					.setChannelId('youggy-asso-channel')
					.android.setBigPicture(logo);
				await firebase
					.notifications()
					.displayNotification(notification)
					.catch(e => console.log(e));
			} else {
				// let localNotification = Notifications.postLocalNotification({
				//     body:
				//         "Un ou plusieurs bénévole(s) a/ont envoyé une candidature pour une mission.",
				//     title: "Nouvelle(s) candidature(s) reçue(s)!"
				// });
				const notification = new firebase.notifications.Notification()
					.setNotificationId(uuid())
					.setTitle('YOUGGY ASSO')
					.setBody('Nouvelle(s) candidature(s) reçue(s)!');

				notification.android
					.setChannelId('youggy-asso-channel')
					.android.setBigPicture(logo);
				await firebase
					.notifications()
					.displayNotification(notification)
					.catch(e => console.log(e));
			}
		}
	};

	messagesNotifFunc = async (messageList = []) => {
		let { messagesRegister, logo } = this.state;
		let notif = 0;
		const ids = [];
		for (let i = 0; i < messageList.length; i++) {
			const { notif: one, id } = messageList[i];
			if (one) {
				notif += 1;
				ids.push(id);
			} else {
				messagesRegister = messagesRegister.filter(old => old !== id);
			}
		}
		let thereIsNew = false;

		for (let i = 0; i < ids.length; i++) {
			const old = ids[i];
			let breaked = false;
			for (let ii = 0; ii < messagesRegister.length; ii++) {
				const newId = messagesRegister[ii];
				if (newId === old) {
					breaked = true;
					break;
				}
			}
			if (!breaked) {
				thereIsNew = true;
				messagesRegister.push(old);
			}
		}
		this.setState({
			MessagesNotif: notif,
			messagesRegister
		});
		if (notif > 0 && thereIsNew) {
			if (Platform.OS === 'ios') {
				// Notifications.ios
				// 	.checkPermissions()
				// 	.then(permissions => {
				// 		if (permissions.badge) {
				// 			let localNotification = Notifications.postLocalNotification(
				// 				{
				// 					body:
				// 						'Un ou plusieurs bénévole(s) a/ont envoyé un message.',
				// 					title: 'Nouveau(x) message(x) reçu(s)!'
				// 				}
				// 			);
				// 		}
				// 	})
				// 	.catch(e => console.log(e));
				const notification = new firebase.notifications.Notification()
					.setNotificationId(uuid())
					.setTitle('YOUGGY ASSO')
					.setBody('Nouveau(x) message(x) reçu(s)!');

				notification.android
					.setChannelId('youggy-asso-channel')
					.android.setBigPicture(logo);
				await firebase
					.notifications()
					.displayNotification(notification)
					.catch(e => console.log(e));
			} else {
				// let localNotification = Notifications.postLocalNotification({
				// 	body:
				// 		'Un ou plusieurs bénévole(s) a/ont envoyé un message.',
				// 	title: 'Nouveau(x) message(x) reçu(s)!'
				// });
				const notification = new firebase.notifications.Notification()
					.setNotificationId(uuid())
					.setTitle('YOUGGY ASSO')
					.setBody('Nouveau(x) message(x) reçu(s)!');

				notification.android
					.setChannelId('youggy-asso-channel')
					.android.setBigPicture(logo);
				await firebase
					.notifications()
					.displayNotification(notification)
					.catch(e => console.log(e));
			}
		}
	};

	ProfilIcon = () => {
		if (this.state.bottomSelectedIndex == 0)
			return <ProfileActive color='#FFBB01' />;
		else return <ProfileDesactive />;
	};

	MissionIcon = () => {
		if (this.state.bottomSelectedIndex == 1)
			return (
				<View>
					<MissionActive color='#FFBB01' />
					{this.state.MissionsNotif ? (
						<Notification
							width={wp('5%')}
							height={wp('5%')}
							displayText={true}
							style={{ left: wp('5.5%'), top: wp('-8.15%') }}
							demande={
								this.state.MissionsNotif <= 5
									? this.state.MissionsNotif
									: '5+'
							}
						/>
					) : (
						<View />
					)}
				</View>
			);
		else
			return (
				<View>
					<MissionDesactive />
					{this.state.MissionsNotif ? (
						<Notification
							width={wp('5%')}
							height={wp('5%')}
							displayText={true}
							style={{ left: wp('5.5%'), top: wp('-8%') }}
							demande={
								this.state.MissionsNotif <= 5
									? this.state.MissionsNotif
									: '5+'
							}
						/>
					) : (
						<View />
					)}
				</View>
			);
	};

	MessageIcon = () => {
		if (this.state.bottomSelectedIndex == 2)
			return (
				<View>
					<MessageActive color='#FFBB01' />
					{this.state.MessagesNotif ? (
						<Notification
							width={wp('5%')}
							height={wp('5%')}
							displayText={true}
							style={{ left: wp('5%'), top: wp('-8%') }}
							demande={
								this.state.MessagesNotif <= 5
									? this.state.MessagesNotif
									: '5+'
							}
						/>
					) : (
						<View />
					)}
				</View>
			);
		else
			return (
				<View>
					<MessageDesactive />
					{this.state.MessagesNotif ? (
						<Notification
							width={wp('5%')}
							height={wp('5%')}
							displayText={true}
							style={{ left: wp('5%'), top: wp('-8%') }}
							demande={
								this.state.MessagesNotif <= 5
									? this.state.MessagesNotif
									: '5+'
							}
						/>
					) : (
						<View />
					)}
				</View>
			);
	};

	render() {
		const { bottomSelectedIndex } = this.state;
		const { goBack } = this.props.navigation;
		return (
			<View style={styles.screenContainer}>
				<IconRegistry icons={EvaIconsPack} />
				<ApplicationProvider mapping={mapping} theme={lightTheme}>
					<TabView
						indicatorStyle={{
							backgroundColor: 'transparent'
						}}
						selectedIndex={bottomSelectedIndex}
						style={styles.mainContainer}
						onOffsetChange={index =>
							this.setState({ bottomSelectedIndex: index })
						}
						onSelect={index =>
							this.setState({ bottomSelectedIndex: index })
						}
					>
						<Tab>
							<View style={{ height: '105%' }}>
								<ProfileAssoRoute />
							</View>
						</Tab>
						<Tab>
							<View style={{ height: '105%' }}>
								<MissionAssoRoute
									screenProps={{
										notifCapture: this.missionsNotifFunc
									}}
								/>
							</View>
						</Tab>
						<Tab>
							<View style={{ height: '105%' }}>
								<MessageAssoRoute
									screenProps={{
										notifCapture: this.messagesNotifFunc
									}}
								/>
							</View>
						</Tab>
					</TabView>
					<View style={styles.bottomContainer}>
						<Divider
							style={{
								height: 1,
								backgroundColor: '#DFDFDF',
								left: hp('-10%'),
								width: hp('120%')
							}}
						/>
						<BottomNavigation
							style={styles.bottomNavigation}
							selectedIndex={bottomSelectedIndex}
							onSelect={index => {
								//console.log(index);
								this.setState({
									bottomSelectedIndex: index
								});
							}}
							indicatorStyle={{
								backgroundColor: '#FFBB01'
							}}
						>
							<BottomNavigationTab
								titleStyle={{
									color:
										bottomSelectedIndex == 0
											? '#FFBB01'
											: '#AAAAAA'
								}}
								title='PROFIL'
								icon={this.ProfilIcon}
							/>
							<BottomNavigationTab
								titleStyle={{
									color:
										bottomSelectedIndex == 1
											? '#FFBB01'
											: '#AAAAAA'
								}}
								title='MISSIONS'
								icon={this.MissionIcon}
							/>
							<BottomNavigationTab
								titleStyle={{
									color:
										bottomSelectedIndex == 2
											? '#FFBB01'
											: '#AAAAAA'
								}}
								title='MESSAGES'
								icon={this.MessageIcon}
							/>
						</BottomNavigation>
					</View>
				</ApplicationProvider>
			</View>
		);
	}
}
