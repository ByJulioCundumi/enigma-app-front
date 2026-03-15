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
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons, MaterialCommunityIcons, Octicons } from "@expo/vector-icons";

interface Topic {
  id: string;
  name: string;
  levelsCompleted: number;
  totalLevels: number;
  favorite?: boolean;
  popular?: boolean;
  vip?: boolean;
}

const MOCK_TOPICS: Topic[] = [
  { id: "1", name: "Personajes", levelsCompleted: 20, totalLevels: 100, popular: true, vip: true },
  { id: "2", name: "Películas", levelsCompleted: 12, totalLevels: 80, vip: true },
  { id: "3", name: "Anime", levelsCompleted: 35, totalLevels: 120, popular: true, vip: true },
  { id: "4", name: "Videojuegos", levelsCompleted: 8, totalLevels: 60, vip: true },
  { id: "5", name: "Animales", levelsCompleted: 40, totalLevels: 90, vip: true },
];

export default function TopicList() {

  const [topics, setTopics] = useState(MOCK_TOPICS);
  const [search, setSearch] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [visible, setVisible] = useState(false);

  const toggleFavorite = (id: string) => {
    setTopics((prev) =>
      prev.map((t) => (t.id === id ? { ...t, favorite: !t.favorite } : t))
    );
  };

  const playTopic = (topic: Topic) => {
    console.log("Jugar temática:", topic.name);
  };

  const filteredTopics = useMemo(() => {
    return topics.filter((t) => {
      const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());
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

        <View style={styles.imageWrapper}>

          <Image
            source={{ uri: `https://picsum.photos/seed/${item.id}/100/100` }}
            style={styles.topicImage}
          />

          {item.vip && (
            <View style={styles.vipBadge}>
              <MaterialCommunityIcons
                name="crown"
                size={12}
                color="#FFD700"
              />
            </View>
          )}

        </View>

        <View style={styles.topicInfo}>

          <View style={styles.topicHeader}>
            <Text style={styles.topicName}>{item.name}</Text>
          </View>

          <View style={styles.progressRow}>

            <Text style={styles.levelText}>
              {item.levelsCompleted}/{item.totalLevels}
            </Text>

            <TouchableOpacity
              style={styles.playButton}
              onPress={() => playTopic(item)}
            >
              <Ionicons name="play" size={9} color="white" />
              <Text style={styles.playText}>Jugar</Text>
            </TouchableOpacity>

          </View>

          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress}%` }
              ]}
            />
          </View>

        </View>

        <View style={styles.rightSection}>

          <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
            <Ionicons
              name={item.favorite ? "heart" : "heart-outline"}
              size={18}
              color={item.favorite ? "#EF4444" : "#94A3B8"}
            />
          </TouchableOpacity>

          <View style={styles.percentBox}>
            <Text style={styles.percentText}>
              {progress}%
            </Text>
          </View>

        </View>

      </View>

    );
  };

  return (

    <View>

      <View style={styles.openButtonWrapper}>

        <TouchableOpacity
          style={styles.openButton}
          onPress={() => setVisible(true)}
        >
          <Octicons name="multi-select" size={12} color="#fff" />
          <Text style={styles.openButtonText}>Mas Temática</Text>
        </TouchableOpacity>

      </View>

      <Modal visible={visible} transparent animationType="fade">

        <View style={styles.overlay}>

          <TouchableWithoutFeedback onPress={() => setVisible(false)}>
            <View style={StyleSheet.absoluteFillObject} />
          </TouchableWithoutFeedback>

          <View style={styles.modalContainer}>

            <View style={styles.header}>

              <View style={styles.headerLeft}>
                <MaterialCommunityIcons name="crown-outline" size={18} color="#FACC15" />
                <Text style={styles.title}>Temáticas Exclusivas</Text>
              </View>

              <TouchableOpacity onPress={() => setVisible(false)}>
                <Ionicons name="close" size={22} color="#E2E8F0" />
              </TouchableOpacity>

            </View>

            <TouchableOpacity style={styles.vipButton}>

              <MaterialCommunityIcons name="crown-outline" size={18} color="#fff" />

              <Text style={styles.vipButtonText}>
                Hazte VIP: $1.99
              </Text>

              <MaterialCommunityIcons
                name="chevron-right"
                size={18}
                color="white"
              />

            </TouchableOpacity>

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
              >
                <Ionicons
                  name={showFavorites ? "heart" : "heart-outline"}
                  size={20}
                  color="#EF4444"
                />
              </TouchableOpacity>

            </View>

            <FlatList
              data={filteredTopics}
              keyExtractor={(item) => item.id}
              renderItem={renderTopic}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />

          </View>

        </View>

      </Modal>

    </View>

  );
}

const styles = StyleSheet.create({

  openButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2262c2ce",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(215, 232, 255, 0.03)",
    marginTop: 15
  },

  openButtonText: {
    color: "white",
    fontWeight: "800",
    fontSize: 14,
  },

  openButtonWrapper: {
    alignSelf: "center",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(29, 29, 31, 0.65)",
    justifyContent: "center",
    padding: 18,
  },

  modalContainer: {
    backgroundColor: "#1B2435",
    borderRadius: 26,
    padding: 18,
    maxHeight: "75%",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  title: {
    color: "#F1F5F9",
    fontWeight: "900",
    fontSize: 18,
  },

  vipButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffbb00",
    borderRadius: 14,
    paddingVertical: 10,
    marginBottom: 14,
    gap: 6,
  },

  vipButtonText: {
    color: "white",
    fontWeight: "900",
    fontSize: 14,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A364D",
    borderRadius: 14,
    paddingHorizontal: 12,
    marginBottom: 12,
    height: 44,
  },

  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: "#E2E8F0",
  },

  listContent: {
    paddingBottom: 20,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#243047",
    borderRadius: 16,
    padding: 10,
    marginBottom: 10,
  },

  imageWrapper: {
    position: "relative",
    marginRight: 10,
  },

  topicImage: {
    width: 50,
    height: 50,
    borderRadius: 12,
  },

  vipBadge: {
    position: "absolute",
    bottom: -4,
    left: -4,
    backgroundColor: "#243047",
    borderRadius: 10,
    padding: 3,
  },

  topicInfo: {
    flex: 1,
  },

  topicHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  topicName: {
    color: "#F8FAFC",
    fontWeight: "800",
    fontSize: 15,
  },

  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },

  levelText: {
    color: "#94A3B8",
    fontSize: 11,
    fontWeight: "600",
  },

  percentBox: {
    backgroundColor: "#1E3A8A",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },

  percentText: {
    color: "#93C5FD",
    fontWeight: "800",
    fontSize: 11,
  },

  progressBar: {
    height: 5,
    backgroundColor: "#0F172A",
    borderRadius: 6,
    marginTop: 6,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#FFC400",
  },

  playButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563EB",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 4,
    position: "absolute",
    right: 0,
    bottom: 0
  },

  playText: {
    color: "white",
    fontSize: 11,
    fontWeight: "800",
  },

  rightSection: {
    alignItems: "center",
    width: 50,
    justifyContent: "space-between",
    height: 45,
  },

});