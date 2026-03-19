import { useEffect } from "react";
import { Audio } from "expo-av";
import { useSelector } from "react-redux";
import { IRootState } from "@/store/rootState";

// 🔥 instancia GLOBAL
let backgroundSound: Audio.Sound | null = null;

// 🔒 lock para evitar doble creación
let isLoading = false;

export const useBackgroundMusic = (
  source: any,
  options?: {
    volume?: number;
    isLooping?: boolean;
  }
) => {
  const { currentPage } = useSelector(
    (state: IRootState) => state.currentPage
  );

  useEffect(() => {
    let isMounted = true;

    const handleMusic = async () => {
      // 🎯 solo en index
      if (currentPage === "index") {
        // 🔴 evita duplicados + evita race condition
        if (backgroundSound || isLoading) return;

        isLoading = true;

        try {
          const { sound } = await Audio.Sound.createAsync(source, {
            shouldPlay: true,
            isLooping: options?.isLooping ?? true,
            volume: options?.volume ?? 0.1,
          });

          if (isMounted) {
            backgroundSound = sound;
          } else {
            // 🔴 si ya no está montado, limpia
            await sound.unloadAsync();
          }
        } catch (e) {
          console.log("Error loading sound:", e);
        } finally {
          isLoading = false;
        }
      } 
      
      // 🔴 salir de index → detener SIEMPRE
      else {
        if (backgroundSound) {
          try {
            await backgroundSound.stopAsync();
            await backgroundSound.unloadAsync();
          } catch (e) {
            console.log("Error stopping sound:", e);
          } finally {
            backgroundSound = null;
          }
        }
      }
    };

    handleMusic();

    return () => {
      isMounted = false;
    };
  }, [currentPage, source]);
};