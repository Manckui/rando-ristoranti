import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  GestureResponderEvent,
  LayoutChangeEvent,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MapView, { Circle, MapPressEvent, Marker, Region } from 'react-native-maps';

type Coordinates = {
  latitude: number;
  longitude: number;
};

const MIN_RADIUS = 200;
const MAX_RADIUS = 3000;
const STEP = 100;
const THUMB_SIZE = 22;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

type RadiusSliderProps = {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
};

function RadiusSlider({ min, max, step, value, onChange }: RadiusSliderProps) {
  const [trackWidth, setTrackWidth] = useState(0);
  const dragStart = useRef(0);

  const valueToPosition = (current: number) => {
    if (!trackWidth) return 0;
    return ((current - min) / (max - min)) * trackWidth;
  };

  const positionToValue = (position: number) => {
    if (!trackWidth) return value;
    const ratio = clamp(position / trackWidth, 0, 1);
    const raw = min + ratio * (max - min);
    const stepped = Math.round(raw / step) * step;
    return clamp(stepped, min, max);
  };

  const handleTrackPress = (event: GestureResponderEvent) => {
    const nextValue = positionToValue(event.nativeEvent.locationX);
    onChange(nextValue);
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          dragStart.current = valueToPosition(value);
        },
        onPanResponderMove: (_, gestureState) => {
          const nextPosition = dragStart.current + gestureState.dx;
          onChange(positionToValue(nextPosition));
        },
      }),
    [onChange, trackWidth, value]
  );

  const handleTrackLayout = (event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width);
  };

  const thumbLeft = valueToPosition(value);

  return (
    <View style={styles.sliderWrap}>
      <Pressable onPress={handleTrackPress} style={styles.sliderTouchArea}>
        <View onLayout={handleTrackLayout} style={styles.sliderTrack}>
          <View style={[styles.sliderFill, { width: thumbLeft }]} />
          <View
            style={[styles.sliderThumb, { left: Math.max(0, thumbLeft - THUMB_SIZE / 2) }]}
            {...panResponder.panHandlers}
          />
        </View>
      </Pressable>
    </View>
  );
}

export default function MapScreen() {
  const [radius, setRadius] = useState(1000);
  const [center, setCenter] = useState<Coordinates | null>(null);
  const [region, setRegion] = useState<Region | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initLocation() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== Location.PermissionStatus.GRANTED) {
          setErrorMessage('Permesso posizione negato.');
          setLoading(false);
          return;
        }

        const current = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const nextCenter = {
          latitude: current.coords.latitude,
          longitude: current.coords.longitude,
        };

        setCenter(nextCenter);
        setRegion({
          ...nextCenter,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        });
      } catch {
        setErrorMessage('Errore nel recupero della posizione.');
      } finally {
        setLoading(false);
      }
    }

    void initLocation();
  }, []);

  const handleMapPress = (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setCenter({ latitude, longitude });
  };

  const handleChoose = () => {
    if (!center) return;

    router.push({
      pathname: '/result',
      params: {
        lat: center.latitude.toFixed(6),
        lng: center.longitude.toFixed(6),
        radius: String(radius),
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.info}>Recupero posizione...</Text>
      </View>
    );
  }

  if (!center || !region) {
    return (
      <View style={styles.centered}>
        <Text style={styles.info}>{errorMessage ?? 'Posizione non disponibile.'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={region}
        onPress={handleMapPress}
        showsUserLocation
        showsMyLocationButton>
        <Marker
          coordinate={center}
          draggable
          onDragEnd={(event) => setCenter(event.nativeEvent.coordinate)}
          title="Centro selezionato"
        />
        <Circle
          center={center}
          radius={radius}
          fillColor="rgba(30, 144, 255, 0.2)"
          strokeColor="rgba(30, 144, 255, 0.8)"
          strokeWidth={2}
        />
      </MapView>

      <View style={styles.panel}>
        <Text style={styles.label}>Raggio: {radius} m</Text>
        <RadiusSlider
          min={MIN_RADIUS}
          max={MAX_RADIUS}
          step={STEP}
          value={radius}
          onChange={setRadius}
        />

        <Pressable style={styles.button} onPress={handleChoose}>
          <Text style={styles.buttonText}>Scegli per me</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
  },
  panel: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e6e6e6',
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#111',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 24,
  },
  info: {
    fontSize: 16,
    textAlign: 'center',
  },
  sliderWrap: {
    width: '100%',
  },
  sliderTouchArea: {
    paddingVertical: 12,
  },
  sliderTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: '#ddd',
    justifyContent: 'center',
  },
  sliderFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 999,
    backgroundColor: '#111',
  },
  sliderThumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: '#111',
    top: -8,
  },
});
