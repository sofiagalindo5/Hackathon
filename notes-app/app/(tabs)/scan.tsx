import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
} from "react-native";

interface Course {
  name: string;
  code: string;
  emoji: string;
}

const COURSES: Course[] = [
  { name: "Mathematics", code: "MATH 101", emoji: "📐" },
  { name: "Biology", code: "BIO 110", emoji: "🧬" },
  { name: "Chemistry", code: "CHEM 301", emoji: "🧪" },
  { name: "Physics", code: "PHYS 201", emoji: "⚛️" },
];

export default function ScanScreen() {
  const [captured, setCaptured] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectCourse, setSelectCourse] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const handleCapture = () => {
    setCaptured(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setProcessing(true);
          return 100;
        }
        return p + 5;
      });
    }, 100);
  };

  const handleRetake = () => {
    setCaptured(false);
    setProcessing(false);
    setProgress(0);
    setSelectCourse(false);
    setSelectedCourse(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {processing ? "✨ Processing" : "📸 Scan Note"}
      </Text>

      {/* Camera / Preview */}
      <View style={styles.preview}>
        {!captured ? (
          <Text style={styles.previewText}>Position your notes here</Text>
        ) : (
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800",
            }}
            style={styles.image}
          />
        )}
      </View>

      {/* Progress */}
      {captured && !processing && (
        <View style={styles.progressBox}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
          <Text style={styles.progressText}>{progress}%</Text>
        </View>
      )}

      {processing && (
        <View style={styles.successBox}>
          <Text style={styles.successText}>✅ Scan Complete!</Text>
        </View>
      )}

      {/* Controls */}
      {!captured ? (
        <TouchableOpacity style={styles.primaryBtn} onPress={handleCapture}>
          <Text style={styles.btnText}>Capture Note</Text>
        </TouchableOpacity>
      ) : processing ? (
        <>
          <TouchableOpacity style={styles.outlineBtn} onPress={handleRetake}>
            <Text style={styles.outlineText}>Retake</Text>
          </TouchableOpacity>

          {!selectCourse ? (
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => setSelectCourse(true)}
            >
              <Text style={styles.btnText}>Upload to Course</Text>
            </TouchableOpacity>
          ) : (
            <>
              <Text style={styles.subtitle}>Select a Course</Text>
              <FlatList
                data={COURSES}
                numColumns={2}
                keyExtractor={(item) => item.code}
                columnWrapperStyle={{ gap: 12 }}
                contentContainerStyle={{ gap: 12 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.courseCard,
                      selectedCourse?.code === item.code &&
                        styles.courseSelected,
                    ]}
                    onPress={() => setSelectedCourse(item)}
                  >
                    <Text style={styles.courseEmoji}>{item.emoji}</Text>
                    <Text style={styles.courseName}>{item.name}</Text>
                    <Text style={styles.courseCode}>{item.code}</Text>
                  </TouchableOpacity>
                )}
              />

              {selectedCourse && (
                <TouchableOpacity style={styles.primaryBtn}>
                  <Text style={styles.btnText}>
                    Upload to {selectedCourse.name}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FDF2F8",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#7C3AED",
    marginBottom: 12,
  },
  preview: {
    flex: 1,
    backgroundColor: "#E9D5FF",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  previewText: {
    color: "#6B21A8",
    fontSize: 16,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
  },
  progressBox: {
    height: 20,
    backgroundColor: "#DDD6FE",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#A855F7",
  },
  progressText: {
    textAlign: "center",
    marginTop: 4,
    color: "#6B21A8",
  },
  successBox: {
    padding: 12,
    alignItems: "center",
  },
  successText: {
    fontSize: 18,
    color: "#16A34A",
    fontWeight: "700",
  },
  primaryBtn: {
    height: 56,
    backgroundColor: "#A855F7",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  btnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  outlineBtn: {
    height: 56,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#A855F7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  outlineText: {
    color: "#7C3AED",
    fontWeight: "700",
  },
  subtitle: {
    textAlign: "center",
    color: "#6B21A8",
    fontWeight: "700",
    marginBottom: 8,
  },
  courseCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
  },
  courseSelected: {
    borderWidth: 2,
    borderColor: "#22C55E",
    backgroundColor: "#ECFDF5",
  },
  courseEmoji: {
    fontSize: 28,
  },
  courseName: {
    fontWeight: "700",
    color: "#6B21A8",
    marginTop: 4,
  },
  courseCode: {
    fontSize: 12,
    color: "#9333EA",
  },
});
5959