import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FloatingLegend from "../components/FloatingLegend";
import RiskMap from "../components/RiskMap";
import { COLORS } from "../constants/colors";

const LEGEND_ITEMS = [
  { label: "Rendah", color: "#00FF00" },
  { label: "Sedang", color: "#FFFF00" },
  { label: "Tinggi", color: "#FF0000" },
];

export default function PetaRisiko() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Peta Risiko</Text>
      </View>

      {/* Map + Floating Legend */}
      <View style={styles.mapWrapper}>
        <RiskMap />

        <View style={styles.legendOverlay}>
          <FloatingLegend items={LEGEND_ITEMS} />
        </View>
      </View>

      {/* Slim footer note */}
      <View style={styles.footer}>
        <Feather name="layers" size={13} color={COLORS.textGray} />
        <Text style={styles.note}>
          Heatmap kepadatan risiko per rumah — bobot warna mengikuti skor risiko tiap titik.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.white },

  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.black,
  },

  mapWrapper: {
    flex: 1,
    position: "relative",
  },

  legendOverlay: {
    position: "absolute",
    top: 16,
    alignSelf: "center",
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  note: {
    fontSize: 11,
    color: COLORS.textGray,
    flex: 1,
  },
});
