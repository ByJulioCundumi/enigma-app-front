import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import Profile from "./Profile";

interface Player {
  id: string;
  vip: boolean;
  avatar: string;
  xpWeek: number;
  streakWins: number;
  currentStreak: number;
  favorite?: boolean;
}

const MOCK_PLAYERS: Player[] = [
  { id: "Player_8842", vip: true, avatar: "", xpWeek: 2400, streakWins: 6, currentStreak: 2 },
  { id: "Player_4412", vip: false, avatar: "", xpWeek: 900, streakWins: 1, currentStreak: 0 },
  { id: "Player_2211", vip: true, avatar: "", xpWeek: 3200, streakWins: 10, currentStreak: 4 },
  { id: "Player_9912", vip: false, avatar: "", xpWeek: 400, streakWins: 0, currentStreak: 1 },
  { id: "Player_442", vip: false, avatar: "", xpWeek: 900, streakWins: 1, currentStreak: 0 },
  { id: "Player_221", vip: true, avatar: "", xpWeek: 3200, streakWins: 10, currentStreak: 4 },
  { id: "Player_992", vip: false, avatar: "", xpWeek: 400, streakWins: 0, currentStreak: 1 },
];

type SortType = "level" | "streakWins" | "currentStreak";

export default function Ranking() {
  const [search, setSearch] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [players, setPlayers] = useState<Player[]>(MOCK_PLAYERS);
  const [sort, setSort] = useState<SortType>("level");

  const toggleFavorite = (id: string) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, favorite: !p.favorite } : p))
    );
  };

  const filteredPlayers = useMemo(() => {
    let list = players.filter((p) => {
      const matchSearch = p.id.toLowerCase().includes(search.toLowerCase());
      const matchFav = showFavorites ? p.favorite : true;
      return matchSearch && matchFav;
    });

    if (sort === "level") list = [...list].sort((a, b) => b.xpWeek - a.xpWeek);
    if (sort === "streakWins") list = [...list].sort((a, b) => b.streakWins - a.streakWins);
    if (sort === "currentStreak") list = [...list].sort((a, b) => b.currentStreak - a.currentStreak);

    return list;
  }, [players, search, showFavorites, sort]);

  const renderPlayer = ({ item, index }: any) => {
    const position = index + 1;

    return (
      <View style={styles.playerCard}>
        <View style={styles.avatarContainer}>
          <Profile />
        </View>

        <View style={styles.playerInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.playerId}>{item.id}</Text>
            {item.vip && (
              <MaterialCommunityIcons name="crown" size={16} color="#FACC15" />
            )}
          </View>

          <View style={styles.statsRow}>
            <Text style={styles.stat}>🏆 {item.streakWins}</Text>
            <Text style={styles.stat}>⚡ {item.xpWeek} XP</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => toggleFavorite(item.id)}
          style={styles.favoriteButton}
        >
          <Ionicons
            name={item.favorite ? "heart" : "heart-outline"}
            size={22}
            color={item.favorite ? "#EF4444" : "#94A3B8"}
          />
        </TouchableOpacity>

        <Text style={styles.rankNumber}>#{position}</Text>
      </View>
    );
  };

  const FilterButton = ({ label, icon, active, onPress }: any) => (
    <TouchableOpacity
      style={[styles.filterBtn, active && styles.activeFilter]}
      onPress={onPress}
    >
      <MaterialCommunityIcons name={icon} size={16} color="white" />
      <Text style={styles.filterText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* BUSCADOR */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#94A3B8" />

        <TextInput
          placeholder="Buscar jugador"
          placeholderTextColor="#64748B"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />

        <TouchableOpacity onPress={() => setShowFavorites(!showFavorites)}>
          <Ionicons
            name={showFavorites ? "heart" : "heart-outline"}
            size={22}
            color="#EF4444"
          />
        </TouchableOpacity>
      </View>

      {/* FILTROS */}
      <View style={styles.filtersRow}>
        <FilterButton
          label="Top"
          icon="star"
          active={sort === "level"}
          onPress={() => setSort("level")}
        />

        <FilterButton
          label="Trofeos"
          icon="trophy"
          active={sort === "streakWins"}
          onPress={() => setSort("streakWins")}
        />

        <FilterButton
          label="Reto: 7d"
          icon="fire"
          active={sort === "currentStreak"}
          onPress={() => setSort("currentStreak")}
        />
      </View>

      {/* LISTA */}
      <FlatList
        data={filteredPlayers}
        keyExtractor={(item) => item.id}
        renderItem={renderPlayer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContent}
        style={{ flex: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
  },

  listContent: {
    paddingBottom: 20,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0B1220",
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
    height: 46,
    width: "100%",
    borderWidth: 1,
    borderColor: "#1E293B",
  },

  searchInput: {
    flex: 1,
    color: "white",
    marginLeft: 10,
    fontSize: 14,
  },

  filtersRow: {
    flexDirection: "row",
    width: "100%",
    gap: 8,
    marginBottom: 14,
  },

  filterBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#0B1220",
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1E293B",
  },

  activeFilter: {
    backgroundColor: "#2563EB",
    borderColor: "#3B82F6",
  },

  filterText: {
    color: "white",
    fontWeight: "600",
    fontSize: 12,
  },

  playerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0B1220",
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#1E293B",
  },

  avatarContainer: {
    width: 48,
    height: 48,
    marginRight: 12,
  },

  playerInfo: {
    flex: 1,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },

  playerId: {
    color: "white",
    fontWeight: "700",
    fontSize: 14,
    marginRight: 6,
  },

  statsRow: {
    flexDirection: "row",
    gap: 10,
  },

  stat: {
    color: "#38BDF8",
    fontSize: 11,
    backgroundColor: "#020617",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },

  favoriteButton: {
    padding: 6,
    marginRight: 8,
  },

  rankNumber: {
    color: "#FACC15",
    fontWeight: "900",
    fontSize: 16,
    minWidth: 34,
    textAlign: "right",
  },
});