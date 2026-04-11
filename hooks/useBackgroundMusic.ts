import { useEffect, useCallback, useRef } from "react";
import { AppState } from "react-native";
import { useAudioPlayer } from "expo-audio";

export const useBackgroundMusic = (source: any, autoResume = true) => {
  const player = useAudioPlayer(source);

  const appState = useRef(AppState.currentState);
  const isManuallyPaused = useRef(false);

  // 🔁 Configurar loop solo una vez
  useEffect(() => {
    try {
      player.loop = true;
    } catch (e) {
      console.log("Error configurando loop:", e);
    }
  }, [player]);

  // ▶️ Play manual
  const play = useCallback(() => {
    try {
      isManuallyPaused.current = false;
      player.play();
    } catch (e) {
      console.log("Error al reproducir música:", e);
    }
  }, [player]);

  // ⏸️ Pause manual
  const pause = useCallback(() => {
    try {
      isManuallyPaused.current = true;
      player.pause();
    } catch (e) {
      console.log("Error al pausar música:", e);
    }
  }, [player]);

  // 🔄 Reset opcional
  const reset = useCallback(() => {
    try {
      player.pause();
      player.seekTo(0);
    } catch (e) {
      console.log("Error al resetear música:", e);
    }
  }, [player]);

  // 📱 Control de estado de la app (foreground/background)
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      const isActive = nextState === "active";
      const wasActive = appState.current === "active";

      appState.current = nextState;

      // 👉 Si se va a background, SIEMPRE pausar
      if (!isActive) {
        try {
          player.pause();
        } catch {}
        return;
      }

      // 👉 Si vuelve a foreground, solo reanudar si NO fue pausa manual
      if (isActive && wasActive === false) {
        if (!isManuallyPaused.current && autoResume) {
          try {
            player.play();
          } catch {}
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, [player, autoResume]);

  // 🧹 Cleanup
  useEffect(() => {
    return () => {
      try {
        player.pause();
      } catch {}
    };
  }, [player]);

  return {
    play,
    pause,
    reset,
  };
};