import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
} from "react-native";

interface ScannedNote {
  id: string;
  title: string;
  date: string;
  thumbnail: string;
  pages: number;
}

const SAMPLE_NOTES: ScannedNote[] = [
  {
    id: "1",
    title: "Biology Notes",
    date: "Feb 7, 2026",
    thumbnail:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800",
    pages: 2,
  },
  {
    id: "2",
    title: "Chemistry Review",
    date: "Feb 6, 2026",
    thumbnail:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
    pages: 1,
  },
];

export default function NotesScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const filteredNotes = SAMPLE_NOTES.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const updated = new Set(prev);
      updated.has(id) ? updated.delete(id) : updated.add(id);
      return updated;
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Notes</Text>
        <Text style={styles.subtitle}>
          {filteredNotes.length}{" "}
          {filteredNotes.length === 1 ? "note" : "notes"} 📚
        </Text>
      </View>

      {/* Search */}
      <TextInput
        placeholder="Search your notes..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.search}
        placeholderTextColor="#B794F4"
      />

      {/* Notes List */}
      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Image */}
            <View style={styles.imageWrapper}>
              <Image source={{ uri: item.thumbnail }} style={styles.image} />

              <TouchableOpacity
                style={styles.favoriteBtn}
                onPress={() => toggleFavorite(item.id)}
              >
                <Text style={{ fontSize: 18 }}>
                  {favorites.has(item.id) ? "⭐" : "☆"}
                </Text>
              </TouchableOpacity>

              <View style={styles.pageBadge}>
                <Text style={styles.pageText}>
                  {item.pages} {item.pages === 1 ? "page" : "pages"}
                </Text>
              </View>
            </View>

            {/* Content */}
            <View style={styles.cardBody}>
              <Text style={styles.noteTitle}>{item.title}</Text>
              <Text style={styles.noteDate}>{item.date}</Text>

              <View style={styles.actions}>
                <TouchableOpacity style={styles.outlineBtn}>
                  <Text style={styles.outlineText}>Download</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.outlineBtnPink}>
                  <Text style={styles.outlineTextPink}>Share</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn}>
                  <Text style={styles.deleteText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📝</Text>
            <Text style={styles.emptyTitle}>
              {searchQuery ? "No notes found" : "No notes yet"}
            </Text>
            <Text style={styles.emptyText}>
              {searchQuery
                ? "Try searching for something else"
                : "Start scanning your notes to see them here!"}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF2F8",
    padding: 16,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#7C3AED",
  },
  subtitle: {
    color: "#A855F7",
  },
  search: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#DDD6FE",
    color: "#6B21A8",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    marginBottom: 16,
    overflow: "hidden",
  },
  imageWrapper: {
    height: 180,
    backgroundColor: "#E9D5FF",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  favoriteBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "white",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  pageBadge: {
    position: "absolute",
    bottom: 12,
    left: 12,
    backgroundColor: "#7C3AED",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pageText: {
    color: "white",
    fontSize: 12,
  },
  cardBody: {
    padding: 14,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#6B21A8",
  },
  noteDate: {
    color: "#A855F7",
    marginBottom: 10,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  outlineBtn: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#DDD6FE",
    borderRadius: 12,
    alignItems: "center",
    padding: 8,
  },
  outlineText: {
    color: "#7C3AED",
    fontWeight: "600",
  },
  outlineBtnPink: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#FBCFE8",
    borderRadius: 12,
    alignItems: "center",
    padding: 8,
  },
  outlineTextPink: {
    color: "#EC4899",
    fontWeight: "600",
  },
  deleteBtn: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteText: {
    fontSize: 18,
  },
  empty: {
    alignItems: "center",
    marginTop: 40,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#7C3AED",
  },
  emptyText: {
    color: "#A855F7",
    textAlign: "center",
    marginTop: 4,
  },
});
