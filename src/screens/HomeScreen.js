import React from 'react';
import { Text, StyleSheet, View, Button, ScrollView } from 'react-native';

const HomeScreen = ({ navigation }) => {
	return (
		<ScrollView>
			<Text style={styles.text}>Youggy Test Screen</Text>
			<Button
				onPress={() => navigation.navigate('Fly')}
				title="Go to FlyingAnimation demo"
			/>
			<Button
				onPress={() => navigation.navigate('CalendarTest')}
				title="Go to CalendarTest demo"
			/>
			<Button
				onPress={() => navigation.navigate('GeolocalisationTest')}
				title="Go to GeolocalisationTest demo"
			/>
			<Button
				onPress={() => navigation.navigate('ImagePickerTest')}
				title="Go to ImagePickerTest demo"
			/>
			<Button
				onPress={() => navigation.navigate('BottomNavigatorTest')}
				title="Go to BottomNavigatorTest demo"
			/>

			<Text />
			<Text />
			<Text />
			<Text />
			<Button
				onPress={() => navigation.navigate('BottomNavAsso')}
				title="Go to BottomNavAsso demo"
			/>
			<Text />
			<Text />
			<Text />
			<Text />
			<Text />
			<Text />
			<Text>Messages Association</Text>
			<Button
				onPress={() => navigation.navigate('MessagesAsso')}
				title="Go to MessagesAsso demo"
			/>
			<Button
				onPress={() => navigation.navigate('InBoxAsso')}
				title="Go to InBoxAsso demo"
			/>
			<Text />
			<Text />
			<Text />
			<Text>Mission Asso</Text>
			<Button
				onPress={() => navigation.navigate('Accept')}
				title="Go to Accept demo"
			/>
			<Button
				onPress={() => navigation.navigate('PublishedMissions')}
				title="Go to PublishedMissions demo"
			/>
			<Button
				onPress={() => navigation.navigate('MissionCreation')}
				title="Go to MissionCreation demo"
			/>
			<Button
				onPress={() => navigation.navigate('MissionModification')}
				title="Go to MissionModification demo"
			/>
			<Button
				onPress={() => navigation.navigate('DateCreation')}
				title="Go to DateCreation demo"
			/>
			<Button
				onPress={() => navigation.navigate('HourCreation')}
				title="Go to HourCreation demo"
			/>
			<Button
				onPress={() => navigation.navigate('PlaceCreation')}
				title="Go to PlaceCreation demo"
			/>
			<Button
				onPress={() => navigation.navigate('AcceptProfile')}
				title="Go to AcceptProfile demo"
			/>
			<Button
				onPress={() => navigation.navigate('RemoveProfile')}
				title="Go to RemoveProfile demo"
			/>
			<Text />
			<Text />

			<Text> Profile Asso</Text>
			<Button
				onPress={() => navigation.navigate('ProfileAsso')}
				title="Go to ProfileAsso demo"
			/>
			<Button
				onPress={() => navigation.navigate('ProfileFillAsso')}
				title="Go to ProfileFillAsso demo"
			/>
			<Button
				onPress={() => navigation.navigate('Bio')}
				title="Go to Bio demo"
			/>
			<Button
				onPress={() => navigation.navigate('ChangeMailAsso')}
				title="Go to ChangeMailAsso demo"
			/>
			<Button
				onPress={() => navigation.navigate('ChangeMailConfirmAsso')}
				title="Go to ChangeMailConfirmAsso demo"
			/>
			<Button
				onPress={() => navigation.navigate('ChangePasswordProfilAsso')}
				title="Go to ChangePasswordProfilAsso demo"
			/>

			<Button
				onPress={() =>
					navigation.navigate('ForgotPasswordConfirmProfilAsso')}
				title="Go to ForgotPasswordConfirmProfilAsso demo"
			/>
			<Button
				onPress={() => navigation.navigate('ForgotPasswordProfilAsso')}
				title="Go to ForgotPasswordProfilAsso demo"
			/>
			<Text />
			<Text />
			<Text />
			<Text> Main stack </Text>

			<Button
				onPress={() => navigation.navigate('SwipeAsso')}
				title="Go to SwipeAsso demo"
			/>

			{/* <Button
				onPress={() => navigation.navigate('ProfileCreation')}
				title="Go to ProfileCreation demo"
			/>
			<Button
				onPress={() => navigation.navigate('Profile')}
				title="Go to Profile demo"
			/>
			<Button
				onPress={() => navigation.navigate('Main')}
				title="Go to Main demo"
			/>
			<Button
				onPress={() => navigation.navigate('ProfileCreationAsso')}
				title="Go to ProfileCreationAsso demo"
			/>
			<Button
				onPress={() => navigation.navigate('ProfileAsso')}
				title="Go to ProfileAsso demo"
			/>
			<Button
				onPress={() => navigation.navigate('MainAsso')}
				title="Go to MainAsso demo"
			/>
			<Button
				onPress={() => navigation.navigate('Mission')}
				title="Go to Mission demo"
			/> */}

			<Text />
			<Text />
			<Text />

			<Text> Inscription Asso</Text>
			<Button
				onPress={() => navigation.navigate('InscriptionAsso')}
				title="Go to InscriptionAsso demo"
			/>
			<Button
				onPress={() => navigation.navigate('HowContactAsso')}
				title="Go to HowContactAsso demo"
			/>
			<Button
				onPress={() => navigation.navigate('ContactConfirmAsso')}
				title="Go to ContactConfirmAsso demo"
			/>
			<Button
				onPress={() => navigation.navigate('PasswordCreationAsso')}
				title="Go to PasswordCreationAsso demo"
			/>
			<Text />
			<Text />
			<Text />

			<Text> Connexion Asso</Text>
			<Button
				onPress={() => navigation.navigate('Connexion')}
				title="Go to Connexion demo"
			/>

			<Button
				onPress={() => navigation.navigate('DoubleAuthAsso')}
				title="Go to DoubleAuthAsso demo"
			/>
			<Button
				onPress={() => navigation.navigate('ForgotPasswordAsso')}
				title="Go to ForgotPasswordAsso demo"
			/>
			<Button
				onPress={() => navigation.navigate('NeedHelpAsso')}
				title="Go to NeedHelpAsso demo"
			/>
			<Button
				onPress={() => navigation.navigate('ChangePasswordAsso')}
				title="Go to ChangePasswordAsso demo"
			/>
			<Button
				onPress={() => navigation.navigate('ChangeVerificationAsso')}
				title="Go to ChangeVerificationAsso demo"
			/>
			<Text />
			<Text />
			<Text />
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	text: {
		fontSize: 30
	}
});

export default HomeScreen;
