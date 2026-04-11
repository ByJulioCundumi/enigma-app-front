import { useEffect } from "react";
import { useAudioPlayer } from "expo-audio";

/**
 * Hook para reproducir efectos de sonido usando expo-audio
 * @param source Ruta del sonido
 */
export const useSoundEffect = (source: any) => {
  // Creamos el player usando el hook en el nivel superior
  const player = useAudioPlayer(source);

  // Función para reproducir el sonido
  const play = () => {
    try {
      player.loop = false;    // No repetir
      player.seekTo(0);       // Volver al inicio
      player.play();          // Reproducir
    } catch (error) {
      console.log("Error al reproducir sonido:", error);
    }
  };

  // Limpiar el player al desmontar
  useEffect(() => {
    return () => {
      try {
        player.pause();       // Pausar
        player.seekTo(0);     // Reiniciar
      } catch {}
    };
  }, [player]);

  return { play };
};