import { useEffect, useMemo, useRef, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Linking,
  Platform,
  ActivityIndicator,
} from "react-native";

import { Text, View } from "@/components/Themed";
import { CameraView, useCameraPermissions } from "expo-camera";

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

/**
 * IMPORTANT:
 * - If you're running on a phone (Expo Go), "localhost" will NOT point to your laptop.
 * - Replace this with your computer's LAN IP, e.g. http://192.168.1.23:8000
 */
const API_BASE_URL = "http://10.138.238.192:8000";
const UPLOAD_ENDPOINT = `${API_BASE_URL}/api/upload-to-pdf`;

type UploadResult = { imageUrl: string; pdfUrl: string };

export default function TabTwoScreen() {
  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();

  const [capturedUri, setCapturedUri] = useState<string | null>(null);

  // UI states you already had
  const captured = useMemo(() => !!capturedUri, [capturedUri]);
  const [processing, setProcessing] = useState(false); // uploading/processing
  const [progress, setProgress] = useState(0);

  const [selectCourse, setSelectCourse] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Results from backend
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // Ask camera permissions as soon as tab opens
    if (!permission) return;
    if (!permission.granted) requestPermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permission?.granted]);

  const handleCapture = async () => {
    setErrorMsg(null);
    setUploadResult(null);
    setSelectCourse(false);
    setSelectedCourse(null);

    try {
      if (!cameraRef.current) {
        setErrorMsg("Camera not ready yet.");
        return;
      }

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      if (!photo?.uri) {
        setErrorMsg("Failed to capture photo.");
        return;
      }

      setCapturedUri(photo.uri);
      setProgress(0);
    } catch (e) {
      setErrorMsg(`Capture failed: ${String(e)}`);
    }
  };

  const handleRetake = () => {
    setCapturedUri(null);
    setProcessing(false);
    setProgress(0);
    setSelectCourse(false);
    setSelectedCourse(null);
    setUploadResult(null);
    setErrorMsg(null);
  };

  const startFakeProgress = () => {
    // We can’t reliably get real upload progress with fetch() in RN without extra libs,
    // so we simulate a smooth progress bar up to ~90%, then finish on success.
    setProgress(0);
    let p = 0;
    const interval = setInterval(() => {
      p += 4;
      if (p >= 90) {
        p = 90;
        setProgress(p);
        clearInterval(interval);
      } else {
        setProgress(p);
      }
    }, 120);
    return () => clearInterval(interval);
  };

const uploadCapturedToPdf = async () => {
  setErrorMsg(null);

  if (!capturedUri) {
    setErrorMsg("No photo to upload.");
    return;
  }
  if (!selectedCourse) {
    setErrorMsg("Pick a course first.");
    return;
  }

  setProcessing(true);
  const stopProgress = startFakeProgress();

  try {
    const formData = new FormData();
    formData.append("file", {
      uri: capturedUri,
      name: `note-${Date.now()}.jpg`,
      type: "image/jpeg",
    } as any);

    const res = await fetch(UPLOAD_ENDPOINT, {
      method: "POST",
      body: formData,
      // ✅ IMPORTANT: no headers here
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Upload failed (${res.status}): ${text}`);
    }

    const data = (await res.json()) as UploadResult;
    if (!data?.pdfUrl) throw new Error("Backend response missing pdfUrl.");

    setUploadResult(data);
    setProgress(100);
  } catch (e) {
    setErrorMsg(String(e));
  } finally {
    stopProgress();
    setProcessing(false);
  }
};

  const openPdf = async () => {
    if (!uploadResult?.pdfUrl) return;
    await Linking.openURL(uploadResult.pdfUrl);
  };

  // Permission UI
  if (!permission) {
    return (
      <View style={[styles.container, styles.centerFull]}>
        <ActivityIndicator />
        <Text style={{ marginTop: 10 }}>Checking camera permissions…</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.centerFull]}>
        <Text style={styles.title}>📸 Scan Note</Text>
        <Text style={styles.previewText}>
          Camera permission is required to scan notes.
        </Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={requestPermission}>
          <Text style={styles.btnText}>Enable Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📸 Scan Note</Text>

      {/* Camera / Preview */}
      <View style={styles.preview}>
        {!captured ? (
          <>
            <CameraView
              ref={(r) => (cameraRef.current = r)}
              style={styles.camera}
              facing="back"
            />
            <View style={styles.cameraOverlay}>
              <Text style={styles.previewText}>Position your notes here</Text>
            </View>
          </>
        ) : (
          <Image source={{ uri: capturedUri! }} style={styles.image} />
        )}
      </View>

      {/* Error */}
      {errorMsg && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      )}

      {/* Progress */}
      {(processing || progress > 0) && progress < 100 && (
        <View style={styles.progressBox}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
          <Text style={styles.progressText}>{progress}%</Text>
        </View>
      )}

      {/* Success */}
      {uploadResult?.pdfUrl && (
        <View style={styles.successBox}>
          <Text style={styles.successText}>✅ Upload Complete!</Text>
          <TouchableOpacity style={styles.outlineBtn} onPress={openPdf}>
            <Text style={styles.outlineText}>Open PDF</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Controls */}
      {!captured ? (
        <TouchableOpacity style={styles.primaryBtn} onPress={handleCapture}>
          <Text style={styles.btnText}>Capture Note</Text>
        </TouchableOpacity>
      ) : (
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
                    activeOpacity={0.85}
                  >
                    <Text style={styles.courseEmoji}>{item.emoji}</Text>
                    <Text style={styles.courseName}>{item.name}</Text>
                    <Text style={styles.courseCode}>{item.code}</Text>
                  </TouchableOpacity>
                )}
              />

              {selectedCourse && (
                <TouchableOpacity
                  style={[
                    styles.primaryBtn,
                    (processing || !!uploadResult) && styles.disabledBtn,
                  ]}
                  onPress={uploadCapturedToPdf}
                  disabled={processing || !!uploadResult}
                >
                  <Text style={styles.btnText}>
                    {processing
                      ? "Uploading…"
                      : uploadResult
                      ? "Uploaded"
                      : `Upload to ${selectedCourse.name}`}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FDF2F8",
  },
  centerFull: {
    justifyContent: "center",
    alignItems: "center",
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
    marginBottom: 16,
    overflow: "hidden",
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  cameraOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 14,
    alignItems: "center",
  },
  previewText: {
    color: "#6B21A8",
    fontSize: 16,
    backgroundColor: "rgba(233,213,255,0.85)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  errorBox: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#FEE2E2",
    marginBottom: 12,
  },
  errorText: {
    color: "#B91C1C",
    fontWeight: "700",
  },
  progressBox: {
    height: 20,
    backgroundColor: "#DDD6FE",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 12,
    justifyContent: "center",
  },
  progressFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#A855F7",
  },
  progressText: {
    textAlign: "center",
    color: "#6B21A8",
    fontWeight: "700",
  },
  successBox: {
    paddingVertical: 8,
    alignItems: "center",
    gap: 10,
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
  disabledBtn: {
    opacity: 0.6,
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
    fontSize: 16,
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