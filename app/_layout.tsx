// app/_layout.tsx
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import 'react-native-reanimated';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false, // hide default header
        }}
      >
        {/* Main screens */}
        <Stack.Screen name="index" />
        <Stack.Screen name="calendar" />
        <Stack.Screen name="goals" />
        <Stack.Screen name="settings" />

        {/* Modal screen */}
        <Stack.Screen
          name="modal"
          options={{
            presentation: 'modal', // slides up like a modal
            headerShown: true,
            title: 'Modal',
          }}
        />
      </Stack>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
