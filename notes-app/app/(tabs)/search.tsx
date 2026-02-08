import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

interface Course {
  name: string;
  code: string;
  emoji: string;
  term: string;
}

const allCourses: Course[] = [
  { name: "Mathematics", code: "MATH 101", emoji: "📐", term: "Spring 2026" },
  { name: "History", code: "HIST 204", emoji: "📚", term: "Spring 2026" },
  { name: "Chemistry", code: "CHEM 301", emoji: "🧪", term: "Spring 2026" },
  { name: "Literature", code: "LIT 150", emoji: "📖", term: "Spring 2026" },
  { name: "Physics", code: "PHYS 201", emoji: "⚛️", term: "Spring 2026" },
  { name: "Biology", code: "BIO 110", emoji: "🧬", term: "Spring 2026" },
  { name: "Computer Science", code: "CS 202", emoji: "💻", term: "Spring 2026" },
  { name: "Psychology", code: "PSY 101", emoji: "🧠", term: "Spring 2026" },
  { name: "Economics", code: "ECON 301", emoji: "📊", term: "Spring 2026" },
  { name: "Art History", code: "ART 205", emoji: "🎨", term: "Spring 2026" },
];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = allCourses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Search Courses</Text>

        <TextInput
          placeholder="Search by course name or code..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.input}
          placeholderTextColor="#B794F4"
        />
      </View>

      {/* Results */}
      <View style={styles.content}>
        {searchQuery === "" ? (
          <View style={styles.center}>
            <Text style={styles.emoji}>🔍</Text>
            <Text style={styles.helperText}>
              Search for a course to get started!
            </Text>
          </View>
        ) : filteredCourses.length === 0 ? (
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
              Found {filteredCourses.length}{" "}
              {filteredCourses.length === 1 ? "course" : "courses"}
            </Text>

            <FlatList
              data={filteredCourses}
              keyExtractor={(item) => item.code}
              numColumns={2}
              columnWrapperStyle={{ gap: 12 }}
              contentContainerStyle={{ gap: 12 }}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.card}>
                  <View style={styles.cardTop}>
                    <Text style={styles.cardEmoji}>{item.emoji}</Text>
                  </View>
                  <View style={styles.cardBody}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <Text style={styles.cardCode}>{item.code}</Text>
                    <Text style={styles.cardTerm}>{item.term}</Text>
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
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  helperText: {
    fontSize: 16,
    color: "#A855F7",
  },
  subText: {
    fontSize: 14,
    color: "#C084FC",
    marginTop: 4,
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
