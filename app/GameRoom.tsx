import FloatingParticles from "@/components/FloatingParticles";
import GameKeyboard from "@/components/GameKeyboard";
import TopicsCta from "@/components/TopicsCta";
import { setCurrentPage } from "@/store/reducers/currentPageSlice";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";

export default function GameRoom() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setCurrentPage("gameRoom"));
  }, []);

  return (
    <LinearGradient
      colors={["#0c1f48", "#162d51", "#312e81"]}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.container}
    >
      <FloatingParticles />

      <View style={styles.content}>
        <TopicsCta />
        <GameKeyboard word="VOLCAN HUECO" />
      </View>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 0,
    gap: 20,
    marginTop: 140,
  },
});
