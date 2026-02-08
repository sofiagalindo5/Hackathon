import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { getCurrentUser, setCurrentUser } from "@/lib/current_user";

export default function AccountScreen() {
  const initialUser = getCurrentUser();
  const [email, setEmail] = useState(initialUser.email ?? "");
  const [phone, setPhone] = useState(initialUser.phone ?? "");
  const [name, setName] = useState(initialUser.name ?? "");
  const [editing, setEditing] = useState<"email" | "phone" | null>(null);
  const [tempValue, setTempValue] = useState("");

  const API_BASE_URL =
    process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://10.136.226.189:8000";
  const CURRENT_USER_EMAIL = getCurrentUser().email;

  const startEdit = (field: "email" | "phone") => {
    setEditing(field);
    setTempValue(field === "email" ? email : phone);
  };

  const save = async () => {
    const nextEmail = editing === "email" ? tempValue : email;
    const nextPhone = editing === "phone" ? tempValue : phone;

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/auth/profile?email=${encodeURIComponent(email)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: nextEmail,
            name,
            phone: nextPhone,
          }),
        }
      );
      const text = await res.text();
      if (!res.ok) throw new Error(text || "Failed to update profile");
      const data = JSON.parse(text);
      const nextUser = {
        email: data.email ?? nextEmail,
        name: data.name ?? name,
        phone: data.phone ?? nextPhone,
      };
      setEmail(nextUser.email);
      setPhone(nextUser.phone ?? "");
      setName(nextUser.name ?? "");
      setCurrentUser(nextUser);
      setEditing(null);
    } catch (e) {
      Alert.alert("Update failed", String(e));
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      try {
        if (!CURRENT_USER_EMAIL) {
          return;
        }

        const res = await fetch(
          `${API_BASE_URL}/api/auth/profile?email=${encodeURIComponent(
            CURRENT_USER_EMAIL
          )}`
        );
        const text = await res.text();
        if (!res.ok) throw new Error(text || "Failed to load profile");
        const data = JSON.parse(text);
        if (cancelled) return;
        setEmail(data.email ?? "");
        setPhone(data.phone ?? "");
        setName(data.name ?? name);
      } catch (e) {
        if (!cancelled) {
          Alert.alert("Load failed", String(e));
        }
      }
    };

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, [API_BASE_URL]);

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <LinearGradient
        colors={["#EC4899", "#A855F7", "#6366F1"]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>My Account</Text>

        <View style={styles.avatar}>
          <Ionicons name="person" size={42} color="#A855F7" />
        </View>

        <Text style={styles.name}>{name || "Your Name"}</Text>
        <Text style={styles.headerEmail}>{email}</Text>
      </LinearGradient>

      {/* CONTENT */}
      <View style={styles.content}>
        {/* UNIVERSITY CARD */}
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Ionicons name="school" size={26} color="white" />
          </View>
          <View>
            <Text style={styles.cardTitle}>University of California</Text>
            <Text style={styles.cardSub}>Computer Science Major</Text>
            <Text style={styles.cardMeta}>Class of 2027</Text>
          </View>
        </View>

        {/* PERSONAL INFO */}
        <Text style={styles.sectionTitle}>Personal Information</Text>

        {/* EMAIL */}
        <View style={styles.row}>
          <Ionicons name="mail" size={22} color="#7C3AED" />
          <View style={styles.rowText}>
            <Text style={styles.label}>Email</Text>
            {editing === "email" ? (
              <TextInput
                value={tempValue}
                onChangeText={setTempValue}
                style={styles.input}
                autoFocus
              />
            ) : (
              <Text style={styles.value}>{email}</Text>
            )}
          </View>
          {editing === "email" ? (
            <Pressable onPress={save}>
              <Ionicons name="checkmark" size={22} color="green" />
            </Pressable>
          ) : (
            <Pressable onPress={() => startEdit("email")}>
              <Ionicons name="pencil" size={20} color="#7C3AED" />
            </Pressable>
          )}
        </View>

        {/* PHONE */}
        <View style={styles.row}>
          <Ionicons name="call" size={22} color="#EC4899" />
          <View style={styles.rowText}>
            <Text style={styles.label}>Phone</Text>
            {editing === "phone" ? (
              <TextInput
                value={tempValue}
                onChangeText={setTempValue}
                style={styles.input}
                autoFocus
              />
            ) : (
              <Text style={styles.value}>{phone}</Text>
            )}
          </View>
          {editing === "phone" ? (
            <Pressable onPress={save}>
              <Ionicons name="checkmark" size={22} color="green" />
            </Pressable>
          ) : (
            <Pressable onPress={() => startEdit("phone")}>
              <Ionicons name="pencil" size={20} color="#7C3AED" />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F3FF",
  },

  header: {
    paddingTop: 60,
    paddingBottom: 90,
    alignItems: "center",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: "white",
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  name: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
  },
  headerEmail: {
    color: "#E9D5FF",
    fontSize: 13,
  },

  content: {
    padding: 20,
    marginTop: -60,
  },

  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    gap: 14,
    marginBottom: 24,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#A855F7",
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    fontWeight: "700",
    fontSize: 16,
    color: "#6B21A8",
  },
  cardSub: {
    color: "#9333EA",
  },
  cardMeta: {
    fontSize: 12,
    color: "#A855F7",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#7C3AED",
    marginBottom: 12,
  },

  row: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  rowText: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: "#A855F7",
  },
  value: {
    fontWeight: "600",
    color: "#6B21A8",
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#C084FC",
    paddingVertical: 4,
  },
});
