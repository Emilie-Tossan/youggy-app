import React from 'react';
import {
	Text,
	View,
	TouchableOpacity,
	TextInput,
	StyleSheet
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import * as Font from 'expo-font';

import BackButton from '../Components/BackButton';

const Device = require('react-native-device-detection');

const styles = StyleSheet.create({
	screenContainer: {
		width: '100%',
		height: '100%'
	},
	mainContainer: {
		width: wp('100%'),
		marginTop: 'auto',
		marginBottom: 'auto',
		marginLeft: 'auto',
		marginRight: 'auto',
		paddingLeft: Device.isTablet ? wp('25%') : wp('13%'),
		paddingRight: Device.isTablet ? wp('25%') : wp('13%')
	},
	//
	// Text
	//
	title: {
		fontWeight: 'bold',
		fontSize: hp('3%'),
		color: 'white',
		textAlign: 'center'
	},
	subText: {
		fontSize: hp('2%'),
		color: 'white',
		textAlign: 'center'
	},
	info: {
		fontSize: hp('1.7%'),
		color: 'white',
		fontWeight: 'bold'
	},
	//
	// Mail
	//
	mail: {
		fontSize: hp('2.5%'),
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
		textDecorationLine: 'underline'
	},
	//
	// Utils
	//
	bold: {
		fontWeight: '900'
	}
});

export default class App extends React.Component {
	constructor() {
		super();
		this.state = {
			entry: ''
		};
	}

	static navigationOptions = {
		header: null
	};

	state = {
		fontLoaded: false
	};

	async componentDidMount() {
		await Font.loadAsync({
			'SF-pro': require('../../../assets/fonts/SF-Pro-Text-Regular.otf'),
			'Montserrat-light': require('../../../assets/fonts/Montserrat-Light.ttf'),
			'Montserrat-medium': require('../../../assets/fonts/Montserrat-Medium.ttf')
		});
		this.setState({ fontLoaded: true });
	}

	render() {
		const { goBack } = this.props.navigation;

		return (
			<View style={styles.screenContainer}>
				<LinearGradient
					colors={['#FFA901', '#FFCC48', '#FFA901']}
					style={{ flex: 1 }}
					start={{ x: 0, y: 0 }}
					end={{ x: 0, y: 1 }}
				>
					<BackButton text='retour' goBack={goBack} />
					<View style={styles.mainContainer}>
						<Text style={styles.title}>Besoin d'aide ?</Text>
						<View style={{ paddingBottom: hp('4%') }} />
						<Text style={styles.subText}>
							Si vous ne recevez pas l'email, vérifiez que votre{' '}
							<Text style={styles.bold}>
								{this.props.navigation.getParam(
									'mailOrPhone',
									'contact'
								)}
							</Text>{' '}
							soit valide.{'\n'}
						</Text>
						<View style={{ paddingBottom: hp('2%') }} />
						<Text style={styles.subText}>
							Si c'est le cas, et que vous avez un compte chez
							nous, nous vous invitons a écrire au{' '}
							<Text style={styles.bold}>support </Text> de{' '}
							{this.state.fontLoaded && (
								<Text
									style={{
										fontFamily: 'Montserrat-medium',
										fontWeight: 'normal'
									}}
								>
									{' '}
									YOUGGY
								</Text>
							)}
							.
						</Text>
						<View style={{ paddingBottom: hp('4%') }} />
						<TouchableOpacity>
							<Text style={styles.mail}>asso@youggy.com</Text>
						</TouchableOpacity>
					</View>
				</LinearGradient>
			</View>
		);
	}
}
