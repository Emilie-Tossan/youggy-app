import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import SupprimerCroix from '../../../assets/svg-js/SupprimerCroix';

const FlexRow = props => {
	const { itemsList, removeIt, isAsso, isCross } = props;
	const finalList = itemsList.map(item => {
		return (
			<Button
				icon={
					isCross ? (
						<SupprimerCroix
							color={isAsso ? '#FFA901' : '#E06666'}
							style={{ top: 2, paddingRight: 5 }}
						/>
					) : (
						<View />
					)
				}
				iconRight
				title={item.title}
				type='outline'
				onPress={() => {
					removeIt(item.id);
				}}
				containerStyle={{
					marginVertical: 5,
					marginRight: 10
				}}
				buttonStyle={{
					backgroundColor: isAsso
						? item.isCompetence
							? '#FFEECC'
							: 'white'
						: item.isCompetence
						? '#FAE0E2'
						: 'white',
					borderColor: item.isAsso ? '#FFA901' : '#E06666',
					borderRadius: 100
				}}
				titleStyle={{
					color: isAsso ? '#FFA901' : '#E06666',
					fontSize: 17,
					marginRight: 10
				}}
				key={item.id}
			/>
		);
	});
	return <View style={styles.container}>{finalList}</View>;
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		width: '100%',
		overflow: 'visible'
	}
});

export default FlexRow;
