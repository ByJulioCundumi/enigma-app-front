import { useEffect } from "react";
import { Audio } from "expo-av";
import { useSelector } from "react-redux";
import { IRootState } from "@/store/rootState";

// 🔥 instancia GLOBAL
let backgroundSound: Audio.Sound | null = null;

// 🔒 lock para evitar doble creación
let isLoading = false;

/* ======================================================
   🔥 FUNCIONES GLOBALES (CONTROL EXTERNO)
====================================================== */

// ✅ Detener y liberar completamente
export const stopBackgroundMusic = async () => {
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
};

// ✅ Iniciar manualmente desde 0
export const startBackgroundMusic = async (
  source: any,
  options?: {
    volume?: number;
    isLooping?: boolean;
  }
) => {
  if (backgroundSound || isLoading) return;

  isLoading = true;

  try {
    const { sound } = await Audio.Sound.createAsync(source, {
      shouldPlay: true,
      isLooping: options?.isLooping ?? true,
      volume: options?.volume ?? 0.1,
    });

    backgroundSound = sound;
  } catch (e) {
    console.log("Error starting sound:", e);
  } finally {
    isLoading = false;
  }
};

// ✅ Pausar sin destruir (opcional)
export const pauseBackgroundMusic = async () => {
  if (backgroundSound) {
    try {
      await backgroundSound.pauseAsync();
    } catch (e) {
      console.log("Error pausing sound:", e);
    }
  }
};

/* ======================================================
   🎵 HOOK PRINCIPAL (CONTROL AUTOMÁTICO)
====================================================== */

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

  const { enabled } = useSelector(
    (state: IRootState) => state.music
  );

  useEffect(() => {
    let isMounted = true;

    const stopAndUnload = async () => {
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
    };

    const startMusic = async () => {
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
          await sound.unloadAsync();
        }
      } catch (e) {
        console.log("Error loading sound:", e);
      } finally {
        isLoading = false;
      }
    };

    const handleMusic = async () => {
      // 🔴 prioridad: configuración global
      if (!enabled) {
        await stopAndUnload();
        return;
      }

      // 🎯 solo en página index
      if (currentPage === "index") {
        if (!backgroundSound) {
          await startMusic();
        }
      } else {
        await stopAndUnload();
      }
    };

    handleMusic();

    return () => {
      isMounted = false;
    };
  }, [currentPage, enabled, source]);
};