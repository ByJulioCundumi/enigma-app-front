import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import Profile from "./Profile";

type League = "Bronce" | "Plata" | "Oro" | "Diamante";

interface Player {
  id: string;
  vip: boolean;
  avatar: string;
  xpWeek: number;
  streak: number;
  league: League;
  favorite?: boolean;
}

interface Props {
  rank?: number;
}

const MOCK_PLAYERS: Player[] = [
  { id: "Player_8842", vip: true, avatar: "", xpWeek: 2400, streak: 12, league: "Diamante" },
  { id: "Player_4412", vip: false, avatar: "", xpWeek: 900, streak: 5, league: "Plata" },
  { id: "Player_2211", vip: true, avatar: "", xpWeek: 3200, streak: 25, league: "Diamante" },
  { id: "Player_9912", vip: false, avatar: "", xpWeek: 400, streak: 2, league: "Bronce" },
];

type SortType = "xp" | "streak";
type LeagueFilter = "all" | League;

export default function Ranking({ rank = 128 }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [players, setPlayers] = useState<Player[]>(MOCK_PLAYERS);
  const [sort, setSort] = useState<SortType>("xp");
  const [leagueFilter, setLeagueFilter] = useState<LeagueFilter>("all");

  const toggleFavorite = (id: string) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, favorite: !p.favorite } : p))
    );
  };

  const getLeagueIcon = (league: League) => {
    switch (league) {
      case "Bronce":
        return { name: "medal-outline", color: "#CD7F32" };
      case "Plata":
        return { name: "medal", color: "#C0C0C0" };
      case "Oro":
        return { name: "trophy", color: "#FFD700" };
      case "Diamante":
        return { name: "diamond-stone", color: "#38BDF8" };
    }
  };

  const filteredPlayers = useMemo(() => {
    let list = players.filter((p) => {
      const matchSearch = p.id.toLowerCase().includes(search.toLowerCase());
      const matchFav = showFavorites ? p.favorite : true;
      const matchLeague =
        leagueFilter === "all" ? true : p.league === leagueFilter;

      return matchSearch && matchFav && matchLeague;
    });

    if (sort === "xp") list = list.sort((a, b) => b.xpWeek - a.xpWeek);
    if (sort === "streak") list = list.sort((a, b) => b.streak - a.streak);

    return list;
  }, [players, search, showFavorites, sort, leagueFilter]);

  const renderPlayer = ({ item, index }: { item: Player; index: number }) => {
    const position = index + 1;
    const leagueIcon = getLeagueIcon(item.league);

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
            <Text style={styles.stat}>🔥 {item.streak}</Text>
            <Text style={styles.stat}>⚡ {item.xpWeek}</Text>
          </View>
        </View>

        <View style={styles.leagueIcon}>
          <MaterialCommunityIcons
            name={leagueIcon.name as any}
            size={20}
            color={leagueIcon.color}
          />
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

        <View style={styles.rankContainer}>
          <Text style={styles.rankNumber}>#{position}</Text>
        </View>
      </View>
    );
  };

  const FilterButton = ({
    label,
    icon,
    active,
    onPress,
  }: {
    label: string;
    icon: string;
    active: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      style={[styles.filterBtn, active && styles.activeFilter]}
      onPress={onPress}
    >
      <MaterialCommunityIcons
        name={icon as any}
        size={16}
        color="white"
        style={{ marginRight: 6 }}
      />
      <Text style={styles.filterText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.wrapper}
        onPress={() => setOpen(true)}
      >
        <LinearGradient
          colors={["#2563EB", "#6366F1", "#8B5CF6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.outerRing}
        >
          <View style={styles.innerContainer}>
            <MaterialCommunityIcons name="earth" size={26} color="#93C5FD" />
            <Text style={styles.rankText}>Nro. {rank}</Text>
          </View>
        </LinearGradient>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>Jugadores</Text>
        </View>
      </TouchableOpacity>

      <Modal visible={open} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Ranking Global</Text>

            <TouchableOpacity onPress={() => setOpen(false)}>
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>
          </View>

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

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filters}
          >
            <FilterButton
              label="Nivel"
              icon="star"
              active={sort === "xp" && leagueFilter === "all"}
              onPress={() => {
                setSort("xp");
                setLeagueFilter("all");
              }}
            />

            <FilterButton
              label="Bronce"
              icon="medal-outline"
              active={leagueFilter === "Bronce"}
              onPress={() => setLeagueFilter("Bronce")}
            />

            <FilterButton
              label="Plata"
              icon="medal"
              active={leagueFilter === "Plata"}
              onPress={() => setLeagueFilter("Plata")}
            />

            <FilterButton
              label="Oro"
              icon="trophy"
              active={leagueFilter === "Oro"}
              onPress={() => setLeagueFilter("Oro")}
            />

            <FilterButton
              label="Diamante"
              icon="diamond-stone"
              active={leagueFilter === "Diamante"}
              onPress={() => setLeagueFilter("Diamante")}
            />
          </ScrollView>

          <FlatList
            data={filteredPlayers}
            keyExtractor={(item) => item.id}
            renderItem={renderPlayer}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 39,
    left: 18,
    alignItems: "center",
  },

  outerRing: {
    width: 130,
    height: 57,
    borderRadius: 15,
    padding: 3,
    justifyContent: "center",
    alignItems: "center",
    elevation: 12,
  },

  innerContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
    backgroundColor: "#0f172a",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },

  rankText: {
    color: "#60A5FA",
    fontWeight: "800",
    fontSize: 12,
  },

  badge: {
    position: "absolute",
    bottom: -8,
    backgroundColor: "#2563EB",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  badgeText: {
    fontSize: 9,
    fontWeight: "900",
    color: "#ffffff",
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "#020617",
    paddingTop: 60,
    paddingHorizontal: 18,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "800",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f172a",
    borderRadius: 12,
    paddingHorizontal: 10,
    marginBottom: 10,
    height: 44,
  },

  searchInput: {
    flex: 1,
    color: "white",
    marginLeft: 8,
  },

  filters: {
    marginBottom: 16,
  },

  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f172a",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },

  activeFilter: {
    backgroundColor: "#2563EB",
  },

  filterText: {
    color: "white",
    fontWeight: "600",
  },

  playerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f172a",
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
  },

  avatarContainer: {
    width: 56,
    height: 56,
    marginRight: 12,
  },

  playerInfo: {
    flex: 1,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  playerId: {
    color: "white",
    fontWeight: "700",
  },

  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
    alignItems: "center",
  },

  stat: {
    color: "#38BDF8",
    fontSize: 12,
  },

  leagueIcon: {
    marginRight: 6,
  },

  favoriteButton: {
    padding: 8,
    marginRight: 6,
  },

  rankContainer: {
    width: 42,
    alignItems: "flex-end",
  },

  rankNumber: {
    color: "#FACC15",
    fontWeight: "900",
    fontSize: 14,
  },
});