import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

type ScreenStateProps = {
  message: string;
  loading?: boolean;
};

export function ScreenState({ message, loading = false }: ScreenStateProps) {
  return (
    <View style={styles.container}>
      {loading ? <ActivityIndicator size="large" /> : null}
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 24,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
  },
});
