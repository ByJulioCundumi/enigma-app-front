import { useEffect, useRef } from "react";
import * as InAppPurchases from "expo-in-app-purchases";
import { setVip, restoreVip } from "@/store/reducers/vipSlice";
import { useDispatch } from "react-redux";

const PRODUCT_ID = "enigma_vip_unlock";

export const useIAP = () => {
  const dispatch = useDispatch();
  const isConnected = useRef(false);

  useEffect(() => {
    let listener: any;

    const init = async () => {
      try {
        await InAppPurchases.connectAsync();
        isConnected.current = true;

        listener = InAppPurchases.setPurchaseListener(
          async ({ responseCode, results }) => {
            if (responseCode === InAppPurchases.IAPResponseCode.OK) {
              const purchases = results ?? [];

              for (const purchase of purchases) {
                if (!purchase.acknowledged) {
                  if (purchase.productId === PRODUCT_ID) {
                    dispatch(setVip());
                  }

                  await InAppPurchases.finishTransactionAsync(
                    purchase,
                    false
                  );
                }
              }
            }
          }
        );
      } catch (e) {
        console.log("IAP init error", e);
      }
    };

    init();

    return () => {
      try {
        listener?.remove();
        if (isConnected.current) {
          InAppPurchases.disconnectAsync();
        }
      } catch {}
    };
  }, []);

  const buyVIP = async () => {
    await InAppPurchases.purchaseItemAsync(PRODUCT_ID);
  };

  const restoreVIP = async () => {
    try {
      const history = await InAppPurchases.getPurchaseHistoryAsync();

      if (history.responseCode === InAppPurchases.IAPResponseCode.OK) {
        const purchases = history.results ?? [];

        const hasVIP = purchases.some(
          (item) => item.productId === PRODUCT_ID
        );

        if (hasVIP) {
          dispatch(restoreVip());
        }
      }
    } catch (e) {
      console.log("restoreVIP error", e);
    }
  };

  return {
    buyVIP,
    restoreVIP,
  };
};