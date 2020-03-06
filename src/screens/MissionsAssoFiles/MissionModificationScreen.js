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
import FlexRow from '../Other/FlexRow';

import PhotoProfil from '../../../assets/svg-js/photo_profil';
import Cross from '../../../assets/svg-js/Cross';

import BackButton from '../Components/BackButton';
import BottomButton from '../Components/BottomButton';

const Device = require('react-native-device-detection');

import firebase from 'react-native-firebase';

import uuid from 'uuid/v1';

const styles = StyleSheet.create({
	droidSafeArea: {
		flex: 1,
		backgroundColor: 'white'
	},
	mainContainer: {
		width: wp('100%'),

		marginLeft: 'auto',
		marginRight: 'auto',
		paddingLeft: wp('10%'),
		paddingRight: wp('10%')
	},
	//
	// Text
	//
	title: {
		textAlign: 'center',
		color: '#FFBB01',
		fontSize: hp('2.5%'),
		fontWeight: 'bold'
	},
	desc: {
		textAlign: 'left',
		fontSize: hp('1.8%'),
		fontWeight: '300'
	},
	info: {
		fontSize: hp('1.5%'),
		color: 'black'
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
		competenceAndInterest: [],
		competenceList: [],
		interestList: [],
		interestInput: '',
		interestSuggestion: '',
		competenceInput: '',
		competenceSuggestion: '',
		title: '',
		desc: '',
		number: ''
	};

	async componentDidMount() {
		await Font.loadAsync({
			'SF-pro': require('../../../assets/fonts/SF-Pro-Text-Regular.otf'),
			'Montserrat-light': require('../../../assets/fonts/Montserrat-Light.ttf')
		});
		this.setState({ fontLoaded: true });
		const missionUid = this.props.navigation.getParam('id', 'noMission');
		try {
			const { uid } = firebase.auth().currentUser;
			const ref = firebase
				.firestore()
				.collection('missions')
				.doc(uid);
			const snap = await ref.get();
			const { competenceAndInterest, title, desc, number } = snap.data()[
				missionUid
			];
			const snapCompetences = await firebase
				.firestore()
				.collection('competencesInterets')
				.doc('competences')
				.get();
			const snapInterets = await firebase
				.firestore()
				.collection('competencesInterets')
				.doc('interets')
				.get();
			const { list: competenceList } = snapCompetences.data();
			const { list: interestList } = snapInterets.data();
			this.setState({
				competenceList,
				interestList,
				competenceAndInterest,
				title,
				desc,
				number
			});
		} catch (error) {
			console.log(error);
		}
	}

	addCompetenceAndInterest = (title, isCompetence) => {
		const { competenceAndInterest } = this.state;
		if (title.length) {
			//refresh:
			const newState = [
				...competenceAndInterest,
				{ title, id: uuid(), isCompetence }
			];
			this.setState({
				competenceAndInterest: newState
			});
		}
	};

	handleSuggestion = (text, field) => {
		const { competenceList, interestList } = this.state;
		competenceList.sort();
		interestList.sort();
		let matched = '';
		if (field === 'competence') {
			for (let i = 0; i < competenceList.length; i++) {
				let matchedFound = false;
				const word = competenceList[i];
				for (let j = 0; j < text.length && j < word.length; j++) {
					const a = text[j];
					const b = word[j];
					if (a !== b) {
						matchedFound = false;
						break;
					} else {
						matchedFound = true;
					}
				}
				if (matchedFound) {
					matched = word;
					break;
				}
			}
		} else if (field === 'interest') {
			for (let i = 0; i < interestList.length; i++) {
				let matchedFound = false;
				const word = interestList[i];
				for (let j = 0; j < text.length && j < word.length; j++) {
					const a = text[j];
					const b = word[j];
					if (a !== b) {
						matchedFound = false;
						break;
					} else {
						matchedFound = true;
					}
				}
				if (matchedFound) {
					matched = word;
					break;
				}
			}
		} else {
			return;
		}
		this.setState({
			[field + 'Input']: text,
			[field + 'Suggestion']: matched
		});
	};

	removeCompetenceAndInterest = id => {
		const { competenceAndInterest } = this.state;
		const newState = competenceAndInterest.filter(item => item.id !== id);
		//refresh:
		this.setState({
			competenceAndInterest: newState
		});
	};

	validationFunc = async () => {
		const { desc, title, number, competenceAndInterest } = this.state;
		const missionUid = this.props.navigation.getParam('id', 'noMission');
		try {
			const { uid } = firebase.auth().currentUser;
			const ref = firebase
				.firestore()
				.collection('missions')
				.doc(uid);
			const snap = await ref.get();
			const mission = snap.data()[missionUid];
			await ref.set(
				{
					[missionUid]: {
						...mission,
						desc,
						title,
						number,
						competenceAndInterest
					}
				},
				{ merge: true }
			);
			this.props.navigation.goBack();
		} catch (error) {
			console.log(error);
		}
	};

	render() {
		const {
			competenceInput,
			interestInput,
			competenceSuggestion,
			interestSuggestion,
			competenceAndInterest,
			title,
			desc,
			number
		} = this.state;
		const { goBack } = this.props.navigation;
		const Header = () => {
			return (
				<View style={{ height: '10%' }}>
					<View style={{ paddingBottom: hp('3%') }} />

					<BackButton text='Retour' color='black' goBack={goBack} />
				</View>
			);
		};
		return (
			<ApplicationProvider mapping={mapping} theme={lightTheme}>
				<View style={styles.droidSafeArea}>
					<Header />
					<ScrollView>
						<View style={styles.mainContainer}>
							<View style={{ paddingBottom: hp('4%') }} />
							<View>
								<Text style={styles.title}>
									Modification de la mission
								</Text>
								<View style={{ paddingBottom: hp('5%') }} />
								<Text style={styles.info}>TITRE</Text>
								<Input
									containerStyle={styles.inputContainerStyle}
									inputStyle={{
										marginLeft: 3,
										fontSize: hp('2%')
									}}
									inputContainerStyle={{
										borderBottomColor: '#E5E5E5'
									}}
									autoCorrect={true}
									onChangeText={text =>
										this.setState({ title: text })
									}
									value={title}
								/>
								<View style={{ paddingBottom: hp('2%') }} />
								<Text style={styles.info}>DESCRIPTION</Text>
								<Input
									containerStyle={styles.inputContainerStyle}
									inputStyle={{
										marginLeft: 3,
										fontSize: hp('2%')
									}}
									inputContainerStyle={{
										borderBottomColor: '#E5E5E5'
									}}
									autoCorrect={true}
									placeholder='Nous recherchons des bénévoles ...'
									onChangeText={text =>
										this.setState({ desc: text })
									}
									value={desc}
								/>
								<View style={{ paddingBottom: hp('2%') }} />
								<Text style={styles.info}>
									NOMBRE DE BÉNÉVOLES
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
									autoCorrect={true}
									placeholder='1 ou un maximum'
									onChangeText={text =>
										this.setState({ number: text })
									}
									value={number}
								/>
								<View style={{ paddingBottom: hp('5%') }} />
								<Text style={styles.desc}>
									Un système de matching est prévu pour aider
									les bénévoles à trouver des missions.{'\n'}
									Renseignez les profils que vous recherchez.
								</Text>
								<View style={{ paddingBottom: hp('5%') }} />
								<Text style={styles.info}>COMPÉTENCES</Text>
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
												onPress={() => {
													this.addCompetenceAndInterest(
														competenceInput,
														true
													);
													this.setState({
														competenceSuggestion:
															'',
														competenceInput: ''
													});
												}}
											>
												<Cross />
											</TouchableOpacity>
										}
										value={competenceInput}
										onChangeText={text => {
											this.handleSuggestion(
												text,
												'competence'
											);
										}}
										autoCapitalize='none'
										autoCorrect={false}
									/>
									<Input
										containerStyle={{
											...styles.inputContainerStyle,
											position: 'absolute'
										}}
										pointerEvents='none'
										inputStyle={{
											marginLeft: 3,
											fontSize: hp('2%')
										}}
										inputContainerStyle={{
											borderBottomColor: '#E5E5E5'
										}}
										placeholder={competenceSuggestion}
									/>
								</View>
								<View style={{ paddingBottom: hp('2%') }} />
								<Text style={styles.info}>
									CENTRES D'INTÉRÊT
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
												onPress={() => {
													this.addCompetenceAndInterest(
														interestInput,
														false
													);
													this.setState({
														interestSuggestion: '',
														interestInput: ''
													});
												}}
											>
												<Cross />
											</TouchableOpacity>
										}
										value={interestInput}
										onChangeText={text => {
											this.handleSuggestion(
												text,
												'interest'
											);
										}}
										autoCapitalize='none'
										autoCorrect={false}
									/>
									<Input
										containerStyle={{
											...styles.inputContainerStyle,
											position: 'absolute'
										}}
										pointerEvents='none'
										inputStyle={{
											marginLeft: 3,
											fontSize: hp('2%')
										}}
										inputContainerStyle={{
											borderBottomColor: '#E5E5E5'
										}}
										placeholder={interestSuggestion}
									/>
								</View>
							</View>
							<ScrollView
								style={{
									height: hp('40%')
								}}
							>
								<View style={{ paddingBottom: hp('2%') }} />
								<FlexRow
									itemsList={competenceAndInterest}
									removeIt={this.removeCompetenceAndInterest}
									isAsso={true}
									isCross={true}
								/>
							</ScrollView>
						</View>
					</ScrollView>
				</View>
				<View>
					<TouchableOpacity
						style={{
							height: hp('7%'),
							width: wp('100%'),
							backgroundColor: '#FFBB01'
						}}
						onPress={this.validationFunc}
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
							Je continue
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={{
							height: hp('14%'),
							width: wp('100%'),
							backgroundColor: '#FFBB01'
						}}
						onPress={this.validationFunc}
					/>
				</View>
			</ApplicationProvider>
		);
	}
}
