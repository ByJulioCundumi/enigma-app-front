import { Audio } from "expo-av";

let sound: Audio.Sound | null = null;

export const playTimeSound = async (file: any) => {
  try {
    // 🔴 si ya existe, lo eliminamos para reiniciar desde 0
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      sound = null;
    }

    const { sound: newSound } = await Audio.Sound.createAsync(file, {
      shouldPlay: true,
      isLooping: true
    });

    sound = newSound;
  } catch (e) {
    console.log("Error playing sound:", e);
  }
};

export const stopTimeSound = async () => {
  if (!sound) return;

  try {
    await sound.stopAsync();   // 🔥 se detiene inmediato
    await sound.unloadAsync(); // 🔥 elimina completamente
  } catch (e) {
    console.log("Error stopping sound:", e);
  } finally {
    sound = null;
  }
};