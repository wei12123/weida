import React, { PureComponent } from 'react';
import { ScrollView, Text, View, SafeAreaView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { colors, fontStyles } from '../../../styles/common';
import Emoji from 'react-native-emoji';
import AsyncStorage from '@react-native-community/async-storage';
import OnboardingProgress from '../../UI/OnboardingProgress';
import StyledButton from '../../UI/StyledButton';
import { strings } from '../../../../locales/i18n';
import { showAlert } from '../../../actions/alert';
import AndroidBackHandler from '../AndroidBackHandler';
import ActionModal from '../../UI/ActionModal';
import Device from '../../../util/Device';
import Icon from 'react-native-vector-icons/Octicons';

const styles = StyleSheet.create({
	mainWrapper: {
		backgroundColor: colors.white,
		flex: 1
	},
	scrollviewWrapper: {
		flex: 1,
		paddingTop: 12
	},
	wrapper: {
		flex: 1,
		paddingHorizontal: 50
	},
	hintWrapper: {
		height: 270,
		alignSelf: 'center',
		backgroundColor: colors.white,
		borderRadius: 16,
		padding: 24
	},
	hintHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 16
	},
	recovery: {
		fontSize: 18,
		...fontStyles.extraBold,
		color: colors.fontPrimary
	},
	leaveHint: {
		fontSize: 14,
		...fontStyles.regular,
		color: colors.fontPrimary,
		marginBottom: 16
	},
	noSeedphrase: {
		fontSize: 14,
		...fontStyles.regular,
		color: colors.red,
		marginBottom: 16
	},
	hintInput: {
		borderRadius: 6,
		borderWidth: 1,
		borderColor: colors.grey500,
		padding: 16,
		minHeight: 76,
		paddingTop: 16
	},
	onBoardingWrapper: {
		paddingHorizontal: 20,
		marginBottom: 12
	},
	congratulations: {
		fontSize: 32,
		marginBottom: 12,
		color: colors.fontPrimary,
		justifyContent: 'center',
		textAlign: 'center',
		...fontStyles.extraBold
	},
	baseText: {
		fontSize: 16,
		color: colors.fontPrimary,
		textAlign: 'center',
		...fontStyles.normal
	},
	successText: {
		marginBottom: 32
	},
	hintText: {
		marginBottom: 26,
		color: colors.blue
	},
	learnText: {
		color: colors.blue
	},
	recoverText: {
		marginBottom: 26
	},
	emoji: {
		textAlign: 'center',
		fontSize: 65,
		marginBottom: 16
	},
	buttonWrapper: {
		flexShrink: 1,
		justifyContent: 'flex-end',
		paddingHorizontal: 32
	}
});

/**
 * View that's shown during the last step of
 * the backup seed phrase flow
 */
class ManualBackupStep3 extends PureComponent {
	state = {
		currentStep: 4,
		showHint: false,
		hintText: ''
	};

	static propTypes = {
		/**
		/* navigation object required to push and pop other views
		*/
		navigation: PropTypes.object
	};

	componentDidMount() {
		this.steps = this.props.navigation.getParam('steps');
	}

	toggleHint = () => {
		this.setState({ showHint: !this.state.showHint });
	};

	learnMore = () =>
		this.props.navigation.navigate('Webview', {
			url: 'https://support.metamask.io',
			title: strings('drawer.metamask_support')
		});

	done = async () => {
		this.toggleHint();
		await AsyncStorage.setItem('seedphraseHint', this.state.hintText);
		this.props.navigation.popToTop();
		this.props.navigation.goBack(null);
	};

	handleChangeText = text => this.setState({ hintText: text });

	renderHint = () => {
		const { showHint, hintText } = this.state;
		return (
			<ActionModal
				confirmText={strings('manual_backup_step_3.save')}
				confirmButtonMode={'confirm'}
				onCancelPress={this.toggleHint}
				onConfirmPress={this.done}
				modalVisible={showHint}
			>
				<View style={[styles.hintWrapper]}>
					<View style={styles.hintHeader}>
						<Text style={styles.recovery}>{strings('manual_backup_step_3.recovery_hint')}</Text>
						<TouchableOpacity onPress={this.toggleHint}>
							<Icon name="x" size={16} />
						</TouchableOpacity>
					</View>
					<Text style={styles.leaveHint}>{strings('manual_backup_step_3.leave_hint')}</Text>
					<Text style={styles.noSeedphrase}>{strings('manual_backup_step_3.no_seedphrase')}</Text>
					<TextInput
						style={styles.hintInput}
						value={hintText}
						placeholder={strings('manual_backup_step_3.example')}
						onChangeText={this.handleChangeText}
						multiline
						textAlignVertical={'top'}
					/>
				</View>
			</ActionModal>
		);
	};

	render() {
		return (
			<>
				<SafeAreaView style={styles.mainWrapper}>
					<ScrollView
						contentContainerStyle={styles.scrollviewWrapper}
						style={styles.mainWrapper}
						testID={'account-backup-step-6-screen'}
					>
						<View style={styles.onBoardingWrapper}>
							<OnboardingProgress currentStep={this.state.currentStep} stepWords={this.steps} />
						</View>
						<View style={styles.wrapper}>
							<Emoji name="tada" style={styles.emoji} />
							<Text style={styles.congratulations}>
								{strings('manual_backup_step_3.congratulations')}
							</Text>
							<Text style={[styles.baseText, styles.successText]}>
								{strings('manual_backup_step_3.success')}
							</Text>
							<TouchableOpacity onPress={this.toggleHint}>
								<Text style={[styles.baseText, styles.hintText]}>
									{strings('manual_backup_step_3.hint')}
								</Text>
							</TouchableOpacity>
							<Text style={[styles.baseText, styles.recoverText]}>
								{strings('manual_backup_step_3.recover')}
							</Text>
							<TouchableOpacity onPress={this.learnMore}>
								<Text style={[styles.baseText, styles.learnText]}>
									{strings('manual_backup_step_3.learn')}
								</Text>
							</TouchableOpacity>
						</View>
					</ScrollView>
					<View style={styles.buttonWrapper}>
						<StyledButton
							containerStyle={styles.button}
							type={'confirm'}
							testID={'submit-button'}
							onPress={this.done}
						>
							{strings('manual_backup_step_3.done')}
						</StyledButton>
					</View>
					{Device.isAndroid() && <AndroidBackHandler customBackPress={this.props.navigation.pop} />}
				</SafeAreaView>
				{this.renderHint()}
			</>
		);
	}
}

const mapDispatchToProps = dispatch => ({
	showAlert: config => dispatch(showAlert(config))
});

export default connect(
	null,
	mapDispatchToProps
)(ManualBackupStep3);
