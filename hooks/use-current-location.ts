import * as Location from 'expo-location';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import type { Region } from 'react-native-maps';

export type Coordinates = {
  latitude: number;
  longitude: number;
};

type UseCurrentLocationResult = {
  center: Coordinates | null;
  setCenter: Dispatch<SetStateAction<Coordinates | null>>;
  region: Region | undefined;
  loading: boolean;
  errorMessage: string | null;
};

const DEFAULT_DELTA = 0.04;

export function useCurrentLocation(): UseCurrentLocationResult {
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

        const nextCenter: Coordinates = {
          latitude: current.coords.latitude,
          longitude: current.coords.longitude,
        };

        setCenter(nextCenter);
        setRegion({
          ...nextCenter,
          latitudeDelta: DEFAULT_DELTA,
          longitudeDelta: DEFAULT_DELTA,
        });
      } catch {
        setErrorMessage('Errore nel recupero della posizione.');
      } finally {
        setLoading(false);
      }
    }

    void initLocation();
  }, []);

  return {
    center,
    setCenter,
    region,
    loading,
    errorMessage,
  };
}
