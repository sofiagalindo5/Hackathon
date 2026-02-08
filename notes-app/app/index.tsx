import { View, Text, StyleSheet } from "react-native";
import OwlLogo from "@/components/OwlLogo";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <OwlLogo />
      <Text style={styles.title}>Welcome to Notes App 🦉</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "700" },
});
