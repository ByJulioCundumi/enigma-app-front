import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { IRootState } from "@/store/rootState";
import { setCurrentPage } from "@/store/reducers/currentPageSlice";
import { useRouter } from "expo-router";

import SettingsButton from "./SettingsButton";
import LanguageSelector from "./LanguageSelector";
import EnergyStat from "./EnergyStat";

const { width } = Dimensions.get("window");

export default function TopBar() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { currentPage } = useSelector(
    (state: IRootState) => state.currentPage
  );

  const goToIndex = () => {
    router.push("/");
    dispatch(setCurrentPage("index"));
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        
        {/* IZQUIERDA */}
        <View style={styles.leftGroup}>
          {currentPage === "index" ? (
            <View style={{flexDirection: "row", alignItems: "center", gap: 5}}>
              <SettingsButton />
              <LanguageSelector/>
            </View>
          ) : (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.backButton}
              onPress={goToIndex}
            >
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        {/* DERECHA */}
        <EnergyStat />

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 30,
    width: "100%",
    alignItems: "center",
    zIndex: 20,
  },

  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: width * 0.95,
    borderRadius: 28,
    paddingHorizontal: 12,
    backgroundColor: "rgba(17, 24, 39, 0)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0)",
  },

  leftGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
});