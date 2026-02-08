import { router } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { login } from "../lib/api/auth_api";
import { setCurrentUser } from "@/lib/current_user";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    setError("");
    setLoading(true);

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }

    try {
      const data = await login(email.trim(), password.trim());
      console.log("Login success:", data);

      setCurrentUser({
        email: email.trim(),
        name: data?.name ?? "",
        userId: data?.userId ?? email.trim(),
        phone: data?.phone ?? "",
      });

      // Navigate to your actual tab screen (adjust if needed)
      router.replace("/(tabs)/Home");
    } catch (err: any) {
      const message =
        err?.message === "Invalid email or password"
          ? "Invalid email or password"
          : "Unable to connect. Try again.";

      setError(message);
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/mascot.png")}
        style={styles.logo}
      />

      <Text style={styles.title}>Noted</Text>
      <Text style={styles.subtitle}>Scan & share notes with classmates!</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Welcome Back! 👋</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {error.length > 0 && (
          <Text style={{ color: "red", marginBottom: 8 }}>{error}</Text>
        )}

        <Pressable
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={onLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Log In</Text>
          )}
        </Pressable>

        <Text style={styles.linkText}>Create Account</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F0FF",
    alignItems: "center",
    padding: 24,
  },
  logo: {
    width: 120,
    height: 120,
    marginTop: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    color: "#7A3EF0",
    marginTop: 8,
  },
  subtitle: {
    color: "#A78BFA",
    marginBottom: 24,
    textAlign: "center",
  },
  card: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 24,
    padding: 20,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    color: "#7A3EF0",
    marginBottom: 16,
  },
  label: {
    color: "#7A3EF0",
    marginBottom: 6,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D8B4FE",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#9B5CF6",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  linkText: {
    textAlign: "center",
    color: "#7A3EF0",
    marginTop: 16,
    fontWeight: "600",
  },
});