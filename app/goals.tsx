// app/goals.tsx
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Goals() {
  const router = useRouter();
  const [goals, setGoals] = useState<string[]>([]);
  const [newGoal, setNewGoal] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');

  const addGoal = () => {
    if (!newGoal.trim()) return;
    setGoals([...goals, newGoal.trim()]);
    setNewGoal('');
    Keyboard.dismiss();
  };

  const saveEdit = (index: number) => {
    const updatedGoals = [...goals];
    updatedGoals[index] = editingText;
    setGoals(updatedGoals);
    setEditingIndex(null);
    setEditingText('');
  };

  const deleteGoal = (index: number) => setGoals(goals.filter((_, i) => i !== index));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Goals</Text>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Add new goal"
          placeholderTextColor="#555"
          style={styles.input}
          value={newGoal}
          onChangeText={setNewGoal}
          onSubmitEditing={addGoal}
        />
        <TouchableOpacity style={styles.addButton} onPress={addGoal}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={goals}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.goalItem}>
            {editingIndex === index ? (
              <>
                <TextInput style={styles.editInput} value={editingText} onChangeText={setEditingText} onSubmitEditing={() => saveEdit(index)} autoFocus />
                <TouchableOpacity style={styles.saveButton} onPress={() => saveEdit(index)}>
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.goalText}>• {item}</Text>
                <View style={styles.buttonsContainer}>
                  <TouchableOpacity style={styles.editButton} onPress={() => { setEditingIndex(index); setEditingText(item); }}>
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => deleteGoal(index)}>
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/')}>
        <Text style={styles.backText}>← Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#000', marginBottom: 15 },
  inputContainer: { flexDirection: 'row', marginBottom: 20 },
  input: { flex: 1, borderWidth: 1, borderColor: '#bbb', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, fontSize: 16, color: '#000', marginRight: 10 },
  addButton: { backgroundColor: '#00adf5', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8 },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  goalItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  goalText: { fontSize: 18, color: '#000', flex: 1 },
  buttonsContainer: { flexDirection: 'row' },
  editButton: { marginRight: 10, backgroundColor: '#f0a500', padding: 5, borderRadius: 6 },
  deleteButton: { backgroundColor: '#ff4d4d', padding: 5, borderRadius: 6 },
  saveButton: { backgroundColor: '#00adf5', padding: 5, borderRadius: 6, marginLeft: 10 },
  buttonText: { color: '#fff', fontSize: 14 },
  editInput: { flex: 1, borderWidth: 1, borderColor: '#bbb', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 5, fontSize: 16, color: '#000' },
  backButton: { position: 'absolute', bottom: 40, left: 20, right: 20, padding: 15, backgroundColor: '#bfbfbf', borderRadius: 10, alignItems: 'center' },
  backText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
});
