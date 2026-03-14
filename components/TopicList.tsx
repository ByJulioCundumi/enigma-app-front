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
                <Ionicons name="flame" size={13} color="white" />
              </View>
            )}
          </View>

          <View style={styles.info}>

            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>

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

      {/* BOTON ORIGINAL */}
      <View style={styles.openButtonWrapper}>

        <TouchableOpacity
          style={styles.openButton}
          onPress={() => setVisible(true)}
        >
          <View style={styles.vipBadge}>
          <MaterialCommunityIcons name="crown" size={10} color="#fff" />
        </View>
          <Text style={styles.openButtonText}>Mas Temática</Text>
        </TouchableOpacity>

      </View>

      {/* POPUP */}
      <Modal visible={visible} transparent animationType="fade">

        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>

          <Pressable style={styles.modalContainer}>

            {/* HEADER */}
            <View style={styles.header}>

              <Text style={styles.title}>
                Temáticas ({filteredTopics.length})
              </Text>

              <TouchableOpacity onPress={() => setVisible(false)}>
                <Ionicons name="close" size={22} color="#F1F5F9" />
              </TouchableOpacity>

            </View>

            {/* BUSCADOR */}

            <View style={styles.searchContainer}>

              <Ionicons name="search" size={18} color="#94A3B8" />

              <TextInput
                placeholder="Buscar temática"
                placeholderTextColor="#94A3B8"
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
                  size={20}
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
              </TouchableOpacity>

            </View>

            {/* LISTA */}

            <FlatList
              data={filteredTopics}
              keyExtractor={(item) => item.id}
              renderItem={renderTopic}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />

          </Pressable>

        </Pressable>

      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({

  /* BOTON ORIGINAL (SIN CAMBIOS) */

  openButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#255fb6",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 16,
    alignSelf: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    marginTop: 15
  },

  openButtonText: {
    color: "white",
    fontWeight: "800",
    fontSize: 14,
    letterSpacing: 0.5,
  },

  openButtonWrapper: {
    alignSelf: "center",
    position: "relative",
  },

  vipBadge: {
    backgroundColor: "#f59e0b",
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ffffff",
  },

  /* OVERLAY */

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    padding: 16,
  },

  /* MODAL */

  modalContainer: {
    backgroundColor: "#1E293B",
    borderRadius: 24,
    padding: 18,
    maxHeight: "70%",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },

  /* HEADER */

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },

  title: {
    color: "#F1F5F9",
    fontWeight: "900",
    fontSize: 20,
  },

  /* BUSCADOR */

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2F3E57",
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 16,
    height: 46,
  },

  searchInput: {
    flex: 1,
    color: "#F1F5F9",
    marginLeft: 10,
    fontSize: 14,
  },

  favoriteButton: {
    marginLeft: 10,
  },

  popularFilter: {
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#F97316",
  },

  popularFilterActive: {
    backgroundColor: "#F97316",
  },

  /* CARD */

  card: {
    backgroundColor: "#273449",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

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
    borderColor: "#1E293B",
  },

  popularIcon: {
    position: "absolute",
    bottom: -5,
    left: -5,
    backgroundColor: "#F97316",
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },

  info: {
    flex: 1,
  },

  name: {
    color: "#F1F5F9",
    fontWeight: "800",
    fontSize: 16,
  },

  levelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 3,
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
    fontWeight: "900",
    fontSize: 15,
    marginBottom: 6,
  },

  playButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563EB",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 4,
  },

  playText: {
    color: "white",
    fontSize: 11,
    fontWeight: "800",
  },

  progressContainer: {
    height: 5,
    backgroundColor: "#0B1220",
    borderRadius: 6,
    marginTop: 10,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#60A5FA",
  },

});