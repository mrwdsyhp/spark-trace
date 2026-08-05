import MapView, { UrlTile } from "react-native-maps";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type RiskMapProps = {
  preview?: boolean;
  onPress?: () => void;
};

const YOGYAKARTA_REGION = {
  latitude: -7.7956,
  longitude: 110.3695,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function RiskMap({ preview = false, onPress }: RiskMapProps) {
  const mapContent = (
    <View style={preview ? styles.previewWrap : styles.fullWrap}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={YOGYAKARTA_REGION}
        // omit provider or leave undefined to use the default provider
        // provider prop removed to satisfy TypeScript (null is not assignable)
        scrollEnabled={!preview}
        zoomEnabled={!preview}
        rotateEnabled={!preview}
        pitchEnabled={!preview}
        pointerEvents={preview ? "none" : "auto"}
      >
        <UrlTile
          urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
        />
      </MapView>
      <Text style={styles.attribution}>© OpenStreetMap contributors</Text>
    </View>
  );

  if (preview) {
    return (
      <TouchableOpacity style={{ flex: 1 }} onPress={onPress} activeOpacity={0.8}>
        {mapContent}
      </TouchableOpacity>
    );
  }

  return mapContent;
}

const styles = StyleSheet.create({
  previewWrap: {
    height: 70,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#DCE3EE",
  },
  fullWrap: {
    flex: 1,
    backgroundColor: "#DCE3EE",
  },
  attribution: {
    position: "absolute",
    bottom: 2,
    right: 4,
    fontSize: 8,
    color: "#333",
    backgroundColor: "rgba(255,255,255,0.6)",
    paddingHorizontal: 3,
  },
});