import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "@/store/rootState";
import { showInterstitialAd } from "@/ads/interstitialAd";
import { openVipModal } from "@/store/reducers/vipSlice";
import { isConnectedToInternet } from "@/utils/isConnectedToInternet";

export default function InterstitialManager() {
  const dispatch = useDispatch();
  const { isVip } = useSelector((state: IRootState) => state.vip);
  const isAdRunningRef = useRef(false);

  const showInterstitialSafe = () => {
    return new Promise<void>(async (resolve) => {
      if (isVip || isAdRunningRef.current) return resolve();

      const connected = await isConnectedToInternet();
      if (!connected) {
        dispatch(openVipModal());
        return resolve();
      }

      isAdRunningRef.current = true;
      let finished = false;

      const timeout = setTimeout(() => {
        if (!finished) {
          finished = true;
          isAdRunningRef.current = false;
          dispatch(openVipModal());
          resolve();
        }
      }, 10_000); // 10 segundos

      try {
        showInterstitialAd(() => {
          if (finished) return;
          finished = true;
          clearTimeout(timeout);
          isAdRunningRef.current = false;
          resolve();
        });
      } catch (e) {
        if (!finished) {
          finished = true;
          clearTimeout(timeout);
          isAdRunningRef.current = false;
          dispatch(openVipModal());
          resolve();
        }
      }
    });
  };

  useEffect(() => {
    if (isVip) return;

    // Mostrar cada 2 minutos
    const interval = setInterval(() => {
      showInterstitialSafe();
    }, 100_000);

    return () => clearInterval(interval);
  }, [isVip]);

  return null; // componente invisible
}