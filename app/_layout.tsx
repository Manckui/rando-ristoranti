import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="map" options={{ title: 'Mappa' }} />
      <Stack.Screen name="result" options={{ title: 'Risultato' }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
