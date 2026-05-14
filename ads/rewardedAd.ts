import {
  RewardedAd,
  RewardedAdEventType,
  AdEventType,
  TestIds,
} from "react-native-google-mobile-ads";

// 🎯 ID del anuncio recompensado
// ✅ En desarrollo usa TestIds (OBLIGATORIO para evitar bloqueos)
// 🔴 En producción reemplaza con tu ID real de AdMob
const adUnitId = "ca-app-pub-4432010611800941/7009959268";

// 🧠 Crear instancia del anuncio
export const createRewardedAd = () => {
  return RewardedAd.createForAdRequest(adUnitId, {
    requestNonPersonalizedAdsOnly: true, // GDPR safe
  });
};

// 🚀 Mostrar anuncio recompensado
export const showRewardedAd = (onReward: () => void) => {
  const rewarded = createRewardedAd();

  let cleanup = () => {};

  // 📦 Cuando el anuncio carga → se muestra automáticamente
  const unsubscribeLoaded = rewarded.addAdEventListener(
    RewardedAdEventType.LOADED,
    () => {
      rewarded.show();
    }
  );

  // 🎁 Usuario recibe recompensa
  const unsubscribeEarned = rewarded.addAdEventListener(
    RewardedAdEventType.EARNED_REWARD,
    () => {
      onReward();
    }
  );

  // ❌ Usuario cierra el anuncio
  const unsubscribeClosed = rewarded.addAdEventListener(
    AdEventType.CLOSED,
    () => {
      cleanup();
    }
  );

  // ⚠️ Error en anuncio
  const unsubscribeError = rewarded.addAdEventListener(
    AdEventType.ERROR,
    (error) => {
      console.log("Ad error:", error);
      cleanup();
    }
  );

  // 🧹 Limpiar listeners (evita memory leaks)
  cleanup = () => {
    unsubscribeLoaded();
    unsubscribeEarned();
    unsubscribeClosed();
    unsubscribeError();
  };

  // 📥 Cargar anuncio
  rewarded.load();
};