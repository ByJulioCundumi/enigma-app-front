import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from "react-native-google-mobile-ads";

// 🎯 ID del anuncio intersticial
// ✅ Test en desarrollo
// 🔴 Reemplaza en producción
const adUnitId = "ca-app-pub-4432010611800941/8763755918";

// 🧠 Crear anuncio
export const createInterstitialAd = () => {
  return InterstitialAd.createForAdRequest(adUnitId, {
    requestNonPersonalizedAdsOnly: true,
  });
};

// 🚀 Mostrar anuncio intersticial
export const showInterstitialAd = (onClose?: () => void) => {
  const interstitial = createInterstitialAd();

  let cleanup = () => {};

  // 📦 Cuando carga → se muestra
  const unsubscribeLoaded = interstitial.addAdEventListener(
    AdEventType.LOADED,
    () => {
      interstitial.show();
    }
  );

  // ❌ Cuando el usuario lo cierra
  const unsubscribeClosed = interstitial.addAdEventListener(
    AdEventType.CLOSED,
    () => {
      onClose?.();
      cleanup();
    }
  );

  // ⚠️ Error
  const unsubscribeError = interstitial.addAdEventListener(
    AdEventType.ERROR,
    (error) => {
      console.log("Interstitial Ad error:", error);
      cleanup();
    }
  );

  // 🧹 Limpiar listeners
  cleanup = () => {
    unsubscribeLoaded();
    unsubscribeClosed();
    unsubscribeError();
  };

  // 📥 Cargar anuncio
  interstitial.load();
};