import { useEffect, useCallback } from "react";
import { useAudioPlayer } from "expo-audio";

/**
 * Hook para sonido de tiempo en loop (estable)
 */
export const useTimeSound = (source: any) => {
  const player = useAudioPlayer(source);

  // ✅ Configurar el loop UNA SOLA VEZ
  useEffect(() => {
    try {
      player.loop = true;
    } catch (e) {
      console.log("Error configurando loop:", e);
    }
  }, [player]);

  // ▶️ Reproducir (sin reiniciar cada vez)
  const play = useCallback(() => {
    try {
      player.play();
    } catch (e) {
      console.log("Error al reproducir sonido de tiempo:", e);
    }
  }, [player]);

  // ⏸️ Pausar
  const pause = useCallback(() => {
    try {
      player.pause();
    } catch (e) {
      console.log("Error al pausar:", e);
    }
  }, [player]);

  // 🔄 Reset manual (solo cuando lo necesites)
  const reset = useCallback(() => {
    try {
      player.pause();
      player.seekTo(0);
    } catch (e) {
      console.log("Error al resetear:", e);
    }
  }, [player]);

  // 🧹 Limpieza
  useEffect(() => {
    return () => {
      try {
        player.pause();
      } catch {}
    };
  }, [player]);

  return { play, pause, reset };
};