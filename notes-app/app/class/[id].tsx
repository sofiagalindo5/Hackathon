import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Linking,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "@/components/Themed";

const API_BASE_URL = "http://10.138.238.192:8000";
const NOTES_ENDPOINT = `${API_BASE_URL}/api/notes`;

type Note = {
  id: string;
  imageUrl: string;
  pdfUrl: string;
  uploadedBy: string;
  uploadedAt?: string | null;
  summary?: string | null;
};

export default function ClassScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const classId = String(params.id ?? "");

  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadNotes = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const url = `${NOTES_ENDPOINT}?class_id=${encodeURIComponent(classId)}`;
      const res = await fetch(url);
      const text = await res.text();
      if (!res.ok) throw new Error(`Load notes failed (${res.status}): ${text}`);
      const data = JSON.parse(text) as Note[];
      const arr = Array.isArray(data) ? data : [];
      // newest first
      setNotes(arr.slice().reverse());
    } catch (e) {
      setErrorMsg(String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (classId) loadNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId]);

  const openPdf = async (url: string) => {
    await Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📚 Class Notes</Text>
      <Text style={styles.subtitle}>Notes for this class</Text>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={{ marginTop: 10 }}>Loading notes…</Text>
        </View>
      ) : errorMsg ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{errorMsg}</Text>
          <TouchableOpacity style={styles.outlineBtn} onPress={loadNotes}>
            <Text style={styles.outlineText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : notes.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ fontSize: 44 }}>🗂️</Text>
          <Text style={{ marginTop: 10, color: "#A855F7" }}>
            No notes yet. Upload one from Scan!
          </Text>
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(n) => n.id}
          contentContainerStyle={{ gap: 12, paddingBottom: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => openPdf(item.pdfUrl)}
            >
              <Text style={styles.cardTitle}>📄 Open PDF</Text>
              <Text style={styles.cardMeta}>Uploaded by: {item.uploadedBy}</Text>
              {item.uploadedAt ? (
                <Text style={styles.cardMeta}>At: {item.uploadedAt}</Text>
              ) : null}
              {item.summary ? (
                <Text style={styles.cardSummary}>{item.summary}</Text>
              ) : null}
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#FDF2F8" },
  title: { fontSize: 22, fontWeight: "800", color: "#7C3AED" },
  subtitle: { marginTop: 6, color: "#9333EA", marginBottom: 12 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
  errorText: { color: "#B91C1C", fontWeight: "800", textAlign: "center" },
  card: { backgroundColor: "white", borderRadius: 16, padding: 14 },
  cardTitle: { fontWeight: "800", color: "#6B21A8", marginBottom: 6 },
  cardMeta: { color: "#9333EA", fontSize: 12 },
  cardSummary: { marginTop: 8, color: "#6B21A8" },
  outlineBtn: {
    height: 48,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#A855F7",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  outlineText: { color: "#7C3AED", fontWeight: "800" },
});

