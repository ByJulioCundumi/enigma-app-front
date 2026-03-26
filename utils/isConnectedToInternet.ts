import NetInfo from "@react-native-community/netinfo";

export const isConnectedToInternet = async (): Promise<boolean> => {
  try {
    const state = await NetInfo.fetch();

    return !!state.isConnected;
  } catch (error) {
    return false;
  }
};