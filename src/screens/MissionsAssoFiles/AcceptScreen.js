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

import AntIcon from 'react-native-vector-icons/AntDesign';

import BackButton from '../Components/BackButton';

import Retirer from '../../../assets/svg-js/Retirer';
import MessageMenu from '../../../assets/svg-js/MessageMenu';
import Refuser from '../../../assets/svg-js/Refuser';
import Accepter from '../../../assets/svg-js/Accepter';

import MesParticipantsComponent from '../Components/MesParticipantsComponent';

import dateToday from '../../utils/dateToday';

import firebase from 'react-native-firebase';
import moment from 'moment';
import 'moment/locale/fr';
moment.locale('fr');

const Device = require('react-native-device-detection');

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
		color: 'grey',
		fontSize: hp('2%')
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
		MesParticipants: [],
		renderTrue: false,
		renderFalse: false,
		which: '',
		//profile: '',
		isValidate: '',
		missionUid: '',
		title: '',
		passed: false,
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
		const missionUid = this.props.navigation.getParam('id', 'noMission');
		this.setState({ missionUid });
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
			const { [missionUid]: mission } = snap.data();
			const {
				title,
				acceptedBenevole,
				refusedBenevole,
				wasThere,
				wasNotThere
			} = mission;
			this.setState({ title });
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
				: askerSnap.docs.map(doc => {
						let isRefused = false;
						for (let i = 0; i < refusedBenevole.length; i++) {
							const benevole = refusedBenevole[i];
							if (benevole === doc.id) {
								isRefused = true;
								break;
							}
						}
						if (!isRefused)
							return {
								benevole: doc.id,
								selected: doc.data()[missionUid]
							};
				  });
			//console.log(askersList);
			const MesParticipants = [];
			for (let i = 0; i < askersList.length; i++) {
				const asker = askersList[i];
				if (asker) {
					const {
						benevole,
						selected: { date, rangeTime }
					} = asker;
					const mois = moment(new Date(date)).format('MMMM');
					const day = date.split('-')[2];
					const starttmp = rangeTime.start.split(':');
					const endtmp = rangeTime.end.split(':');
					const startHour =
						starttmp[1] === '00'
							? starttmp[0] + 'h'
							: starttmp.join('h');
					const endHour =
						endtmp[1] === '00' ? endtmp[0] + 'h' : endtmp.join('h');
					const beneProfileSnap = await firebase
						.firestore()
						.collection('benevoleUsers')
						.doc(benevole)
						.get();
					const name = `${beneProfileSnap.data().firstName} ${
						beneProfileSnap.data().lastName
					}`;
					const job = beneProfileSnap.data().jobName;
					let status = false;
					let passedStatus = 0;
					for (let ii = 0; ii < acceptedBenevole.length; ii++) {
						const askerAccepted = acceptedBenevole[ii];
						if (askerAccepted === benevole) {
							status = true;
							break;
						}
					}
					for (let ii = 0; ii < wasNotThere.length; ii++) {
						const askerAccepted = wasNotThere[ii];
						if (askerAccepted === benevole) {
							passedStatus = 2;
							break;
						}
					}
					for (let ii = 0; ii < wasThere.length; ii++) {
						const askerAccepted = wasThere[ii];
						if (askerAccepted === benevole) {
							passedStatus = 1;
							break;
						}
					}
					let today = new Date();
					let beneParticipation = new Date(date);
					let participant = {
						id: benevole,
						date: day,
						month: mois,
						startHour,
						endHour,
						name,
						job,
						status,
						passedStatus,
						dateRef: date,
						passed: today > beneParticipation
					};
					//console.log(participant);
					MesParticipants.push(participant);
				}
			}
			this.setState({
				MesParticipants,
				unmountThoseListeners: [...listeners]
			});
		} catch (error) {
			console.log(error);
		}
	}

	async dataListener() {
		const missionUid = this.props.navigation.getParam('id', 'noMission');
		this.setState({ missionUid });
		try {
			const { uid } = firebase.auth().currentUser;
			const ref = firebase
				.firestore()
				.collection('missions')
				.doc(uid);
			const snap = await ref.get();
			const { [missionUid]: mission } = snap.data();
			const {
				title,
				acceptedBenevole,
				refusedBenevole,
				wasThere,
				wasNotThere
			} = mission;
			this.setState({ title });
			const candidatsRef = firebase
				.firestore()
				.collection('candidatures')
				.where('postule', 'array-contains', missionUid);
			const askerSnap = await candidatsRef.get();
			const askersList = askerSnap.empty
				? []
				: askerSnap.docs.map(doc => {
						let isRefused = false;
						for (let i = 0; i < refusedBenevole.length; i++) {
							const benevole = refusedBenevole[i];
							if (benevole === doc.id) {
								isRefused = true;
								break;
							}
						}
						if (!isRefused)
							return {
								benevole: doc.id,
								selected: doc.data()[missionUid]
							};
				  });
			//console.log(askersList);
			const MesParticipants = [];
			for (let i = 0; i < askersList.length; i++) {
				const asker = askersList[i];
				if (asker) {
					const {
						benevole,
						selected: { date, rangeTime }
					} = asker;
					const mois = moment(new Date(date)).format('MMMM');
					const day = date.split('-')[2];
					const starttmp = rangeTime.start.split(':');
					const endtmp = rangeTime.end.split(':');
					const startHour =
						starttmp[1] === '00'
							? starttmp[0] + 'h'
							: starttmp.join('h');
					const endHour =
						endtmp[1] === '00' ? endtmp[0] + 'h' : endtmp.join('h');
					const beneProfileSnap = await firebase
						.firestore()
						.collection('benevoleUsers')
						.doc(benevole)
						.get();
					const name = `${beneProfileSnap.data().firstName} ${
						beneProfileSnap.data().lastName
					}`;
					const job = beneProfileSnap.data().jobName;
					let status = false;
					let passedStatus = 0;
					for (let ii = 0; ii < acceptedBenevole.length; ii++) {
						const askerAccepted = acceptedBenevole[ii];
						if (askerAccepted === benevole) {
							status = true;
							break;
						}
					}
					for (let ii = 0; ii < wasNotThere.length; ii++) {
						const askerAccepted = wasNotThere[ii];
						if (askerAccepted === benevole) {
							passedStatus = 2;
							break;
						}
					}
					for (let ii = 0; ii < wasThere.length; ii++) {
						const askerAccepted = wasThere[ii];
						if (askerAccepted === benevole) {
							passedStatus = 1;
							break;
						}
					}
					let today = new Date();
					let beneParticipation = new Date(date);
					let participant = {
						id: benevole,
						date: day,
						month: mois,
						startHour,
						endHour,
						name,
						job,
						status,
						passedStatus,
						dateRef: date,
						passed: today > beneParticipation
					};
					//console.log(participant);
					MesParticipants.push(participant);
				}
			}
			this.setState({ MesParticipants });
		} catch (error) {
			console.log(error);
		}
	}

	OptionRenderer = (id, status, passedStatus) => {
		if (status) {
			this.setState({ renderFalse: false });
			if (id == this.state.which || !this.state.renderTrue)
				this.setState({ renderTrue: !this.state.renderTrue });
			this.setState({ which: id });
		} else if (!status) {
			this.setState({ renderTrue: false });
			if (id == this.state.which || !this.state.renderFalse)
				this.setState({ renderFalse: !this.state.renderFalse });
			this.setState({ which: id });
		}
		if (passedStatus == 1) {
			this.setState({ isValidate: true });
		} else if (passedStatus == 2) {
			this.setState({ isValidate: false });
		} else {
			this.setState({ isValidate: '' });
		}
	};

	ProfileRenderer = (id, status) => {
		//this.setState({ profile: id });
		const { missionUid, title } = this.state;
		if (status) {
			this.props.navigation.push('RemoveProfile', {
				id,
				missionUid,
				title
			});
		} else if (!status) {
			this.props.navigation.push('AcceptProfile', {
				id,
				missionUid,
				title
			});
		}
	};

	datePassed = (date = '') => {
		// const { MesParticipants } = this.state;
		// const bene = MesParticipants.filter(el => {
		// 	return el.id === id;
		// });
		// if (bene.length) {
		const today = new Date();
		const beneParticipation = new Date(date);
		return today > beneParticipation;
		// }
		// return false;
	};

	render() {
		const {
			MesParticipants,
			renderTrue,
			renderFalse,
			which,
			isValidate,
			missionUid,
			title,
			passed
		} = this.state;
		const { goBack } = this.props.navigation;
		//console.log(passed);

		const Menu = () => {
			if (passed && (renderFalse || renderTrue)) {
				return (
					<View>
						{isValidate != true || isValidate === '' ? (
							<View>
								<Divider />

								<TouchableOpacity
									style={styles.menuTile}
									onPress={async () => {
										try {
											const {
												uid
											} = firebase.auth().currentUser;
											const ref = firebase
												.firestore()
												.collection('missions')
												.doc(uid);
											const refHours = firebase
												.firestore()
												.collection('hoursRegistry')
												.doc(uid);
											const snapHours = await refHours.get();

											const {
												[which]: beneHours
											} = snapHours.data()
												? snapHours.data()
												: { [which]: 0 };
											const beneParticipation = MesParticipants.filter(
												participant => {
													return (
														participant.id === which
													);
												}
											);
											const hoursDone = Math.abs(
												Math.floor(
													parseFloat(
														beneParticipation[0].startHour
															.split('h')
															.join(',')
													)
												) -
													Math.floor(
														parseFloat(
															beneParticipation[0].endHour
																.split('h')
																.join(',')
														)
													)
											);
											await refHours.set(
												{
													[which]:
														beneHours + hoursDone
												},
												{ merge: true }
											);
											const snap = await ref.get();
											const missions = snap.data();
											const mission =
												missions[missionUid];
											const {
												wasThere,
												wasNotThere
											} = mission;
											const newWasNotThere = wasNotThere.filter(
												beneId => beneId !== which
											);
											const newWasThere = wasThere.filter(
												beneId => beneId !== which
											);
											await ref.set(
												{
													[missionUid]: {
														...mission,
														wasThere: [
															...newWasThere,
															which
														],
														wasNotThere: newWasNotThere
													}
												},
												{ merge: true }
											);
										} catch (error) {
											console.log(error);
										}
										this.setState({
											renderFalse: false,
											renderTrue: false
										});
									}}
								>
									<View style={styles.menuIconContainer}>
										<Accepter />
									</View>
									<Text style={styles.textMenuTile}>
										Le bénévole était présent !
									</Text>
								</TouchableOpacity>
							</View>
						) : (
							<View />
						)}
						{isValidate != false || isValidate === '' ? (
							<View>
								<Divider />
								<TouchableOpacity
									style={styles.menuTile}
									onPress={async () => {
										try {
											const {
												uid
											} = firebase.auth().currentUser;
											const ref = firebase
												.firestore()
												.collection('missions')
												.doc(uid);
											const refHours = firebase
												.firestore()
												.collection('hoursRegistry')
												.doc(uid);
											const snapHours = await refHours.get();
											const {
												[which]: beneHours
											} = snapHours.data();
											const beneParticipation = MesParticipants.filter(
												participant => {
													return (
														participant.id === which
													);
												}
											);
											const hoursDone = Math.abs(
												Math.floor(
													parseFloat(
														beneParticipation[0].startHour
															.split('h')
															.join(',')
													)
												) -
													Math.floor(
														parseFloat(
															beneParticipation[0].endHour
																.split('h')
																.join(',')
														)
													)
											);
											const snap = await ref.get();
											const missions = snap.data();
											const mission =
												missions[missionUid];
											const {
												wasThere,
												wasNotThere
											} = mission;
											const newWasNotThere = wasNotThere.filter(
												beneId => beneId !== which
											);
											const newWasThere = wasThere.filter(
												beneId => beneId !== which
											);
											const wasIn = wasThere.filter(
												beneId => beneId === which
											);
											if (wasIn.length)
												await refHours.set(
													{
														[which]:
															beneHours -
															hoursDone
													},
													{ merge: true }
												);
											await ref.set(
												{
													[missionUid]: {
														...mission,
														wasThere: newWasThere,
														wasNotThere: [
															...newWasNotThere,
															which
														]
													}
												},
												{ merge: true }
											);
										} catch (error) {
											console.log(error);
										}
										this.setState({
											renderFalse: false,
											renderTrue: false
										});
									}}
								>
									<View style={styles.menuIconContainer}>
										<Refuser />
									</View>
									<Text style={styles.textMenuTile}>
										Le bénévole n'était pas présent.
									</Text>
								</TouchableOpacity>
							</View>
						) : (
							<View />
						)}
					</View>
				);
			} else {
				if (renderTrue) {
					return (
						<View>
							<Divider />
							<TouchableOpacity
								style={styles.menuTile}
								onPress={async () => {
									try {
										const {
											uid: userUid
										} = firebase.auth().currentUser;
										const assoMessagesRef = await firebase
											.firestore()
											.collection('messages')
											.doc(userUid)
											.get();
										let profil = await firebase
											.storage()
											.ref(`users/${which}/profilPhoto`)
											.getDownloadURL()
											.catch(
												err => console.log(err) === 1
											);
										if (!profil)
											profil = await firebase
												.storage()
												.ref(
													`icone-profil-benevole.png`
												)
												.getDownloadURL()
												.catch(
													err =>
														console.log(err) === 1
												);
										//look conversation with the bénévole
										const assoMessages = assoMessagesRef.data();
										const {
											[which]: toThisBenevole
										} = assoMessages;
										let convExist = false;
										let idConv = '';
										for (
											let i = 0;
											i < toThisBenevole.length;
											i++
										) {
											const conv = toThisBenevole[i];
											if (conv.uid === missionUid) {
												convExist = true;
												idConv = conv.uid;
												break;
											}
										}
										const beneRef = await firebase
											.firestore()
											.collection('benevoleUsers')
											.doc(which)
											.get();
										const name = `${
											beneRef.data().firstName
										} ${beneRef.data().lastName}`;
										if (!convExist) {
											//create new conversation with the bénévole
											await firebase
												.firestore()
												.collection('messages')
												.doc(userUid)
												.set(
													{
														[which]: [
															...toThisBenevole,
															{
																desc: title,
																messages: [],
																messagesViewed: [],
																uid: missionUid
															}
														]
													},
													{ merge: true }
												);
											idConv = missionUid;
										}
										this.setState({ renderTrue: false });
										this.props.navigation.push(
											'MessagesAsso',
											{
												mission: title,
												destinataire: which,
												profil,
												idConv,
												name
											}
										);
									} catch (error) {
										console.log(error);
									}
								}}
							>
								<View style={styles.menuIconContainer}>
									<MessageMenu />
								</View>
								<Text style={styles.textMenuTile}>
									Lui écrire un message
								</Text>
							</TouchableOpacity>
							<Divider />
							<TouchableOpacity
								style={styles.menuTile}
								onPress={async () => {
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
										const mission = missions[missionUid];
										const {
											acceptedBenevole,
											refusedBenevole
										} = mission;
										const newAcceptedBenevole = acceptedBenevole.filter(
											beneId => beneId !== which
										);
										await ref.set(
											{
												[missionUid]: {
													...mission,
													refusedBenevole: [
														...refusedBenevole,
														which
													],
													acceptedBenevole: newAcceptedBenevole
												}
											},
											{ merge: true }
										);
									} catch (error) {
										console.log(error);
									}
									this.setState({ renderTrue: false });
								}}
							>
								<View style={styles.menuIconContainer}>
									<Retirer />
								</View>
								<Text style={styles.textMenuTile}>
									Retirer de la mission
								</Text>
							</TouchableOpacity>
						</View>
					);
				}
				if (renderFalse) {
					return (
						<View>
							<Divider />
							<TouchableOpacity
								style={styles.menuTile}
								onPress={async () => {
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
										const mission = missions[missionUid];
										const { acceptedBenevole } = mission;
										const newAcceptedBenevole = acceptedBenevole.filter(
											beneId => beneId !== which
										);
										await ref.set(
											{
												[missionUid]: {
													...mission,
													acceptedBenevole: [
														...newAcceptedBenevole,
														which
													]
												}
											},
											{ merge: true }
										);
									} catch (error) {
										console.log(error);
									}
									this.setState({ renderFalse: false });
								}}
							>
								<View style={styles.menuIconContainer}>
									<Accepter />
								</View>
								<Text style={styles.textMenuTile}>
									Accepter la participation
								</Text>
							</TouchableOpacity>
							<Divider />
							<TouchableOpacity
								style={styles.menuTile}
								onPress={async () => {
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
										const mission = missions[missionUid];
										const {
											acceptedBenevole,
											refusedBenevole
										} = mission;
										const newAcceptedBenevole = acceptedBenevole.filter(
											beneId => beneId !== which
										);
										await ref.set(
											{
												[missionUid]: {
													...mission,
													refusedBenevole: [
														...refusedBenevole,
														which
													],
													acceptedBenevole: newAcceptedBenevole
												}
											},
											{ merge: true }
										);
									} catch (error) {
										console.log(error);
									}
									this.setState({ renderFalse: false });
								}}
							>
								<View style={styles.menuIconContainer}>
									<Refuser />
								</View>
								<Text style={styles.textMenuTile}>
									Refuser la participation
								</Text>
							</TouchableOpacity>
						</View>
					);
				} else return <View />;
			}
		};

		const Participants = () => {
			if (MesParticipants.length == 0) {
				return (
					<View>
						<View style={{ paddingBottom: hp('4%') }} />
						<Text style={styles.subText}>
							Aucun bénévole ne s'est, pour l'instant, inscrit à
							votre mission.
						</Text>
						<View style={{ paddingBottom: hp('3%') }} />
						<Divider
							style={{ height: 1, backgroundColor: '#DFDFDF' }}
						/>
					</View>
				);
			} else if (MesParticipants.length > 0) {
				const Components = MesParticipants.map(keys => {
					return (
						<View key={keys.id}>
							<MesParticipantsComponent
								id={keys.id}
								date={keys.date}
								month={keys.month}
								startHour={keys.startHour}
								endHour={keys.endHour}
								name={keys.name}
								job={keys.job}
								status={keys.status}
								passedStatus={keys.passedStatus}
								OptionRenderer={this.OptionRenderer}
								ProfileRenderer={this.ProfileRenderer}
								// passed={this.props.navigation.getParam(
								// 	'passed',
								// 	false
								// )}
								passed={keys.passed}
								menuPassed={() => {
									this.setState({
										passed: this.datePassed(keys.dateRef)
									});
								}}
							/>
						</View>
					);
				});
				return (
					<ScrollView style={{ height: '70%', overflow: 'hidden' }}>
						{Components}
					</ScrollView>
				);
			}
		};

		const Header = () => {
			return (
				<View style={{ height: '10%' }}>
					<View style={{ paddingBottom: hp('1%') }} />
					<BackButton text='Retour' color='black' goBack={goBack} />
				</View>
			);
		};

		return (
			<View style={styles.screenContainer}>
				<Header />
				<View style={styles.mainContainer}>
					<Text style={styles.title}>Liste des participants</Text>
					<View style={{ paddingBottom: hp('2%') }} />
					<Divider
						style={{ height: 1, backgroundColor: '#FFBB01' }}
					/>
					<Participants />
				</View>
				<View style={styles.bottomContainer}>
					<Menu />
				</View>
			</View>
		);
	}
}
