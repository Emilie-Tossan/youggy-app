import React from 'react';
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
import Calendar from 'react-native-calendario';

import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { Input, Divider } from 'react-native-elements';
import { IconRegistry, ApplicationProvider } from '@ui-kitten/components';
import { mapping, light as lightTheme } from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import FlexRow from '../Other/FlexRow';

import PhotoProfil from '../../../assets/svg-js/photo_profil';
import BackButton from '../Components/BackButton';
import BottomButton from '../Components/BottomButton';

const Device = require('react-native-device-detection');

import dateToday from '../../utils/dateToday';
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
		fontSize: hp('2%'),
		fontWeight: '300'
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
		missionUid: '',
		mission: {},
		startDate: '',
		endDate: ''
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
		const { mission, missionUid, startDate, endDate } = this.state;
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
						startDate,
						endDate: endDate !== '' ? endDate : startDate
					}
				},
				{ merge: true }
			);
			this.props.navigation.navigate('HourCreation', { missionUid });
		} catch (error) {
			console.log(error);
		}
	};

	handleRange(range) {
		const { endDate, startDate } = range;
		if (!endDate) {
			this.setState({
				startDate: dateToday(startDate),
				endDate: ''
			});
		} else {
			this.setState({
				startDate: dateToday(startDate),
				endDate: dateToday(endDate)
			});
		}
	}

	render() {
		const { endDate, startDate } = this.state;
		const { goBack } = this.props.navigation;

		const Header = () => {
			return <BackButton text='Retour' color='black' goBack={goBack} />;
		};

		return (
			<ApplicationProvider mapping={mapping} theme={lightTheme}>
				<View style={styles.droidSafeArea}>
					<View style={{ paddingBottom: hp('3%') }} />

					<BackButton text='Retour' color='black' goBack={goBack} />
					<View style={{ paddingBottom: hp('3%') }} />
					<View style={styles.mainContainer}>
						<View style={{ paddingBottom: hp('4%') }} />
						<Text style={styles.title}>
							Je sélectionne les jours
						</Text>

						<View style={{ paddingBottom: hp('5%') }} />
						<Text style={styles.desc}>
							Pour participer à la mission, les bénévoles
							choisiront les jours qui correspondent à leurs
							disponibilités.
						</Text>
						<View style={{ paddingBottom: hp('5%') }} />
						<Calendar
							onChange={range => this.handleRange(range)}
							minDate={dateToday()}
							startDate={startDate}
							endDate={endDate}
							locale='fr'
							theme={{
								activeDayColor: {},
								monthTitleTextStyle: {
									color: '#FFCC48',
									fontWeight: '300',
									fontSize: 16
								},
								emptyMonthContainerStyle: {},
								emptyMonthTextStyle: {
									fontWeight: '200'
								},
								weekColumnsContainerStyle: {},
								weekColumnStyle: {
									paddingVertical: 10
								},
								weekColumnTextStyle: {
									color: '#b6c1cd',
									fontSize: 13
								},
								nonTouchableDayContainerStyle: {},
								nonTouchableDayTextStyle: {},
								startDateContainerStyle: {},
								endDateContainerStyle: {},
								dayContainerStyle: {},
								dayTextStyle: {
									color: '#2d4150',
									fontWeight: '200',
									fontSize: 12
								},
								dayOutOfRangeContainerStyle: {},
								dayOutOfRangeTextStyle: {},
								todayContainerStyle: {},
								todayTextStyle: {
									color: '#FFCC48'
								},
								activeDayContainerStyle: {
									backgroundColor: '#FFCC48'
								},
								activeDayTextStyle: {
									color: 'white'
								},
								nonTouchableLastMonthDayTextStyle: {}
							}}
							disableOffsetDays={true}
						/>
					</View>
				</View>
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
						height: hp('13%'),
						width: wp('100%'),
						backgroundColor: '#FFBB01'
					}}
					onPress={this.validationFunc}
				/>
			</ApplicationProvider>
		);
	}
}
