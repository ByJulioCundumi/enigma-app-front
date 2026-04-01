import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useIAP } from "expo-iap";
import { setVip, restoreVip } from "@/store/reducers/vipSlice";

const PRODUCT_ID = "enigma_vip_unlock";

export const useVipIAP = () => {
  const dispatch = useDispatch();

  const [restoring, setRestoring] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    connected,
    products,
    availablePurchases,
    fetchProducts,
    requestPurchase,
    finishTransaction,
    getAvailablePurchases,
  } = useIAP({
    // 🛒 Purchase success
    onPurchaseSuccess: async (purchase) => {
      try {
        console.log("✅ Purchase successful:", purchase.productId);

        const isValid =
          purchase.productId === PRODUCT_ID &&
          purchase.transactionId != null;

        if (!isValid) {
          console.error("❌ Validation failed");
          setError("Purchase validation failed");
          return;
        }

        // 🎁 Unlock VIP
        dispatch(setVip());
        setSuccess("Purchase successful 🎉");

        // ⚠️ Non-consumable
        await finishTransaction({
          purchase,
          isConsumable: false,
        });
      } catch (err) {
        console.error("❌ Error finishing purchase:", err);
        setError("Error finalizing purchase");
      }
    },

    // ❌ Purchase error
    onPurchaseError: (err: any) => {
      console.error("❌ Purchase error:", err);

      if (err?.code === "E_USER_CANCELLED") {
        setError("Purchase cancelled");
      } else {
        setError("Error processing purchase");
      }
    },
  });

  // 📦 Fetch product
  useEffect(() => {
    if (connected) {
      fetchProducts({
        skus: [PRODUCT_ID],
        type: "in-app",
      });
    }
  }, [connected]);

  // 🔄 Restore trigger
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

  // 🔍 Process restore result
  useEffect(() => {
    if (!restoring) return;
    if (!Array.isArray(availablePurchases)) return;

    const hasVip = availablePurchases.some(
      (p) => p.productId === PRODUCT_ID
    );

    if (hasVip) {
      dispatch(restoreVip());
      setSuccess("Purchase restored successfully");
      console.log("✅ Purchase restored");
    } else {
      setError("No purchases found to restore");
      console.log("⚠️ No VIP purchase found");
    }

    setRestoring(false);
  }, [availablePurchases]);

  // 🛒 Buy VIP
  const buyVip = async () => {
    try {
      await requestPurchase({
        type: "in-app",
        request: {
          apple: {
            sku: PRODUCT_ID,
          },
          google: {
            skus: [PRODUCT_ID],
          },
        },
      });
    } catch (err) {
      console.error("❌ Error starting purchase:", err);
      setError("Unable to start purchase");
    }
  };

  // 🧹 Clear messages
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