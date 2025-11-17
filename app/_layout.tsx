import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor:"#000",
        },
        headerTintColor:"#fff",
        headerTitleStyle: {
          color:"#fff",
        },
      }}
    >
    </Stack>
  );
}