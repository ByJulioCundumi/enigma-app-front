import { IRootState } from "@/store/rootState";
import { Text, View } from "react-native";
import { useSelector } from "react-redux";

export default function Index() {
  const {homePage} = useSelector((state:IRootState)=>state.navbar)

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Text>del estado: {homePage}</Text>
    </View>
  );
}
