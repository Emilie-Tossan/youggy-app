import React from 'react';
import {
	Text,
	View,
	ScrollView,
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

import uuid from 'uuid/v1';

import BackButton from '../Components/BackButton';
import PublishedMissionComponent from '../Components/PublishedMissionComponent';

import Ajouter from '../../../assets/svg-js/Ajouter';
import Accepter from '../../../assets/svg-js/Accepter';
import Editer from '../../../assets/svg-js/editer';
import Voir from '../../../assets/svg-js/Voir';
import Supprimer from '../../../assets/svg-js/Supprimer';

const Device = require('react-native-device-detection');

import firebase from 'react-native-firebase';
import dateToday from '../../utils/dateToday';

const styles = StyleSheet.create({
	screenContainer: {
		width: '100%',
		height: '100%'
	},
	mainContainer: {
		width: wp('100%'),
		marginLeft: 'auto',
		marginRight: 'auto',
		paddingLeft: wp('4%'),
		paddingRight: wp('4%')
	},
	//
	// Text
	//
	title: {
		fontSize: hp('2.7%'),
		textAlign: 'center',
		color: '#FFBB01',
		fontWeight: 'bold'
	},
	subText: {
		textAlign: 'center',
		fontSize: hp('2.3%')
	},
	desc: {
		textAlign: 'center',
		fontSize: hp('2%'),
		fontWeight: '300',
		color: 'grey'
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
		flexDirection: 'row'
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
	// Bottom Container
	//
	bottomContainer: {
		top: hp('-14%'),
		marginTop: 'auto',
		overflow: 'hidden',
		backgroundColor: 'white'
	},
	bottomText: {
		textAlign: 'center',
		fontSize: hp('2.5%'),
		height: hp('3%'),
		marginTop: 'auto',
		marginBottom: 'auto',
		top: hp('-1%')
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
		Missions: [],
		render: false,
		which: '',
		demande: 0,
		isPassed: false,
		unmountThoseListeners: []
	};

	componentWillUnmount() {
		const { unmountThoseListeners: listeners } = this.state;
		for (let i = 0; i < listeners.length; i++) {
			const unsubscribe = listeners[i];
			unsubscribe();
		}
	}

	async componentDidMount() {
		const listeners = [];
		let listener = null;
		try {
			const { uid } = firebase.auth().currentUser;
			const ref = firebase
				.firestore()
				.collection('missions')
				.doc(uid);
			listener = firebase
				.firestore()
				.collection('missions')
				.doc(uid)
				.onSnapshot(() => {
					this.dataListener();
				});
			listeners.push(listener);
			const snap = await ref.get();
			const missions = snap.data();
			const Missions = [];
			for (const missionUid in missions) {
				if (missions.hasOwnProperty(missionUid)) {
					const mission = missions[missionUid];
					if (!mission.creationEnded) continue;
					let Mission = {};
					Mission['id'] = missionUid;
					Mission['desc'] = mission.title;
					Mission['place'] = mission.place.cityName;
					const endMission = new Date(mission.endDate);
					const nowDate = new Date(dateToday());
					Mission['passed'] = endMission < nowDate;
					const candidatsRef = firebase
						.firestore()
						.collection('candidatures')
						.where('postule', 'array-contains', missionUid);
					listener = firebase
						.firestore()
						.collection('candidatures')
						.where('postule', 'array-contains', missionUid)
						.onSnapshot(() => {
							this.dataListener();
						});
					listeners.push(listener);
					const askerSnap = await candidatsRef.get();
					const askersList = askerSnap.empty
						? []
						: askerSnap.docs.map(doc => ({
								benevole: doc.id,
								data: doc.data()
						  }));
					const demande = askersList.reduce(
						(accumulateur, current) => {
							let askedForThisMission = false;
							for (
								let i = 0;
								i < current.data.postule.length;
								i++
							) {
								const missionAsked = current.data.postule[i];
								if (missionAsked === missionUid) {
									let refused = false;
									for (
										let ii = 0;
										ii < mission.refusedBenevole.length;
										ii++
									) {
										const el = mission.refusedBenevole[ii];
										if (el === current.benevole) {
											refused = true;
											break;
										}
									}
									let accepted = false;
									for (
										let ii = 0;
										ii < mission.acceptedBenevole.length;
										ii++
									) {
										const el = mission.acceptedBenevole[ii];
										if (el === current.benevole) {
											accepted = true;
											break;
										}
									}
									if (!refused && !accepted)
										askedForThisMission = true;
									break;
								}
							}
							if (askedForThisMission) return accumulateur + 1;
							else return accumulateur;
						},
						0
					);
					Mission['demande'] = demande;
					Missions.push(Mission);
				}
			}
			this.setState({
				Missions: [...Missions],
				unmountThoseListeners: [...listeners]
			});
			this.props.screenProps.notifCapture(Missions);
		} catch (error) {
			console.log(error);
		}
	}

	async dataListener() {
		try {
			const { uid } = firebase.auth().currentUser;
			const ref = firebase
				.firestore()
				.collection('missions')
				.doc(uid);
			const snap = await ref.get();
			const missions = snap.data();
			const Missions = [];
			for (const missionUid in missions) {
				if (missions.hasOwnProperty(missionUid)) {
					const mission = missions[missionUid];
					if (!mission.creationEnded) continue;
					let Mission = {};
					Mission['id'] = missionUid;
					Mission['desc'] = mission.title;
					Mission['place'] = mission.place.cityName;
					const endMission = new Date(mission.endDate);
					const nowDate = new Date(dateToday());
					Mission['passed'] = endMission < nowDate;
					const candidatsRef = firebase
						.firestore()
						.collection('candidatures')
						.where('postule', 'array-contains', missionUid);
					const askerSnap = await candidatsRef.get();
					const askersList = askerSnap.empty
						? []
						: askerSnap.docs.map(doc => ({
								benevole: doc.id,
								data: doc.data()
						  }));
					const demande = askersList.reduce(
						(accumulateur, current) => {
							let askedForThisMission = false;
							for (
								let i = 0;
								i < current.data.postule.length;
								i++
							) {
								const missionAsked = current.data.postule[i];
								if (missionAsked === missionUid) {
									let refused = false;
									for (
										let ii = 0;
										ii < mission.refusedBenevole.length;
										ii++
									) {
										const el = mission.refusedBenevole[ii];
										if (el === current.benevole) {
											refused = true;
											break;
										}
									}
									let accepted = false;
									for (
										let ii = 0;
										ii < mission.acceptedBenevole.length;
										ii++
									) {
										const el = mission.acceptedBenevole[ii];
										if (el === current.benevole) {
											accepted = true;
											break;
										}
									}
									if (!refused && !accepted)
										askedForThisMission = true;
									break;
								}
							}
							if (askedForThisMission) return accumulateur + 1;
							else return accumulateur;
						},
						0
					);
					Mission['demande'] = demande;
					Missions.push(Mission);
				}
			}
			this.props.screenProps.notifCapture(Missions);
			this.setState({ Missions: [...Missions] });
		} catch (error) {
			console.log(error);
		}
	}

	OptionRenderer = (id, participants, passed) => {
		if (id == this.state.which || !this.state.render)
			this.setState({ render: !this.state.render });
		this.setState({ which: id });
		this.setState({ demande: participants });
		this.setState({ isPassed: passed });
		// console.log(this.state.render);
		// console.log(this.state.which);
		// console.log('props passed ' + this.state.passed);
		// console.log('passed ' + this.state.isPassed);
	};

	Navigate = (id, passed) => {
		//console.log(id);
		//console.log('&' + passed);
		this.setState({ render: false });
		this.props.navigation.push('Accept', { id, passed });
	};

	render() {
		const { Missions, render, which, demande, isPassed } = this.state;

		const Menu = () => {
			if (isPassed) {
				return (
					<View>
						<View>
							<Divider />
							<TouchableOpacity
								style={styles.menuTile}
								onPress={async () => {
									/*func qui valide les participants des missions passed*/
									try {
										const {
											uid
										} = firebase.auth().currentUser;
										const ref = firebase
											.firestore()
											.collection('missions')
											.doc(uid);
										const snap = await ref.get();
										const missions = snap.data();
										const mission = missions[which];
										const { acceptedBenevole } = mission;
										await ref.set(
											{
												[which]: {
													...mission,
													wasThere: acceptedBenevole
												}
											},
											{ merge: true }
										);
									} catch (error) {
										console.log(error);
									}
									this.setState({ render: false });
								}}
							>
								<View style={styles.menuIconContainer}>
									<Accepter />
								</View>
								<Text style={styles.textMenuTile}>
									Valider les participations
								</Text>
							</TouchableOpacity>
						</View>
						<Divider />
						<TouchableOpacity
							style={styles.menuTile}
							onPress={() => {
								this.setState({ render: false });
								this.props.navigation.push(
									'MissionModification',
									{ id: which }
								);
							}}
						>
							<View style={styles.menuIconContainer}>
								<Editer color='#FFBB01' />
							</View>
							<Text style={styles.textMenuTile}>
								Modifier des informations
							</Text>
						</TouchableOpacity>
					</View>
				);
			} else {
				return (
					<View>
						{demande > 0 ? (
							<View>
								<Divider />
								<TouchableOpacity
									style={styles.menuTile}
									onPress={() => {
										this.setState({ render: false });
										this.props.navigation.push('Accept', {
											id: which,
											passed: isPassed
										});
									}}
								>
									<View style={styles.menuIconContainer}>
										<Voir />
									</View>
									<Text style={styles.textMenuTile}>
										Voir les participants
									</Text>
								</TouchableOpacity>
							</View>
						) : (
							<View />
						)}
						<Divider />
						<TouchableOpacity
							style={styles.menuTile}
							onPress={() => {
								this.setState({ render: false });
								this.props.navigation.push(
									'MissionModification',
									{ id: which }
								);
							}}
						>
							<View style={styles.menuIconContainer}>
								<Editer color='#FFBB01' />
							</View>
							<Text style={styles.textMenuTile}>
								Modifier des informations
							</Text>
						</TouchableOpacity>
						<Divider />
						<TouchableOpacity
							style={styles.menuTile}
							onPress={async () => {
								/*func to remove the mission*/
								try {
									const { uid } = firebase.auth().currentUser;
									const ref = firebase
										.firestore()
										.collection('missions')
										.doc(uid);
									await ref.update({
										[which]: firebase.firestore.FieldValue.delete()
									});
								} catch (error) {
									console.log(error);
								}
								this.setState({ render: false });
							}}
						>
							<View style={styles.menuIconContainer}>
								<Supprimer />
							</View>
							<Text style={styles.textMenuTile}>
								Supprimer la mission
							</Text>
						</TouchableOpacity>
					</View>
				);
			}
		};

		const MissionsList = () => {
			if (Missions.length == 0)
				return (
					<View
						style={{
							marginLeft: 'auto',
							marginRight: 'auto'
						}}
					>
						<View style={{ paddingBottom: hp('3%') }} />
						<Text style={styles.desc}>
							{' '}
							Vous n'avez pas encore publié de mission.{' '}
						</Text>
						<View style={{ paddingBottom: hp('27%') }} />
						<TouchableOpacity
							onPress={() =>
								this.props.navigation.navigate(
									'MissionCreation'
								)
							}
						>
							<View
								style={{
									marginLeft: 'auto',
									marginRight: 'auto'
								}}
							>
								<Ajouter />
							</View>
							<View style={{ paddingBottom: hp('1%') }} />
							<Text style={styles.subText}>
								Créer une mission
							</Text>
						</TouchableOpacity>
						<View style={{ paddingBottom: hp('3%') }} />
					</View>
				);
			if (Missions.length > 0) {
				const Components = Missions.map(keys => {
					return (
						<View key={keys.id}>
							<PublishedMissionComponent
								id={keys.id}
								desc={keys.desc}
								place={keys.place}
								demande={keys.demande}
								OptionRenderer={this.OptionRenderer}
								Navigate={this.Navigate}
								passed={keys.passed}
							/>
						</View>
					);
				});
				return (
					<ScrollView
						style={{
							height: '60%',
							overflow: 'hidden',
							top: hp('-3%')
						}}
					>
						{Components}
					</ScrollView>
				);
			}
		};

		const MissionCreation = () => {
			return (
				<TouchableOpacity
					onPress={() =>
						this.props.navigation.navigate('MissionCreation')
					}
				>
					<View
						style={{
							marginLeft: 'auto',
							marginRight: 'auto',
							flexDirection: 'row'
						}}
					>
						<Ajouter style={{ top: hp('0.2%') }} />
						<View style={{ width: wp('3%') }} />
						<Text style={styles.subText}>Créer une mission</Text>
					</View>

					<View style={{ paddingBottom: hp('3%') }} />
				</TouchableOpacity>
			);
		};

		return (
			<View style={styles.screenContainer}>
				<View style={styles.mainContainer}>
					<View style={{ paddingBottom: hp('8%') }} />
					<Text style={styles.title}>Missions publiées</Text>
					<View style={{ paddingBottom: hp('2%') }} />
					<Divider
						style={{ height: 1, backgroundColor: '#FFBB01' }}
					/>
					<View style={{ paddingBottom: hp('2%') }} />
					<MissionsList />
				</View>
				<View style={styles.bottomContainer}>
					{render ? (
						<Menu />
					) : Missions.length > 0 ? (
						<MissionCreation />
					) : (
						<View />
					)}
				</View>
			</View>
		);
	}
}
