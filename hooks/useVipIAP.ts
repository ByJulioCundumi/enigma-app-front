import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useIAP } from "expo-iap";
import { setVip, restoreVip } from "@/store/reducers/vipSlice";

const PRODUCT_ID = "enigma_vip_unlock";

export const useVipIAP = () => {
  const dispatch = useDispatch();

  const {
    connected,
    products,
    availablePurchases,
    fetchProducts,
    requestPurchase,
    finishTransaction,
    getAvailablePurchases,
  } = useIAP({
    // ✅ Callback oficial (doc)
    onPurchaseSuccess: async (purchase) => {
      try {
        console.log("✅ Compra exitosa:", purchase.productId);

        // 🔒 (sin backend por ahora)
        const isValid =
          purchase.productId === PRODUCT_ID &&
          purchase.transactionId != null;

        if (!isValid) {
          console.error("❌ Verificación fallida");
          return;
        }

        // 🎁 Activar VIP
        dispatch(setVip());

        // ⚠️ IMPORTANTE: NO consumible
        await finishTransaction({
          purchase,
          isConsumable: false,
        });
      } catch (error) {
        console.error("❌ Error completando compra:", error);
      }
    },

    onPurchaseError: (error) => {
      console.error("❌ Error de compra:", error);
    },
  });

  // 📦 Obtener productos (doc)
  useEffect(() => {
    if (connected) {
      fetchProducts({
        skus: [PRODUCT_ID],
        type: "in-app",
      });
    }
  }, [connected]);

  // 🔁 Cargar compras (IMPORTANTE en expo-iap 2026)
  useEffect(() => {
    if (connected) {
      getAvailablePurchases();
    }
  }, [connected]);

  // 🔄 Detectar si ya es VIP (restore automático)
  useEffect(() => {
    if (!availablePurchases) return;

    const hasVip = availablePurchases.some(
      (p) => p.productId === PRODUCT_ID
    );

    if (hasVip) {
      dispatch(restoreVip());
    }
  }, [availablePurchases]);

  // 🛒 Comprar (API nueva correcta)
  const buyVip = async () => {
    try {
      await requestPurchase({
        type: "in-app", // 👈 requerido en 2026
        request: {
          apple: {
            sku: PRODUCT_ID,
          },
          google: {
            skus: [PRODUCT_ID],
          },
        },
      });
    } catch (error) {
      console.error("❌ Error al iniciar compra:", error);
    }
  };

  // 🔄 Restaurar manual (botón)
const restoreVipPurchases = async () => {
  try {
    // actualiza availablePurchases dentro del hook
    await getAvailablePurchases();

    // usa availablePurchases del hook
    const hasVip = availablePurchases?.some(
      (p) => p.productId === PRODUCT_ID
    );

    if (hasVip) {
      dispatch(restoreVip());
      console.log("✅ Compra restaurada");
      return true;
    }

    console.log("⚠️ No se encontró compra VIP");
    return false;
  } catch (error) {
    console.error("❌ Error restaurando:", error);
    return false;
  }
};

  return {
    connected,
    products,
    buyVip,
    restoreVipPurchases,
  };
};