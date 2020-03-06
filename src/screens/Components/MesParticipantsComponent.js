import React from 'react';
import {
	Text,
	View,
	TouchableOpacity,
	TextInput,
	StyleSheet
} from 'react-native';
import { Input, Divider } from 'react-native-elements';
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import * as Font from 'expo-font';

import Option from '../../../assets/svg-js/option';

const Device = require('react-native-device-detection');

const MesParticipantsComponent = props => {
	let status = props.status;
	if (props.passed) {
		status = false;
	}
	const styles = StyleSheet.create({
		mainContainer: {
			width: wp('100%'),
			marginTop: 'auto',
			marginBottom: 'auto',
			marginLeft: 'auto',
			marginRight: 'auto'
		},
		//
		// name
		//
		name: {
			fontSize: hp('2.3%'),
			fontWeight: '500'
		},
		job: {
			fontSize: hp('2.1%'),
			fontWeight: '300'
		},
		status: {
			fontSize: hp('1.8%'),
			color:
				props.passed && props.passedStatus == 0
					? '#FFBB01'
					: status || props.passedStatus == 1
					? '#00F016'
					: '#D94B4B'
		},
		//
		// Date
		//
		date: {
			textAlign: 'center',
			fontSize: hp('3%')
		},
		month: {
			textAlign: 'center',
			fontSize: hp('1.5%'),
			fontWeight: '300'
		},
		time: {
			textAlign: 'center',
			fontSize: hp('1.7%'),
			fontWeight: '300'
		},
		//
		// Row
		//
		flexRow: {
			flexDirection: 'row'
		},
		//
		// Utils
		//
		divider: {
			height: 1,
			backgroundColor: '#DFDFDF',
			top: -1,
			left: wp('-5%'),
			width: wp('80%'),
			marginTop: 'auto',
			marginLeft: 'auto',
			marginRight: 'auto'
		}
	});

	const Date = () => {
		return (
			<View style={{ width: '20%' }}>
				<Text style={styles.date}>{props.date}</Text>
				<Text style={styles.month}>{props.month}</Text>
				<Text style={styles.time}>
					{props.startHour} à {props.endHour}
				</Text>
			</View>
		);
	};

	const Participants = () => {
		return (
			<View style={{ width: '80%' }}>
				<Text style={styles.name}>{props.name}</Text>
				<Text style={styles.job}>{props.job}</Text>
				{props.passed && props.passedStatus == 0 ? (
					<Text style={styles.status}>Participation à confirmer</Text>
				) : (
					<Text style={styles.status}>
						{status || props.passedStatus == 1
							? 'Participation validé'
							: 'Participation non validé'}
					</Text>
				)}
			</View>
		);
	};

	return (
		<View style={styles.mainContainer}>
			{props.id != 0 ? <Divider style={styles.divider} /> : <View />}
			<View style={{ paddingBottom: hp('2%') }} />
			<View style={styles.flexRow}>
				<TouchableOpacity
					style={{ ...styles.flexRow, width: '83%' }}
					onPress={() =>
						props.ProfileRenderer(props.id, props.status)
					}
				>
					<Date />
					<View style={{ width: '4%' }} />
					<Participants />
				</TouchableOpacity>
				{/* <View style={{ width: '10%' }} /> */}

				<TouchableOpacity
					onPress={() => {
						props.OptionRenderer(
							props.id,
							props.status,
							props.passedStatus
						);
						props.menuPassed();
					}}
					style={{
						width: wp('15%'),
						height: '100%',
						paddingLeft: hp('1%')
					}}
				>
					<View
						style={{
							top: hp('2%'),
							left: wp('4%')
						}}
					>
						<Option width={wp('1.4%')} height={wp('8%')} />
					</View>
				</TouchableOpacity>
			</View>
			<View style={{ paddingBottom: hp('2%') }} />
		</View>
	);
};

export default MesParticipantsComponent;
