import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function ResultScreen() {
  const { lat, lng, radius } = useLocalSearchParams<{
    lat?: string;
    lng?: string;
    radius?: string;
  }>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Parametri ricevuti</Text>
      <Text style={styles.row}>Lat: {lat ?? '-'}</Text>
      <Text style={styles.row}>Lng: {lng ?? '-'}</Text>
      <Text style={styles.row}>Radius: {radius ?? '-'} m</Text>

      <Text style={styles.placeholder}>Qui apparirà il ristorante scelto.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  row: {
    fontSize: 16,
  },
  placeholder: {
    marginTop: 20,
    fontSize: 16,
    color: '#555',
  },
});
