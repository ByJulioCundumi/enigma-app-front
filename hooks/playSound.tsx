import { Audio } from "expo-av";

export const playSound = async (file: any) => {
  const { sound } = await Audio.Sound.createAsync(file);

  await sound.playAsync();

  sound.setOnPlaybackStatusUpdate((status) => {
    if (!status.isLoaded) return;

    if (status.didJustFinish) {
      sound.unloadAsync();
    }
  });
};