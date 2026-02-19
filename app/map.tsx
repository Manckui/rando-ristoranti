import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Circle, MapPressEvent, Marker } from 'react-native-maps';

import { RadiusControl } from '@/components/map/radius-control';
import { PrimaryButton } from '@/components/ui/primary-button';
import { ScreenState } from '@/components/ui/screen-state';
import { useCurrentLocation } from '@/hooks/use-current-location';

const MIN_RADIUS = 200;
const MAX_RADIUS = 3000;
const STEP = 100;

export default function MapScreen() {
  const [radius, setRadius] = useState(1000);
  const { center, setCenter, region, loading, errorMessage } = useCurrentLocation();

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
    return <ScreenState loading message="Recupero posizione..." />;
  }

  if (!center || !region) {
    return <ScreenState message={errorMessage ?? 'Posizione non disponibile.'} />;
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
        <RadiusControl
          radius={radius}
          min={MIN_RADIUS}
          max={MAX_RADIUS}
          step={STEP}
          onChange={setRadius}
        />
        <PrimaryButton title="Scegli per me" onPress={handleChoose} />
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
});
