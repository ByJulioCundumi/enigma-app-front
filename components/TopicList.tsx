import React, { useState, useMemo, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  Animated,
} from "react-native";

import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome6,
} from "@expo/vector-icons";

import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";

import { IRootState } from "@/store/rootState";
import { selectTopic } from "@/store/reducers/topicsSlice";
import { consumeEnergy } from "@/store/reducers/energySlice";
import { checkVip } from "@/utils/checkVip";
import { getTopics } from "@/assets/data/topics/topics";
import { playSound } from "@/hooks/playSound";
import { toggleFavoriteTopic } from "@/store/reducers/favoritesSlice";

interface TopicItem {
  id: string;
  name: string;
  levelsCompleted: number;
  totalLevels: number;
  favorite?: boolean;
  vip?: boolean;
}

const PLAY_COST = 2;

export default function TopicList() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { vipExpireAt } = useSelector((state: IRootState) => state.vip);
  const isVip = checkVip(vipExpireAt);

  const progress = useSelector((state: IRootState) => state.topics.progress);
  const energy = useSelector((state: IRootState) => state.energy.energy);

  const [search, setSearch] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);

  const favorites = useSelector(
    (state: IRootState) => state.favorites.topics
  );

  const { language } = useSelector(
    (state: IRootState) => state.language
  );

  const isEs = language === "es";

  const warningOpacity = useRef(new Animated.Value(0)).current;

  const topics = getTopics(language);

  const showVipWarning = () => {
    Animated.sequence([
      Animated.timing(warningOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.delay(1500),
      Animated.timing(warningOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const toggleFavorite = (id: string) => {
    dispatch(toggleFavoriteTopic(id));
  };

  const topicsData: TopicItem[] = useMemo(() => {
    return Object.values(topics)
      .filter((topic) => topic.id !== "random")
      .map((topic) => {
        const topicProgress = progress[topic.id];

        return {
          id: topic.id,
          name: topic.name,
          levelsCompleted: topicProgress?.currentLevel ?? 0,
          totalLevels: topic.levels.length,
          vip: true,
          favorite: favorites[topic.id] ?? false,
        };
      });
  }, [progress, favorites]);

  const playTopic = (topicId: string) => {
    if (!isVip) {
      playSound(require("@/assets/sounds/soundError2.mp3"));
      showVipWarning();
      return;
    }

    dispatch(consumeEnergy(PLAY_COST));
    dispatch(selectTopic(topicId as any));

    playSound(require("@/assets/sounds/soundWind.mp3"));
    router.push("/GameRoom");
  };

  const filteredTopics = useMemo(() => {
    return topicsData.filter((t) => {
      const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());
      const matchFavorite = showFavorites ? t.favorite : true;
      return matchSearch && matchFavorite;
    });
  }, [topicsData, search, showFavorites]);

  const renderTopic = ({ item }: { item: TopicItem }) => {
    const progressPercent = Math.floor(
      (item.levelsCompleted / item.totalLevels) * 100
    );

    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
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
            <Text style={styles.topicName}>{item.name}</Text>

            <View style={styles.progressRow}>
              <Text style={styles.levelText}>
                {item.levelsCompleted}/{item.totalLevels}
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

          <View style={styles.rightSection}>
            <Text style={styles.percentText}>{progressPercent}%</Text>

            <TouchableOpacity
              style={styles.playButton}
              onPress={() => playTopic(item.id)}
            >
              <Text style={styles.playText}>
                {isEs ? "Jugar" : "Play"}
              </Text>

              <View style={styles.energyCost}>
                <FontAwesome6 name="bolt-lightning" size={8} color="#fff" />
                <Text style={styles.energyCostText}>-{PLAY_COST}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${progressPercent}%` },
            ]}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* BUSCADOR */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#94A3B8" />

        <TextInput
          placeholder={isEs ? "Buscar temática" : "Search by topic"}
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

      {/* LISTA */}
      <FlatList
        data={filteredTopics}
        keyExtractor={(item) => item.id}
        renderItem={renderTopic}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

      {/* WARNING VIP */}
      <Animated.View
        pointerEvents="none"
        style={[styles.energyWarning, { opacity: warningOpacity }]}
      >
        <FontAwesome6 name="bolt-lightning" size={14} color="#fff" />
        <Text style={styles.energyWarningText}>
          {isEs
            ? "Disponible solo para jugadores VIP"
            : "Available only to VIP players"}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#1B2435",
  },

  energyWarning: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ef4444",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },

  energyWarningText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 12,
  },

  energyCost: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e4a700",
    paddingHorizontal: 4,
    borderRadius: 6,
    gap: 2,
  },

  energyCostText: {
    color: "#fff",
    fontSize: 8,
    fontWeight: "900",
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
    paddingBottom: 80,
  },

  card: {
    backgroundColor: "#243047",
    borderRadius: 16,
    padding: 10,
    marginBottom: 10,
    paddingHorizontal: 13,
  },

  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  imageWrapper: {
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

  topicName: {
    color: "#F8FAFC",
    fontWeight: "800",
    fontSize: 15,
  },

  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    marginRight: 27,
  },

  levelText: {
    color: "#94A3B8",
    fontSize: 11,
  },

  rightSection: {
    alignItems: "center",
    width: 50,
    gap: 5,
  },

  playButton: {
    backgroundColor: "#ffbb00",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    flexDirection: "row",
    marginRight: 20,
    width: 72,
    gap: 4,
    justifyContent: "center",
  },

  playText: {
    color: "white",
    fontSize: 11,
    fontWeight: "800",
  },

  percentText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 11,
  },

  progressBar: {
    height: 5,
    backgroundColor: "#313c50",
    borderRadius: 6,
    marginTop: 8,
    overflow: "hidden",
    width: "100%",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#FFC400",
  },
});