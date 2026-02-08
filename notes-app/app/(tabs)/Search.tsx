import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { Text, View } from "@/components/Themed";
import { router } from "expo-router";

type ClassOut = {
  id: string;
  name: string;
  users?: any[];
  photos?: any[];
};

const API_BASE_URL = "http://10.138.238.192:8000";
const SEARCH_ENDPOINT = `${API_BASE_URL}/api/classes/search`;

// TEMP until login is wired in
const CURRENT_USER_ID = "user_1";

function emojiForCourseName(name: string) {
  const n = name.toLowerCase();
  if (n.includes("math") || n.includes("calc")) return "📐";
  if (n.includes("bio")) return "🧬";
  if (n.includes("chem")) return "🧪";
  if (n.includes("phys")) return "⚛️";
  if (n.includes("cs") || n.includes("computer") || n.includes("data"))
    return "💻";
  if (n.includes("psych")) return "🧠";
  if (n.includes("econ")) return "📊";
  if (n.includes("art")) return "🎨";
  if (n.includes("hist")) return "📚";
  if (n.includes("lit") || n.includes("english")) return "📖";
  return "📘";
}

function isUserInClass(users: unknown, userId: string) {
  if (!Array.isArray(users)) return false;
  return users.some((u) => String(u) === userId);
}

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const q = useMemo(() => searchQuery.trim(), [searchQuery]);

  const [results, setResults] = useState<ClassOut[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Join UI state
  const [selectedClass, setSelectedClass] = useState<ClassOut | null>(null);
  const [joinOpen, setJoinOpen] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);

  const fetchSearchResults = async (query: string) => {
    const url = `${SEARCH_ENDPOINT}?name=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    const text = await res.text();
    if (!res.ok) throw new Error(`Search failed (${res.status}): ${text}`);
    const data = JSON.parse(text) as ClassOut[];
    return Array.isArray(data) ? data : [];
  };

  const joinClass = async (classId: string) => {
    const url = `${API_BASE_URL}/api/classes/${classId}/join?user_id=${encodeURIComponent(
      CURRENT_USER_ID
    )}`;
    const res = await fetch(url, { method: "POST" });
    const text = await res.text();
    if (!res.ok) throw new Error(`Join failed (${res.status}): ${text}`);
  };

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!q) {
        setResults([]);
        setLoading(false);
        setErrorMsg(null);
        return;
      }

      setLoading(true);
      setErrorMsg(null);

      try {
        // debounce
        await new Promise((r) => setTimeout(r, 250));
        if (cancelled) return;

        const data = await fetchSearchResults(q);
        if (!cancelled) setResults(data);
      } catch (e) {
        if (!cancelled) setErrorMsg(String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [q]);

  const onTapClass = (item: ClassOut) => {
    const isMember = isUserInClass(item.users, CURRENT_USER_ID);

    if (isMember) {
      router.push(`/class/${item.id}`);
      return;
    }

    setSelectedClass(item);
    setJoinOpen(true);
  };

  const onConfirmJoin = async () => {
    if (!selectedClass) return;

    setJoinLoading(true);
    try {
      await joinClass(selectedClass.id);

      // Update UI immediately so it shows Enrolled ✅
      setResults((prev) =>
        prev.map((c) =>
          c.id === selectedClass.id
            ? {
                ...c,
                users: [
                  ...(Array.isArray(c.users) ? c.users : []),
                  CURRENT_USER_ID,
                ],
              }
            : c
        )
      );

      setJoinOpen(false);

      Alert.alert("Joined ✅", "You’re now enrolled in the class.");
    } catch (e) {
      Alert.alert("Join failed", String(e));
    } finally {
      setJoinLoading(false);
      setSelectedClass(null);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Search Courses</Text>

        <TextInput
          placeholder="Search by course name..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.input}
          placeholderTextColor="#B794F4"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {q === "" ? (
          <View style={styles.center}>
            <Text style={styles.emoji}>🔍</Text>
            <Text style={styles.helperText}>
              Search for a course to get started!
            </Text>
          </View>
        ) : loading ? (
          <View style={styles.center}>
            <ActivityIndicator />
            <Text style={[styles.helperText, { marginTop: 10 }]}>
              Searching…
            </Text>
          </View>
        ) : errorMsg ? (
          <View style={styles.center}>
            <Text style={styles.emoji}>⚠️</Text>
            <Text style={styles.helperText}>Search error</Text>
            <Text style={styles.subText}>{errorMsg}</Text>
          </View>
        ) : results.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.emoji}>😕</Text>
            <Text style={styles.helperText}>No courses found</Text>
            <Text style={styles.subText}>Try a different keyword</Text>
          </View>
        ) : (
          <>
            <Text style={styles.resultCount}>
              Found {results.length} {results.length === 1 ? "course" : "courses"}
            </Text>

            <FlatList
              data={results}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={{ gap: 12 }}
              contentContainerStyle={{ gap: 12 }}
              renderItem={({ item }) => {
                const isMember = isUserInClass(item.users, CURRENT_USER_ID);

                return (
                  <TouchableOpacity
                    style={styles.card}
                    activeOpacity={0.85}
                    onPress={() => onTapClass(item)}
                  >
                    <View style={styles.cardTop}>
                      <Text style={styles.cardEmoji}>
                        {emojiForCourseName(item.name)}
                      </Text>
                    </View>

                    <View style={styles.cardBody}>
                      <Text style={styles.cardTitle}>{item.name}</Text>
                      <Text style={styles.cardCode}>
                        {isMember ? "Enrolled ✅ (tap to open)" : "Tap to join"}
                      </Text>
                      <Text style={styles.cardTerm}>
                        {Array.isArray(item.users) ? item.users.length : 0} members
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </>
        )}
      </View>

      {/* Join Modal */}
      <Modal
        visible={joinOpen}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!joinLoading) {
            setJoinOpen(false);
            setSelectedClass(null);
          }
        }}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => {
            if (!joinLoading) {
              setJoinOpen(false);
              setSelectedClass(null);
            }
          }}
        />

        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Join this class?</Text>
          <Text style={styles.modalText}>
            You’re not enrolled in{" "}
            <Text style={{ fontWeight: "800" }}>
              {selectedClass?.name ?? ""}
            </Text>
            .
          </Text>

          <View style={styles.modalBtns}>
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => {
                if (!joinLoading) {
                  setJoinOpen(false);
                  setSelectedClass(null);
                }
              }}
              disabled={joinLoading}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalJoin, joinLoading && styles.disabledBtn]}
              onPress={onConfirmJoin}
              disabled={joinLoading}
            >
              <Text style={styles.modalJoinText}>
                {joinLoading ? "Joining…" : "Join"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* Styles */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FDF2F8" },
  header: {
    padding: 20,
    paddingBottom: 28,
    backgroundColor: "#C084FC",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  title: { fontSize: 22, fontWeight: "700", color: "white", marginBottom: 12 },
  input: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 14,
    fontSize: 16,
    color: "#6B21A8",
  },
  content: { flex: 1, padding: 16 },
  center: { alignItems: "center", marginTop: 40, paddingHorizontal: 14 },
  emoji: { fontSize: 48, marginBottom: 12 },
  helperText: { fontSize: 16, color: "#A855F7", textAlign: "center" },
  subText: { fontSize: 14, color: "#C084FC", marginTop: 4, textAlign: "center" },
  resultCount: { color: "#9333EA", marginBottom: 12 },
  card: { flex: 1, backgroundColor: "white", borderRadius: 16, overflow: "hidden" },
  cardTop: {
    height: 64,
    backgroundColor: "#E9D5FF",
    justifyContent: "center",
    alignItems: "center",
  },
  cardEmoji: { fontSize: 28 },
  cardBody: { padding: 12 },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#6B21A8" },
  cardCode: { fontSize: 13, color: "#9333EA", marginTop: 2 },
  cardTerm: { fontSize: 11, color: "#A855F7", marginTop: 2 },

  // Modal
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.35)" },
  modalCard: {
    position: "absolute",
    left: 16,
    right: 16,
    top: "38%",
    backgroundColor: "white",
    borderRadius: 18,
    padding: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: "800", color: "#6B21A8", marginBottom: 8 },
  modalText: { color: "#7C3AED", marginBottom: 14 },
  modalBtns: { flexDirection: "row", gap: 10 },
  modalCancel: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#A855F7",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCancelText: { color: "#7C3AED", fontWeight: "800" },
  modalJoin: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#A855F7",
    alignItems: "center",
    justifyContent: "center",
  },
  modalJoinText: { color: "white", fontWeight: "800" },
  disabledBtn: { opacity: 0.6 },
});



