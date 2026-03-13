import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons, MaterialCommunityIcons, Octicons } from "@expo/vector-icons";

interface Topic {
  id: string;
  name: string;
  levelsCompleted: number;
  totalLevels: number;
  favorite?: boolean;
  popular?: boolean;
}

const MOCK_TOPICS: Topic[] = [
  { id: "1", name: "Personajes", levelsCompleted: 20, totalLevels: 100, popular: true },
  { id: "2", name: "Películas", levelsCompleted: 12, totalLevels: 80 },
  { id: "3", name: "Anime", levelsCompleted: 35, totalLevels: 120, popular: true },
  { id: "4", name: "Videojuegos", levelsCompleted: 8, totalLevels: 60 },
  { id: "5", name: "Animales", levelsCompleted: 40, totalLevels: 90 },
];

export default function TopicList() {
  const [topics, setTopics] = useState(MOCK_TOPICS);
  const [search, setSearch] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [showPopular, setShowPopular] = useState(false);
  const [visible, setVisible] = useState(false);

  const toggleFavorite = (id: string) => {
    setTopics((prev) =>
      prev.map((t) => (t.id === id ? { ...t, favorite: !t.favorite } : t))
    );
  };

  const filteredTopics = useMemo(() => {
    return topics.filter((t) => {
      const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());
      const matchFavorite = showFavorites ? t.favorite : true;
      const matchPopular = showPopular ? t.popular : true;

      return matchSearch && matchFavorite && matchPopular;
    });
  }, [topics, search, showFavorites, showPopular]);

  const renderTopic = ({ item }: any) => {
    const progress = Math.floor(
      (item.levelsCompleted / item.totalLevels) * 100
    );

    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.imageStack}>
            <Image
              source={{ uri: `https://picsum.photos/seed/${item.id}a/100/100` }}
              style={[styles.image, styles.imageBack]}
            />

            <Image
              source={{ uri: `https://picsum.photos/seed/${item.id}b/100/100` }}
              style={[styles.image, styles.imageFront]}
            />

            {item.popular && (
              <View style={styles.popularIcon}>
                <Ionicons name="flame" size={14} color="white" />
              </View>
            )}
          </View>

          <View style={styles.info}>
            <Text style={styles.name}>{item.name}</Text>

            <View style={styles.levelRow}>
              <Text style={styles.levels}>
                {item.levelsCompleted}/{item.totalLevels} niveles
              </Text>

              <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                <Ionicons
                  name={item.favorite ? "heart" : "heart-outline"}
                  size={18}
                  color={item.favorite ? "#EF4444" : "#94A3B8"}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.right}>
            <Text style={styles.percent}>{progress}%</Text>

            <TouchableOpacity style={styles.playButton}>
              <MaterialCommunityIcons name="play" size={14} color="white" />
              <Text style={styles.playText}>Jugar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>
    );
  };

  return (
    <View>

      {/* BOTON QUE ABRE EL POPUP */}
      <TouchableOpacity
        style={styles.openButton}
        onPress={() => setVisible(true)}
      >
        <Octicons name="multi-select" size={12} color="#fff" />
        <Text style={styles.openButtonText}>Mas Temática</Text>
      </TouchableOpacity>

      {/* POPUP */}
      <Modal visible={visible} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <Pressable style={styles.modalContainer}>

            {/* HEADER */}
            <View style={styles.header}>
              <Text style={styles.title}>Temáticas</Text>

              <TouchableOpacity onPress={() => setVisible(false)}>
                <Ionicons name="close" size={22} color="white" />
              </TouchableOpacity>
            </View>

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
                style={styles.favoriteButton}
              >
                <Ionicons
                  name={showFavorites ? "heart" : "heart-outline"}
                  size={22}
                  color="#EF4444"
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowPopular(!showPopular)}
                style={[
                  styles.popularFilter,
                  showPopular && styles.popularFilterActive,
                ]}
              >
                <Ionicons
                  name="flame"
                  size={14}
                  color={showPopular ? "white" : "#F97316"}
                />
                <Text style={{color: "#F97316", marginLeft: 3}}>Popular</Text>
              </TouchableOpacity>
            </View>

            {/* LISTA */}
            <FlatList
              data={filteredTopics}
              keyExtractor={(item) => item.id}
              renderItem={renderTopic}
              showsVerticalScrollIndicator={false}
            />

          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({

  /* BOTON ABRIR */

  openButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#255fb6",
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 16,
    alignSelf: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0)",
    marginTop: 15
  },

  openButtonText: {
    color: "white",
    fontWeight: "800",
    fontSize: 14,
    letterSpacing: 0.5,
  },

  /* OVERLAY */

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    padding: 14,
  },

  /* MODAL */

  modalContainer: {
    backgroundColor: "#0B1220",
    borderRadius: 26,
    padding: 18,
    height: "75%",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  /* HEADER */

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },

  title: {
    color: "white",
    fontWeight: "900",
    fontSize: 20,
    letterSpacing: 0.6,
  },

  /* BUSCADOR */

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#071A41",
    borderRadius: 16,
    paddingHorizontal: 14,
    marginBottom: 16,
    height: 48,
    borderWidth: 1,
    borderColor: "#1E293B",
  },

  searchInput: {
    flex: 1,
    color: "white",
    marginLeft: 10,
    fontSize: 14,
  },

  favoriteButton: {
    marginLeft: 10,
  },

  popularFilter: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F97316",
  },

  popularFilterActive: {
    backgroundColor: "#F97316",
  },

  /* CARD */

  card: {
    backgroundColor: "#070D24",
    borderRadius: 20,
    padding: 16,
    paddingVertical: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#1E293B",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  /* IMAGENES */

  imageStack: {
    width: 60,
    height: 50,
    marginRight: 14,
  },

  image: {
    width: 46,
    height: 46,
    borderRadius: 12,
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

  /* ICONO POPULAR */

  popularIcon: {
    position: "absolute",
    bottom: -5,
    left: -5,
    backgroundColor: "#F97316",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#070D24",
  },

  /* INFO */

  info: {
    flex: 1,
  },

  name: {
    color: "white",
    fontWeight: "800",
    fontSize: 16,
  },

  levelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 0,
    paddingRight: 5
  },

  levels: {
    color: "#94A3B8",
    fontSize: 12,
  },

  /* DERECHA */

  right: {
    alignItems: "center",
    width: 70,
  },

  percent: {
    color: "#38BDF8",
    fontWeight: "900",
    fontSize: 15,
    marginBottom: 6,
  },

  /* BOTON JUGAR */

  playButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563EB",
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 10,
    gap: 4,
  },

  playText: {
    color: "white",
    fontSize: 11,
    fontWeight: "800",
  },

  /* PROGRESO */

  progressContainer: {
    height: 4,
    backgroundColor: "#090e25",
    borderRadius: 6,
    marginTop: 12,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#3B82F6",
  },
});

