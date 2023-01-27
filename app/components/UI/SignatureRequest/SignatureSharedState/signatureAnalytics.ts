import Engine from '../../../../core/Engine';
import { getAddressAccountType } from '../../../../util/address';

const getSignatureAnalytics = ({
  currentPageInformation,
  selectedAddress,
  type,
  messageParams,
}: any) => {
  const { NetworkController }: any = Engine.context;
  try {
    const { chainId } = NetworkController?.state?.provider || {};
    const url = new URL(currentPageInformation?.url);

    return {
      account_type: getAddressAccountType(selectedAddress),
      dapp_host_name: url?.host,
      dapp_url: currentPageInformation?.url,
      chain_id: chainId,
      sign_type: type,
      version: messageParams?.version,
      ...currentPageInformation?.analytics,
    };
  } catch (error) {
    return {};
  }
};

export default getSignatureAnalytics;
