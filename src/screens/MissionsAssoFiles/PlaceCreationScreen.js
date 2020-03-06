import React, { Fragment } from 'react';
import {
	Text,
	View,
	SafeAreaView,
	TouchableOpacity,
	StyleSheet,
	FlatList,
	Platform,
	Image
} from 'react-native';
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import * as Font from 'expo-font';
import { ScrollView } from 'react-native-gesture-handler';
import CountryPicker from 'react-native-country-picker-modal';

import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { Input, Divider } from 'react-native-elements';
import { IconRegistry, ApplicationProvider } from '@ui-kitten/components';
import { mapping, light as lightTheme } from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';

import BackButton from '../Components/BackButton';
import BottomButton from '../Components/BottomButton';
import Validation from '../Components/ValidationComponentScreen';

import uuid from 'uuid/v1';
import firebase from 'react-native-firebase';
import { StackActions, NavigationActions } from 'react-navigation';

const Device = require('react-native-device-detection');

const styles = StyleSheet.create({
	droidSafeArea: {
		flex: 1,
		backgroundColor: 'white'
	},
	mainContainer: {
		width: wp('100%'),
		marginLeft: 'auto',
		marginRight: 'auto',
		paddingLeft: wp('8%'),
		paddingRight: wp('8%')
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
	//
	// Input
	//
	input: {
		width: '37%'
	},
	//
	// FlexRow
	//
	flexRow: {
		flexDirection: 'row'
	},
	//
	// Divider
	//
	hourDivider: {
		width: '26%',
		paddingLeft: '5%',
		paddingRight: '5%',
		marginTop: 'auto',
		marginBottom: 'auto',
		top: 8
	}
});

const Flex = props => {
	return (
		<View>
			<View style={styles.flexRow}>
				<View style={{ width: '38%' }}>
					<Input
						inputStyle={{
							marginLeft: 3,
							fontSize: hp('2%')
						}}
						inputContainerStyle={{
							borderBottomColor: '#E5E5E5'
						}}
						label={props.first}
						labelStyle={{
							color: 'black',
							fontSize: hp('1.5%'),
							fontWeight: '300'
						}}
						value={props.firstValue}
						onChangeText={props.firstChangeFunc}
					/>
				</View>

				<View style={{ width: '62%' }}>
					<Input
						inputStyle={{
							marginLeft: 3,
							fontSize: hp('2%')
						}}
						inputContainerStyle={{
							borderBottomColor: '#E5E5E5'
						}}
						label={props.second}
						labelStyle={{
							color: 'black',
							fontSize: hp('1.5%'),
							fontWeight: '300'
						}}
						value={props.secondValue}
						onChangeText={props.secondChangeFunc}
					/>
				</View>
			</View>
		</View>
	);
};

export default class App extends React.Component {
	constructor() {
		super();
	}

	static navigationOptions = {
		header: null
	};

	state = {
		fontLoaded: false,
		cca2: 'FR',
		callingCode: '33',
		countryName: 'France',
		color: '#FFFFFF',
		animation: false,
		streetNum: '',
		streetName: '',
		zipCode: '',
		cityName: '',
		mission: {},
		missionUid: ''
	};

	async componentDidMount() {
		await Font.loadAsync({
			'SF-pro': require('../../../assets/fonts/SF-Pro-Text-Regular.otf'),
			'Montserrat-light': require('../../../assets/fonts/Montserrat-Light.ttf')
		});
		const missionUid = this.props.navigation.getParam('missionUid', '');
		this.setState({ fontLoaded: true, missionUid });
		try {
			const { uid } = firebase.auth().currentUser;
			const ref = firebase
				.firestore()
				.collection('missions')
				.doc(uid);
			const snap = await ref.get();
			const { [missionUid]: mission } = snap.data();
			this.setState({ mission });
		} catch (error) {
			console.log(error);
		}
	}

	validationFunc = async () => {
		const {
			mission,
			missionUid,
			cityName,
			streetName,
			streetNum,
			zipCode,
			countryName
		} = this.state;
		const place = { cityName, streetName, streetNum, zipCode, countryName };
		try {
			const { uid } = firebase.auth().currentUser;
			const ref = firebase
				.firestore()
				.collection('missions')
				.doc(uid);
			await ref.set(
				{
					[missionUid]: {
						...mission,
						place,
						acceptedBenevole: [],
						refusedBenevole: [],
						wasThere: [],
						wasNotThere: [],
						creationEnded: true
					}
				},
				{ merge: true }
			);
			this.setState({ animation: false });
			this.props.navigation.reset(
				[StackActions.push({ routeName: 'PublishedMissions' })],
				0
			);
		} catch (error) {
			console.log(error);
		}
	};

	onSelect = country => {
		//console.log(country);
		this.setState({
			cca2: country.cca2,
			callingCode: country.callingCode[0],
			countryName: country.name
		});
	};

	render() {
		const { cityName, streetName, streetNum, zipCode } = this.state;
		const { goBack } = this.props.navigation;

		const Header = () => {
			return (
				<View style={{ height: '10%' }}>
					<View style={{ paddingBottom: hp('1%') }} />
					<BackButton text='Retour' color='black' goBack={goBack} />
				</View>
			);
		};

		return (
			<ApplicationProvider mapping={mapping} theme={lightTheme}>
				<Validation
					display={this.state.animation}
					text='Votre mission est publiée !'
					next={this.validationFunc}
					side='asso'
					typo='white'
				/>
				<View style={styles.droidSafeArea}>
					<Header />
					<View style={styles.mainContainer}>
						<View style={{ paddingBottom: hp('20%') }} />
						<Text style={styles.title}>
							J'indique le lieu de rendez-vous
						</Text>
						<View style={{ paddingBottom: hp('5%') }} />
						<Flex
							first='NUMÉRO'
							firstValue={streetNum}
							firstChangeFunc={text =>
								this.setState({ streetNum: text })
							}
							second='RUE'
							secondValue={streetName}
							secondChangeFunc={text =>
								this.setState({ streetName: text })
							}
						/>
						<View style={{ paddingBottom: hp('2%') }} />
						<Flex
							first='CODE POSTAL'
							firstValue={zipCode}
							firstChangeFunc={text =>
								this.setState({ zipCode: text })
							}
							second='VILLE'
							secondValue={cityName}
							secondChangeFunc={text =>
								this.setState({ cityName: text })
							}
						/>
						<View style={{ paddingBottom: hp('3%') }} />
						<View style={{ left: '4%', top: '-1%' }}>
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
						</View>

						<Divider
							style={{
								top: hp('0.7%'),
								backgroundColor: '#E5E5E5',
								height: 1,
								marginLeft: '2.5%',
								marginRight: '2.5%'
							}}
						/>
					</View>
				</View>
				<TouchableOpacity
					style={{
						height: hp('7%'),
						width: wp('100%'),
						backgroundColor: '#FFBB01'
					}}
					onPress={() => this.setState({ animation: true })}
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
						Je publie la mission
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={{
						height: hp('13%'),
						width: wp('100%'),
						backgroundColor: '#FFBB01'
					}}
					onPress={() => this.setState({ animation: true })}
				/>
			</ApplicationProvider>
		);
	}
}
