/* eslint-disable import/no-commonjs */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Image, ActivityIndicator } from 'react-native';
import { strings } from '../../../../locales/i18n';
import { createStyles } from './styles';
import Text, {
  TextVariants,
} from '../../../component-library/components/Texts/Text';
import StyledButton from '../../UI/StyledButton';
import { createNavigationDetails } from '../../../util/navigation/navUtils';
import Routes from '../../../constants/navigation/Routes';
import EngineService from '../../../core/EngineService';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { createWalletRestoredNavDetails } from './WalletRestored';
import { useAppThemeFromContext } from '../../../util/theme';
import { createWalletResetNeededNavDetails } from './WalletResetNeeded';
import { MetaMetricsEvents } from '../../../core/Analytics';
import AnalyticsV2 from '../../../util/analyticsV2';
import generateDeviceAnalyticsMetaData from '../../../util/metrics';

/* eslint-disable import/no-commonjs, @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports */
const onboardingDeviceImage = require('../../../images/swaps_onboard_device.png');

export const createRestoreWalletNavDetails = createNavigationDetails(
  Routes.VAULT_RECOVERY.RESTORE_WALLET,
);

const RestoreWallet = () => {
  const { colors } = useAppThemeFromContext();
  const styles = createStyles(colors);

  const [loading, setLoading] = useState<boolean>(false);

  const { navigate } = useNavigation();

  const deviceMetaData = useMemo(() => generateDeviceAnalyticsMetaData(), []);

  useEffect(() => {
    AnalyticsV2.trackEvent(
      MetaMetricsEvents.VAULT_CORRUPTION_RESTORE_WALLET_SCREEN_VIEWED,
      deviceMetaData,
    );
  }, [deviceMetaData]);

  const handleOnNext = useCallback(async () => {
    setLoading(true);
    AnalyticsV2.trackEvent(
      MetaMetricsEvents.VAULT_CORRUPTION_RESTORE_WALLET_BUTTON_PRESSED,
      deviceMetaData,
    );
    const restoreResult = await EngineService.initializeVaultFromBackup();
    if (restoreResult.success) {
      navigate(...createWalletRestoredNavDetails());
    } else {
      navigate(...createWalletResetNeededNavDetails());
    }
  }, [deviceMetaData, navigate]);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.images}>
          <Image source={onboardingDeviceImage} />
        </View>
        <Text variant={TextVariants.lHeadingLG} style={styles.title}>
          {strings('restore_wallet.restore_needed_title')}
        </Text>
        <Text variant={TextVariants.sBodyMD} style={styles.description}>
          {strings('restore_wallet.restore_needed_description')}
        </Text>
      </View>
      <View style={styles.actionButtonWrapper}>
        <StyledButton
          type="confirm"
          containerStyle={styles.actionButton}
          onPress={handleOnNext}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.primary.inverse} />
          ) : (
            strings('restore_wallet.restore_needed_action')
          )}
        </StyledButton>
      </View>
    </SafeAreaView>
  );
};

export default React.memo(RestoreWallet);
