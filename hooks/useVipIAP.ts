import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useIAP, ErrorCode } from "expo-iap";
import { setVip, restoreVip } from "@/store/reducers/vipSlice";

const PRODUCT_ID = "enigma_vip_unlock";

export const useVipIAP = () => {
  const dispatch = useDispatch();

  const [restoring, setRestoring] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const didFetchRef = useRef(false);
  const isHandlingPurchaseRef = useRef(false);

  const {
    connected,
    products,
    availablePurchases,
    fetchProducts,
    requestPurchase,
    finishTransaction,
    getAvailablePurchases,
  } = useIAP({
    onPurchaseSuccess: async (purchase) => {
      // 🛑 evitar doble ejecución
      if (isHandlingPurchaseRef.current) return;
      isHandlingPurchaseRef.current = true;

      try {
        console.log("✅ Purchase:", purchase.productId);

        // ⚠️ manejar pending
        if (purchase.purchaseState === "pending") {
          setError("Purchase pending approval");
          isHandlingPurchaseRef.current = false; // 🔥 IMPORTANTE
          return;
        }

        const isValid =
          purchase.productId === PRODUCT_ID &&
          purchase.transactionId != null;

        if (!isValid) {
          setError("Purchase validation failed");
          return;
        }

        // 🎁 Unlock VIP
        dispatch(setVip());
        setSuccess("Purchase successful 🎉");

        // ✅ IMPORTANTE: finalizar transacción
        await finishTransaction({
          purchase,
          isConsumable: false,
        });
      } catch (err) {
        console.error("❌ finishTransaction error:", err);
        setError("Error finalizing purchase");
      } finally {
        isHandlingPurchaseRef.current = false;
      }
    },

    onPurchaseError: (err: any) => {
      console.error("❌ Purchase error:", err);

      if (err?.code === ErrorCode.UserCancelled) {
        setError("Purchase cancelled");
      } else {
        setError("Error processing purchase");
      }
    },
  });

  useEffect(() => {
  if (connected) {
    getAvailablePurchases().catch(() => {});
  }
}, [connected]);

  // 📦 Fetch productos (protegido)
  useEffect(() => {
    if (connected && !didFetchRef.current) {
      didFetchRef.current = true;

      fetchProducts({
        skus: [PRODUCT_ID],
        type: "in-app",
      }).catch((err) => {
        console.error("❌ fetchProducts error:", err);
      });
    }

    if (!connected) {
      didFetchRef.current = false;
    }
  }, [connected]);

  // 🔄 Restaurar compras (manual)
  const restoreVipPurchases = async () => {
    if (restoring) return;

    try {
      setRestoring(true);
      await getAvailablePurchases();
    } catch (err) {
      console.error("❌ Restore error:", err);
      setError("Error restoring purchases");
      setRestoring(false);
    }
  };

  // 🔍 Procesar restauración
  useEffect(() => {
    if (!restoring) return;

    const hasVip = availablePurchases?.some(
      (p) => p.productId === PRODUCT_ID
    );

    if (hasVip) {
      dispatch(restoreVip());
      setSuccess("Purchase restored successfully");
    } else {
      setError("No purchases found to restore");
    }

    setRestoring(false);
  }, [availablePurchases, restoring]);

  // 🛒 Comprar
  const buyVip = async () => {
    try {
      setError(null);
      setSuccess(null);

      await requestPurchase({
        type: "in-app",
        request: {
          apple: { sku: PRODUCT_ID },
          google: { skus: [PRODUCT_ID] },
        },
      });
    } catch (err) {
      console.error("❌ Purchase start error:", err);
      setError("Unable to start purchase");
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  return {
    connected,
    products,
    buyVip,
    restoreVipPurchases,
    restoring,
    error,
    success,
    clearMessages,
  };
};