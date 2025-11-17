import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function Settings() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.option}>
        <Text style={styles.optionText}>Enable Notifications</Text>
        <Switch value={notifications} onValueChange={setNotifications} />
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/')}>
        <Text style={styles.backText}>← Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#000', marginBottom: 20 },
  option: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  optionText: { fontSize: 18, color: '#000' },
  backButton: { position: 'absolute', bottom: 40, left: 20, right: 20, padding: 15, backgroundColor: '#bfbfbf', borderRadius: 10, alignItems: 'center' },
  backText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
});
