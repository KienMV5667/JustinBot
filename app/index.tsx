// app/index.tsx
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to JustinBot!</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/calendar')}>
        <Text style={styles.buttonText}>Calendar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/goals')}>
        <Text style={styles.buttonText}>Goals</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/settings')}>
        <Text style={styles.buttonText}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
}

const BUTTON_WIDTH = 200;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 60, // Space below title
    color: '#000',
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 15,
    width: BUTTON_WIDTH,
    borderRadius: 15,
    marginBottom: 25, // Space between buttons
    alignItems: 'center',
    // Softer shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3, // Android shadow
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
