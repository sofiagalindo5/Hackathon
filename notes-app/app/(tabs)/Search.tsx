import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { Text, View } from "@/components/Themed";

type ClassOut = {
  id: string;
  name: string;
  users: string[];
  photos: string[];
};

// ✅ Use your laptop IP (same one you used for upload)
const API_BASE_URL = "http://10.138.238.192:8000";
const SEARCH_ENDPOINT = `${API_BASE_URL}/api/classes/search`;

function emojiForCourseName(name: string) {
  const n = name.toLowerCase();
  if (n.includes("math")) return "📐";
  if (n.includes("bio")) return "🧬";
  if (n.includes("chem")) return "🧪";
  if (n.includes("phys")) return "⚛️";
  if (n.includes("cs") || n.includes("computer")) return "💻";
  if (n.includes("psych")) return "🧠";
  if (n.includes("econ")) return "📊";
  if (n.includes("art")) return "🎨";
  if (n.includes("hist")) return "📚";
  if (n.includes("lit")) return "📖";
  return "📘";
}

export default function TabOneScreen() {
  const [searchQuery, setSearchQuery] = useState("");

  const [results, setResults] = useState<ClassOut[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const q = useMemo(() => searchQuery.trim(), [searchQuery]);

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
        // ✅ debounce so we don’t spam backend on every keystroke
        await new Promise((r) => setTimeout(r, 300));
        if (cancelled) return;

        const url = `${SEARCH_ENDPOINT}?name=${encodeURIComponent(q)}`;
        const res = await fetch(url);

        const text = await res.text();
        if (!res.ok) throw new Error(`Search failed (${res.status}): ${text}`);

        const data = JSON.parse(text) as ClassOut[];
        if (!cancelled) setResults(Array.isArray(data) ? data : []);
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

      {/* Results */}
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
            <Text style={styles.subText}>
              Try searching with different keywords
            </Text>
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
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.card} activeOpacity={0.85}>
                  <View style={styles.cardTop}>
                    <Text style={styles.cardEmoji}>
                      {emojiForCourseName(item.name)}
                    </Text>
                  </View>

                  <View style={styles.cardBody}>
                    <Text style={styles.cardTitle}>{item.name}</Text>

                    {/* You don’t have "code" and "term" from backend, so show useful backend info instead */}
                    <Text style={styles.cardCode}>ID: {item.id.slice(0, 8)}…</Text>
                    <Text style={styles.cardTerm}>
                      {item.users?.length ?? 0} members
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF2F8",
  },
  header: {
    padding: 20,
    paddingBottom: 28,
    backgroundColor: "#C084FC",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "white",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 14,
    fontSize: 16,
    color: "#6B21A8",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  center: {
    alignItems: "center",
    marginTop: 40,
    paddingHorizontal: 14,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  helperText: {
    fontSize: 16,
    color: "#A855F7",
    textAlign: "center",
  },
  subText: {
    fontSize: 14,
    color: "#C084FC",
    marginTop: 4,
    textAlign: "center",
  },
  resultCount: {
    color: "#9333EA",
    marginBottom: 12,
  },
  card: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
  },
  cardTop: {
    height: 64,
    backgroundColor: "#E9D5FF",
    justifyContent: "center",
    alignItems: "center",
  },
  cardEmoji: {
    fontSize: 28,
  },
  cardBody: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#6B21A8",
  },
  cardCode: {
    fontSize: 13,
    color: "#9333EA",
  },
  cardTerm: {
    fontSize: 11,
    color: "#A855F7",
    marginTop: 2,
  },
});

