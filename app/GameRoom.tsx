import GameKeyboard from "@/components/GameKeyboard";
import HintsSlider from "@/components/HintsSlider";
import TopicsCta from "@/components/TopicsCta";
import { setCurrentPage } from "@/store/reducers/currentPageSlice";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";

export default function GameRoom() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setCurrentPage("gameRoom"));
  }, []);

  return (
    <ImageBackground
          source={require("../assets/images/bg2.avif")}
          resizeMode="cover"
          style={styles.container}
        >
    <LinearGradient
      colors={["#1231755b", "#162d51", "#312e81b9"]}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.container}
    >

      <View style={styles.content}>
        <TopicsCta useTimer={true}/>

        <HintsSlider
          hints={[
            "Se encuentra en zonas montañosas.",
            "Puede expulsar lava y ceniza.",
            "Entra en erupción cuando aumenta la presión interna.",
          ]}
          baseCost={10}
          increment={15}
        />
        
        <GameKeyboard word="VOLCAN HUECO" />
      </View>

    </LinearGradient>
    </ImageBackground>
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
