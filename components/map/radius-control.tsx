import Slider from '@react-native-community/slider';
import { StyleSheet, Text, View } from 'react-native';

type RadiusControlProps = {
  radius: number;
  min: number;
  max: number;
  step: number;
  onChange: (nextRadius: number) => void;
};

export function RadiusControl({ radius, min, max, step, onChange }: RadiusControlProps) {
  return (
    <View>
      <Text style={styles.label}>Raggio: {radius} m</Text>
      <Slider
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={radius}
        onValueChange={(value) => onChange(value)}
        minimumTrackTintColor="#111"
        maximumTrackTintColor="#ddd"
        thumbTintColor="#111"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  slider: {
    width: '100%',
    height: 40,
  },
});
