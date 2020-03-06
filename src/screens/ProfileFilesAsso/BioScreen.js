import React from 'react';
import {
	Text,
	View,
	SafeAreaView,
	TouchableOpacity,
	StyleSheet,
	Platform,
	Image
} from 'react-native';
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import * as Font from 'expo-font';
import { ScrollView } from 'react-native-gesture-handler';

import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { Input, Divider } from 'react-native-elements';
import { IconRegistry, ApplicationProvider } from '@ui-kitten/components';
import { mapping, light as lightTheme } from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import PlaceAsso from '../Other/PlaceAsso';
import Constants from 'expo-constants';

import PhotoProfil from '../../../assets/svg-js/photo_profil';
import Cross from '../../../assets/svg-js/Cross';

import ProfilHeader from '../Components/ProfilHeader';
import BottomButton from '../Components/BottomButton';

import firebase from 'react-native-firebase';
import { NavigationActions } from 'react-navigation';

const Device = require('react-native-device-detection');

import uuid from 'uuid/v1';

const styles = StyleSheet.create({
	droidSafeArea: {
		flex: 1,
		backgroundColor: 'white'
	},
	mainContainer: {
		width: wp('100%'),
		marginTop: 'auto',
		marginBottom: 'auto',
		marginLeft: 'auto',
		marginRight: 'auto',
		paddingLeft: wp('10%'),
		paddingRight: wp('10%')
	},
	//
	// Text
	//
	title: {
		textAlign: 'left',
		color: '#FFBB01',
		fontSize: hp('2.5%'),
		fontWeight: 'bold'
	},
	info: {
		fontSize: hp('1.5%'),
		color: 'black'
	},
	subText: {
		fontSize: hp('1.8%'),

		textAlign: 'left'
	},
	//
	// Input
	//
	inputContainer: {
		flexDirection: 'row',
		color: 'black',
		fontSize: hp('2.2%')
	},
	inputContainerStyle: {
		left: -10,
		paddingTop: hp('1.5%')
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
		whoWeAre: '',
		whoWeSearch: '',
		whereWeAre: '',
		Places: []
	};

	async componentDidMount() {
		await Font.loadAsync({
			'SF-pro': require('../../../assets/fonts/SF-Pro-Text-Regular.otf'),
			'Montserrat-light': require('../../../assets/fonts/Montserrat-Light.ttf')
		});
		this.setState({ fontLoaded: true });
		try {
			const userUid = firebase.auth().currentUser.uid;
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
			if (cover) this.setState({ cover });
			if (profil) this.setState({ profil });
			else this.setState({ profil: profilDefault });
			const userRef = firebase
				.firestore()
				.collection('associationUsers')
				.doc(userUid);
			const snapshot = await userRef.get();
			const dataAll = snapshot.data();
			this.setState({
				whoWeAre: dataAll.whoWeAre ? dataAll.whoWeAre : '',
				whoWeSearch: dataAll.whoWeSearch ? dataAll.whoWeSearch : '',
				Places: dataAll.whereWeAre ? dataAll.whereWeAre : []
			});
		} catch (err) {
			console.log(err);
		}
	}

	addPlace = title => {
		const { Places } = this.state;
		if (title.length) {
			//refresh:
			const newState = [ ...Places, { title, id: uuid() } ];
			this.setState({
				Places: newState
			});
		}
	};

	removePlace = id => {
		const { Places } = this.state;
		const newState = Places.filter(item => item.id !== id);
		this.setState({
			Places: newState
		});
	};

	render() {
		const {
			cover,
			profil,
			whoWeAre,
			whereWeAre,
			whoWeSearch,
			Places
		} = this.state;

		return (
			<ApplicationProvider mapping={mapping} theme={lightTheme}>
				<View style={styles.droidSafeArea}>
					<IconRegistry icons={EvaIconsPack} />

					<ScrollView style={{ height: hp('200%') }}>
						<View style={{ paddingBottom: hp('27%') }} />

						<View style={styles.mainContainer}>
							{/*<View style={{ paddingBottom: hp('10%') }} />*/}
							<Text style={styles.subText}>
								Votre page sera visible aux bénévoles. Après
								vous êtres présenté, vous pouvez renseigner le
								type de profil que vous cherchez.
							</Text>
							<View style={{ paddingBottom: hp('4%') }} />
							<Divider style={{ backgroundColor: '#D1D1D1' }} />

							<View style={{ paddingBottom: hp('4%') }} />
							<View>
								<Text style={styles.title}>
									Trouver des bénévoles
								</Text>
								<View style={{ paddingBottom: hp('5%') }} />
								<Text style={styles.info}>
									QUI SOMMES-NOUS ?
								</Text>
								<Input
									containerStyle={styles.inputContainerStyle}
									inputStyle={{
										marginLeft: 3,
										fontSize: hp('2%')
									}}
									inputContainerStyle={{
										borderBottomColor: '#E5E5E5'
									}}
									value={whoWeAre}
									onChangeText={text => {
										this.setState({ whoWeAre: text });
									}}
									autoCorrect={true}
									placeholder="Nous agissons pour/contre"
								/>
								<View style={{ paddingBottom: hp('2%') }} />
								<Text style={styles.info}>
									QUI RECHERCHONS NOUS ?
								</Text>

								<Input
									containerStyle={styles.inputContainerStyle}
									inputStyle={{
										marginLeft: 3,
										fontSize: hp('2%')
									}}
									inputContainerStyle={{
										borderBottomColor: '#E5E5E5'
									}}
									value={whoWeSearch}
									onChangeText={text => {
										this.setState({ whoWeSearch: text });
									}}
									autoCorrect={true}
									placeholder="Nous avons besoins de ..."
								/>
								<View style={{ paddingBottom: hp('2%') }} />
								<Text style={styles.info}>
									OÙ NOUS TROUVER ?
								</Text>
								<View style={styles.inputContainer}>
									<Input
										containerStyle={
											styles.inputContainerStyle
										}
										inputStyle={{
											marginLeft: 3,
											fontSize: hp('2%')
										}}
										inputContainerStyle={{
											borderBottomColor: '#E5E5E5'
										}}
										rightIcon={
											<TouchableOpacity
												style={{
													height: hp('3%'),
													width: hp('3%'),
													top: '10%'
												}}
												onPress={() => {
													this.addPlace(whereWeAre);
													this.setState({
														whereWeAre: ''
													});
												}}
											>
												<Cross />
											</TouchableOpacity>
										}
										value={whereWeAre}
										onChangeText={text => {
											this.setState({ whereWeAre: text });
										}}
										autoCapitalize="none"
										autoCorrect={true}
										placeholder="Paris, à l'étranger"
									/>
								</View>
							</View>
							<View style={{ paddingBottom: hp('2%') }} />

							<PlaceAsso
								itemsList={Places}
								removeIt={this.removePlace}
							/>
							<View style={{ paddingBottom: hp('2%') }} />
						</View>
						<View style={{ paddingBottom: hp('10%') }} />
					</ScrollView>
				</View>
				<BottomButton
					text="Je publie"
					color="#FFBB01"
					navigate={async () => {
						try {
							const userUid = firebase.auth().currentUser.uid;
							const userRef = firebase
								.firestore()
								.collection('associationUsers')
								.doc(userUid);
							await userRef.set(
								{ whoWeAre, whoWeSearch, whereWeAre: Places },
								{ merge: true }
							);
							//this.props.navigation.push('BottomNav');
							this.props.navigation.reset(
								[
									NavigationActions.navigate({
										routeName: 'BottomNavAsso'
									})
								],
								0
							);
						} catch (err) {
							console.log(err);
						}
					}}
				/>

				<ProfilHeader profil={profil} cover={cover} />
			</ApplicationProvider>
		);
	}
}
