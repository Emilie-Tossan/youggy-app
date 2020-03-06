import {
	createAppContainer,
	createSwitchNavigator,
	NavigationActions,
	SwitchActions
} from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import firebase from 'react-native-firebase';
import React, { useEffect, useState } from 'react';
import { Linking } from 'react-native';
// Test

import CalendarTestScreen from './src/screens/CalendarTestScreen';
import GeolocalisationTestScreen from './src/screens/GeolocalisationTestScreen';
import ImagePickerTestScreen from './src/screens/ImagePickerTestScreen';
import BottomNavigatorTestScreen from './src/screens/BottomNavigatorTestScreen';

// MainStack

import HomeScreen from './src/screens/HomeScreen';
import FlyingAnimation from './src/screens/FlyingAnimation';
import SwipeScreenAsso from './src/screens/SwipeScreenAsso';
import BottomNavAssoScreen from './src/screens/MainStack/BottomNavAssoScreen';
import InscriptionAssoScreen from './src/screens/InscriptionAssoScreen';

// Écrans de profile Association

import ProfileAssoScreen from './src/screens/ProfileFilesAsso/ProfileAssoScreen';
import ProfileFillAssoScreen from './src/screens/ProfileFilesAsso/ProfileFillAssoScreen';
import BioScreen from './src/screens/ProfileFilesAsso/BioScreen';
import ChangeMailAssoScreen from './src/screens/ProfileFilesAsso/ChangeMailAssoScreen';
import ChangeMailConfirmAssoScreen from './src/screens/ProfileFilesAsso/ChangeMailConfirmAssoScreen';
import ChangePasswordProfilAssoScreen from './src/screens/ProfileFilesAsso/ChangePasswordProfilAssoScreen';
import ForgotPasswordConfirmProfilAssoScreen from './src/screens/ProfileFilesAsso/ForgotPasswordConfirmProfilAssoScreen';
import ForgotPasswordProfilAssoScreen from './src/screens/ProfileFilesAsso/ForgotPasswordProfilAssoScreen';

// Écrans de missions Associations

import AcceptScreen from './src/screens/MissionsAssoFiles/AcceptScreen';
import PublishedMissionsScreen from './src/screens/MissionsAssoFiles/PublishedMissionsScreen';
import MissionCreationScreen from './src/screens/MissionsAssoFiles/MissionCreationScreen';
import MissionModificationScreen from './src/screens/MissionsAssoFiles/MissionModificationScreen';
import DateCreationScreen from './src/screens/MissionsAssoFiles/DateCreationScreen';
import HourCreationScreen from './src/screens/MissionsAssoFiles/HourCreationScreen';
import PlaceCreationScreen from './src/screens/MissionsAssoFiles/PlaceCreationScreen';
import AcceptProfileScreen from './src/screens/MissionsAssoFiles/AcceptProfileScreen';
import RemoveProfileScreen from './src/screens/MissionsAssoFiles/RemoveProfileScreen';

// Écrans de Inscription pour association

import HowContactAssoScreen from './src/screens/InscriptionFilesAsso/HowContactAssoScreen';
import ContactConfirmAssoScreen from './src/screens/InscriptionFilesAsso/ContactConfirmAssoScreen';
import PasswordCreationAssoScreen from './src/screens/InscriptionFilesAsso/PasswordCreationAssoScreen';

// Écrans de connexion pour association
import ConnexionScreen from './src/screens/ConnexionScreen';
import ForgotPasswordAssoScreen from './src/screens/ConnexionFilesAsso/ForgotPasswordAssoScreen';
import NeedHelpAssoScreen from './src/screens/ConnexionFilesAsso/NeedHelpAssoScreen';
import ChangePasswordAssoScreen from './src/screens/ConnexionFilesAsso/ChangePasswordAssoScreen';
import ChangeVerificationAssoScreen from './src/screens/ConnexionFilesAsso/ChangeVerificationAssoScreen';
import DoubleAuthAssoScreen from './src/screens/ConnexionFilesAsso/DoubleAuthAssoScreen';

// Écrans messages association

import MessagesAssoScreen from './src/screens/MessageAssoFiles/MessagesAssoScreen';
import InBoxAssoScreen from './src/screens/MessageAssoFiles/InBoxAssoScreen';

// const navigator = () => {
// 	return createStackNavigator(
// 		{
// 			//
// 			// Test
// 			//
// 			CalendarTest: CalendarTestScreen,
// 			GeolocalisationTest: GeolocalisationTestScreen,
// 			ImagePickerTest: ImagePickerTestScreen,
// 			BottomNavigatorTest: BottomNavigatorTestScreen,

// 			//
// 			// MainStack
// 			//

// 			Home: HomeScreen,
// 			Fly: FlyingAnimation,
// 			SwipeAsso: SwipeScreenAsso,
// 			BottomNavAsso: BottomNavAssoScreen,

// 			//
// 			// ProfileAsso
// 			//

// 			ProfileAsso: ProfileAssoScreen,
// 			ProfileFillAsso: ProfileFillAssoScreen,
// 			Bio: BioScreen,
// 			ChangeMailAsso: ChangeMailAssoScreen,
// 			ChangeMailConfirmAsso: ChangeMailConfirmAssoScreen,
// 			ChangePasswordProfilAsso: ChangePasswordProfilAssoScreen,
// 			ForgotPasswordConfirmProfilAsso: ForgotPasswordConfirmProfilAssoScreen,
// 			ForgotPasswordProfilAsso: ForgotPasswordProfilAssoScreen,

// 			//
// 			// Mission Asso
// 			//

// 			Accept: AcceptScreen,
// 			PublishedMissions: PublishedMissionsScreen,
// 			MissionCreation: MissionCreationScreen,
// 			MissionModification: MissionModificationScreen,
// 			DateCreation: DateCreationScreen,
// 			HourCreation: HourCreationScreen,
// 			PlaceCreation: PlaceCreationScreen,
// 			AcceptProfile: AcceptProfileScreen,
// 			RemoveProfile: RemoveProfileScreen,

// 			//
// 			// Messages Association
// 			//

// 			MessagesAsso: MessagesAssoScreen,
// 			InBoxAsso: InBoxAssoScreen,

// 			//
// 			// Inscription Asso
// 			//

// 			InscriptionAsso: InscriptionAssoScreen,
// 			HowContactAsso: HowContactAssoScreen,
// 			ContactConfirmAsso: ContactConfirmAssoScreen,
// 			PasswordCreationAsso: PasswordCreationAssoScreen,

// 			Connexion: ConnexionScreen,

// 			//
// 			// Connexion Asso
// 			//

// 			ForgotPasswordAsso: ForgotPasswordAssoScreen,
// 			NeedHelpAsso: NeedHelpAssoScreen,
// 			ChangePasswordAsso: ChangePasswordAssoScreen,
// 			ChangeVerificationAsso: ChangeVerificationAssoScreen,
// 			DoubleAuthAsso: DoubleAuthAssoScreen
// 		},
// 		{
// 			initialRouteName: 'Home',
// 			defaultNavigationOptions: {
// 				title: 'Youggy'
// 			}
// 		}
// 	);
// };

// export default createAppContainer(navigator());

const SwitchStack = (signedIn = false) => {
	return createSwitchNavigator(
		{
			loggedIn: createStackNavigator(
				{
					//
					// Main
					//

					BottomNavAsso: BottomNavAssoScreen,

					//
					// ProfileAsso
					//

					ProfileFillAsso: ProfileFillAssoScreen,
					Bio: BioScreen
				},
				{
					initialRouteName: 'BottomNavAsso',
					headerMode: 'none',
					header: null
				}
			),
			loggedOut: createStackNavigator(
				{
					//
					// Main
					//

					SwipeAsso: SwipeScreenAsso,

					//
					// Inscription Asso
					//

					InscriptionAsso: InscriptionAssoScreen,
					HowContactAsso: HowContactAssoScreen,
					ContactConfirmAsso: ContactConfirmAssoScreen,
					PasswordCreationAsso: PasswordCreationAssoScreen,

					//
					// Connexion Asso
					//
					Connexion: ConnexionScreen,
					ForgotPasswordAsso: ForgotPasswordAssoScreen,
					NeedHelpAsso: NeedHelpAssoScreen,
					ChangePasswordAsso: ChangePasswordAssoScreen,
					ChangeVerificationAsso: ChangeVerificationAssoScreen,
					DoubleAuthAsso: DoubleAuthAssoScreen
				},
				{
					initialRouteName: 'SwipeAsso',
					headerMode: 'none',
					header: null
				}
			)
		},
		{
			initialRouteName: signedIn ? 'loggedIn' : 'loggedOut'
		}
	);
};

//const App = createAppContainer(SwitchStack());

const App = props => {
	const [signedIn, setSignedIn] = useState(false);

	const channel = new firebase.notifications.Android.Channel(
		'youggy-asso-channel',
		'youggy asso Channel',
		firebase.notifications.Android.Importance.Max
	).setDescription('Youggy asso app channel');
	firebase
		.notifications()
		.android.createChannel(channel)
		.catch(e => console.log(e));

	useEffect(() => {
		firebase.auth().onAuthStateChanged(user => {
			if (user) {
				const userUid = user.uid;
				if (userUid) {
					const userRef = firebase
						.firestore()
						.collection('associationUsers')
						.doc(userUid);
					userRef
						.get()
						.then(snap =>
							setSignedIn(
								snap.data().signUpEnded &&
									snap.data().associationName
							)
						)
						.catch(err => setSignedIn(err === false));
				}
				return;
			}
			if (signedIn) setSignedIn(false);
		});
		return () => {};
	}, [signedIn]);

	const AppLayout = createAppContainer(SwitchStack(signedIn));

	return <AppLayout />;
};

export default App;
