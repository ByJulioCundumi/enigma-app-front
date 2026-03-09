import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

interface Topic {
  id: string;
  name: string;
  levelsCompleted: number;
  totalLevels: number;
  favorite?: boolean;
}

const MOCK_TOPICS: Topic[] = [
  { id: "1", name: "Personajes", levelsCompleted: 20, totalLevels: 100 },
  { id: "2", name: "Películas", levelsCompleted: 12, totalLevels: 80 },
  { id: "3", name: "Anime", levelsCompleted: 35, totalLevels: 120 },
  { id: "4", name: "Videojuegos", levelsCompleted: 8, totalLevels: 60 },
  { id: "5", name: "Animales", levelsCompleted: 40, totalLevels: 90 },
];

export default function TopicList() {
  const [topics, setTopics] = useState(MOCK_TOPICS);
  const [search, setSearch] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);

  const toggleFavorite = (id: string) => {
    setTopics((prev) =>
      prev.map((t) => (t.id === id ? { ...t, favorite: !t.favorite } : t))
    );
  };

  const filteredTopics = useMemo(() => {
    return topics.filter((t) => {
      const matchSearch = t.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchFavorite = showFavorites ? t.favorite : true;

      return matchSearch && matchFavorite;
    });
  }, [topics, search, showFavorites]);

  const renderTopic = ({ item }: any) => {
    const progress = Math.floor(
      (item.levelsCompleted / item.totalLevels) * 100
    );

    return (
      <View style={styles.card}>
        <View style={styles.row}>
          {/* IMÁGENES */}
          <View style={styles.imageStack}>
            <Image
              source={{
                uri: `https://picsum.photos/seed/${item.id}a/100/100`,
              }}
              style={[styles.image, styles.imageBack]}
            />

            <Image
              source={{
                uri: `https://picsum.photos/seed/${item.id}b/100/100`,
              }}
              style={[styles.image, styles.imageFront]}
            />
          </View>

          {/* INFO */}
          <View style={styles.info}>
            <Text style={styles.name}>{item.name}</Text>

            <View style={styles.levelRow}>
              <Text style={styles.levels}>
                {item.levelsCompleted}/{item.totalLevels} niveles
              </Text>

              <TouchableOpacity
                onPress={() => toggleFavorite(item.id)}
              >
                <Ionicons
                  name={item.favorite ? "heart" : "heart-outline"}
                  size={18}
                  color={item.favorite ? "#EF4444" : "#94A3B8"}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* DERECHA */}
          <View style={styles.right}>
            <Text style={styles.percent}>{progress}%</Text>

            <TouchableOpacity style={styles.playButton}>
              <MaterialCommunityIcons name="play" size={14} color="white" />
              <Text style={styles.playText}>Jugar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* BARRA PROGRESO */}
        <View style={styles.progressContainer}>
          <View
            style={[styles.progressFill, { width: `${progress}%` }]}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {/* BUSCADOR */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#94A3B8" />

        <TextInput
          placeholder="Buscar temática"
          placeholderTextColor="#64748B"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />

        <TouchableOpacity
          onPress={() => setShowFavorites(!showFavorites)}
        >
          <Ionicons
            name={showFavorites ? "heart" : "heart-outline"}
            size={22}
            color="#EF4444"
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredTopics}
        keyExtractor={(item) => item.id}
        renderItem={renderTopic}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0B1220",
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
    height: 46,
    borderWidth: 1,
    borderColor: "#1E293B",
  },

  searchInput: {
    flex: 1,
    color: "white",
    marginLeft: 10,
    fontSize: 14,
  },

  card: {
    backgroundColor: "#0B1220",
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1E293B",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  imageStack: {
    width: 60,
    height: 50,
    marginRight: 12,
  },

  image: {
    width: 44,
    height: 44,
    borderRadius: 10,
    position: "absolute",
  },

  imageBack: {
    transform: [{ rotate: "-10deg" }],
    left: 0,
    top: 4,
  },

  imageFront: {
    transform: [{ rotate: "10deg" }],
    left: 18,
    borderWidth: 2,
    borderColor: "#0B1220",
  },

  info: {
    flex: 1,
  },

  name: {
    color: "white",
    fontWeight: "700",
    fontSize: 15,
  },

  levelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
    marginRight: 2
  },

  levels: {
    color: "#94A3B8",
    fontSize: 12,
  },

  right: {
    alignItems: "center",
    width: 70,
  },

  percent: {
    color: "#38BDF8",
    fontWeight: "700",
    fontSize: 14,
    marginBottom: 6,
  },

  playButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563EB",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  playText: {
    color: "white",
    fontSize: 11,
    fontWeight: "700",
    marginLeft: 4,
  },

  progressContainer: {
    height: 6,
    backgroundColor: "#020617",
    borderRadius: 6,
    marginTop: 10,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#22C55E",
  },
});