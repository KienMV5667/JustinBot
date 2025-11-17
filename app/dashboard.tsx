import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/images/JustinBot_logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>JUSTINBOT</Text>
        <Text style={styles.subtitle}>Your AI companion for mental well-being</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/chat")}
        >
          <Text style={styles.buttonIcon}>💬</Text>
          <Text style={styles.buttonText}>Chat with JustinBot</Text>
          <Text style={styles.buttonSubtext}>Get support and talk about your feelings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/calendar")}
        >
          <Text style={styles.buttonIcon}>📅</Text>
          <Text style={styles.buttonText}>Calendar & Tasks</Text>
          <Text style={styles.buttonSubtext}>Manage your daily tasks and schedule</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/goals")}
        >
          <Text style={styles.buttonIcon}>🎯</Text>
          <Text style={styles.buttonText}>Goals</Text>
          <Text style={styles.buttonSubtext}>Track your personal goals</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/settings")}
        >
          <Text style={styles.buttonIcon}>⚙️</Text>
          <Text style={styles.buttonText}>Settings</Text>
          <Text style={styles.buttonSubtext}>Manage your account and preferences</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  logo: {
    width: 70,
    height: 70,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  buttonContainer: {
    flex: 1,
  },
  button: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 3,
  },
  buttonSubtext: {
    fontSize: 13,
    color: "#666",
  },
});
