import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Topic {
  id: string;
  name: string;
  totalLevels: number;
  completedLevels: number;
  color: string;
  images: string[];
}

const { width } = Dimensions.get("window");
const CONTAINER_WIDTH = width * 0.92;

export default function TopicSelector() {
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const topics: Topic[] = [
    {
      id: "1",
      name: "Países",
      totalLevels: 100,
      completedLevels: 35,
      color: "#ebd141",
      images: [
        "https://picsum.photos/seed/countries1/100/140",
        "https://picsum.photos/seed/countries2/100/140",
      ],
    },
    {
      id: "2",
      name: "Personajes",
      totalLevels: 120,
      completedLevels: 60,
      color: "#a855f7",
      images: [
        "https://picsum.photos/seed/characters1/100/140",
        "https://picsum.photos/seed/characters2/100/140",
      ],
    },
    {
      id: "3",
      name: "Películas",
      totalLevels: 80,
      completedLevels: 20,
      color: "#ef4444",
      images: [
        "https://picsum.photos/seed/movies1/100/140",
        "https://picsum.photos/seed/movies2/100/140",
      ],
    },
    {
      id: "4",
      name: "Series",
      totalLevels: 120,
      completedLevels: 20,
      color: "#e4ef44",
      images: [
        "https://picsum.photos/seed/series1/100/140",
        "https://picsum.photos/seed/series2/100/140",
      ],
    },
  ];

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id)
        ? prev.filter((fav) => fav !== id)
        : [...prev, id]
    );
  };

  const filteredTopics = useMemo(() => {
    return topics.filter((topic) => {
      const matchesSearch = topic.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesFavorite = showOnlyFavorites
        ? favorites.includes(topic.id)
        : true;
      return matchesSearch && matchesFavorite;
    });
  }, [search, favorites, showOnlyFavorites]);

  const renderItem = ({ item }: { item: Topic }) => {
    const progress = item.completedLevels / item.totalLevels;
    const percentage = Math.round(progress * 100);
    const isFavorite = favorites.includes(item.id);

    return (
      <View style={styles.card}>
        <View
          style={[
            styles.iconWrapper,
            { backgroundColor: item.color + "22" },
          ]}
        >
          {item.images.map((img, index) => (
            <Image
              key={index}
              source={{ uri: img }}
              style={[
                styles.topicImage,
                index === 0
                  ? {
                      top: 7,
                      left: 16,
                      zIndex: 2,
                      transform: [{ rotate: "-6deg" }],
                    }
                  : {
                      top: 3,
                      left: 8,
                      zIndex: 1,
                      transform: [{ rotate: "6deg" }],
                    },
              ]}
              resizeMode="cover"
            />
          ))}
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{item.name}</Text>

            <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={20}
                color={isFavorite ? "#ffd753" : "#FFFFFF"}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.progressRow}>
            <Text style={styles.levelText}>
              {item.completedLevels}/{item.totalLevels}
            </Text>

            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${percentage}%` },
                ]}
              />
            </View>
          </View>
        </View>

        <View style={styles.rightContainer}>
          <View style={styles.levelBadge}>
            <Ionicons name="star" size={14} color="#ffd753" />
            <Text style={styles.percentageText}>{percentage}%</Text>
          </View>

          <TouchableOpacity style={styles.playButton}>
            <Ionicons name="play" size={16} color="#3f3f3e" />
            <Text style={styles.playText}>Jugar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <>
      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="grid" size={18} color="#755dff" />
        <Text style={styles.fabText}>Temas</Text>
      </TouchableOpacity>

      {/* MODAL */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        {/* Cerrar al tocar fuera */}
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.overlay}>
            {/* Evita cierre al tocar dentro */}
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                {/* Header con botón cerrar */}
                <View style={styles.header}>
                  <Text style={styles.modalTitle}>
                    5 Tematicas 
                  </Text>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                  >
                    <Ionicons
                      name="close"
                      size={24}
                      color="#334155"
                    />
                  </TouchableOpacity>
                </View>

                {/* Buscador */}
                <View style={styles.searchContainer}>
                  <Ionicons
                    name="search"
                    size={18}
                    color="#64748B"
                  />
                  <TextInput
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Buscar temática..."
                    placeholderTextColor="#64748b81"
                    style={styles.searchInput}
                  />
                  <TouchableOpacity
                    onPress={() =>
                      setShowOnlyFavorites(!showOnlyFavorites)
                    }
                    style={[
                      styles.filterButton,
                      showOnlyFavorites &&
                        styles.filterButtonActive,
                    ]}
                  >
                    <Ionicons
                      name={
                        showOnlyFavorites
                          ? "heart"
                          : "heart-outline"
                      }
                      size={18}
                      color={
                        showOnlyFavorites
                          ? "#FFFFFF"
                          : "#1E3A8A"
                      }
                    />
                  </TouchableOpacity>
                </View>

                <FlatList
                  data={filteredTopics}
                  keyExtractor={(item) => item.id}
                  renderItem={renderItem}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingBottom: 40,
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 45,
    backgroundColor: "#1e293b",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    borderWidth: 2,
    borderColor: "#ffffff3d"
  },

  fabText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
    marginTop: 0,
    textAlign: "center",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    paddingHorizontal: 12,
  },

  modalContainer: {
    height: "80%",
    backgroundColor: "#f8fafc",
    borderRadius: 20,
    paddingTop: 16,
    paddingHorizontal: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1e293b",
    padding: 5
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 3,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#cbd5e1a1",
    width: "100%",
    alignSelf: "center",
  },

  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
    height: 40,
  },

  filterButton: {
    marginLeft: 10,
    padding: 8,
    borderRadius: 12,
    backgroundColor: "#E2E8F0",
  },

  filterButtonActive: {
    backgroundColor: "#ffce2f",
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6d76f3d3",
    borderRadius: 20,
    padding: 14,
    marginBottom: 14,
  },

  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 18,
    marginRight: 14,
    position: "relative",
  },

  topicImage: {
    position: "absolute",
    width: 34,
    height: 46,
    borderRadius: 8,
  },

  infoContainer: { flex: 1 },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },

  progressRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  levelText: {
    color: "#ffda61",
    fontSize: 12,
    fontWeight: "700",
    marginRight: 8,
  },

  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: "#ffffff55",
    borderRadius: 10,
    overflow: "hidden",
  },

  progressBarFill: {
    height: "100%",
    backgroundColor: "#ffd753",
  },

  rightContainer: {
    alignItems: "center",
    marginLeft: 10,
  },

  levelBadge: {
    flexDirection: "row",
    alignItems: "center",
  },

  percentageText: {
    color: "#3f3f3e",
    fontWeight: "900",
    fontSize: 12,
  },

  playButton: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  playText: {
    color: "#3f3f3e",
    fontWeight: "800",
    marginLeft: 4,
    fontSize: 12,
  },
});