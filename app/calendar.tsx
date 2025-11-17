// app/calendar.tsx
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

type TasksType = { [date: string]: string[] };

export default function CalendarPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [tasks, setTasks] = useState<TasksType>({});
  const [newTask, setNewTask] = useState('');

  const dailyTasks: string[] = tasks[selectedDate] || [];

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks({ ...tasks, [selectedDate]: [...dailyTasks, newTask.trim()] });
    setNewTask('');
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <Calendar
        current={selectedDate}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        monthFormat={'MMMM yyyy'}
        markedDates={{ [selectedDate]: { selected: true, selectedColor: '#00adf5' } }}
        style={styles.calendar}
      />

      {/* Add Task Input */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Add new task"
          placeholderTextColor="#555"
          style={styles.input}
          value={newTask}
          onChangeText={setNewTask}
          onSubmitEditing={addTask}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Task List */}
      <Text style={styles.tasksTitle}>Tasks for {selectedDate}:</Text>
      {dailyTasks.length === 0 ? (
        <Text style={styles.noTasks}>No tasks for this day.</Text>
      ) : (
        <FlatList
          data={dailyTasks}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <Text style={styles.taskItem}>• {item}</Text>}
        />
      )}

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/dashboard')}>
        <Text style={styles.backText}>← Back to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 10, paddingTop: 40 },
  calendar: { borderRadius: 10, marginBottom: 15 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  input: { flex: 1, borderWidth: 1, borderColor: '#bbb', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, fontSize: 16, color: '#000', marginRight: 10 },
  addButton: { backgroundColor: '#00adf5', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8 },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  tasksTitle: { fontSize: 20, fontWeight: 'bold', color: '#000', marginBottom: 10 },
  noTasks: { fontSize: 16, color: '#555', marginBottom: 10 },
  taskItem: { fontSize: 16, color: '#000', marginBottom: 5 },
  backButton: { position: 'absolute', bottom: 40, left: 20, right: 20, padding: 15, backgroundColor: '#bfbfbf', borderRadius: 10, alignItems: 'center' },
  backText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
});
