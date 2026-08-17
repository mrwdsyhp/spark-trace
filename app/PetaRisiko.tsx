import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FloatingLegend from "../components/FloatingLegend";
import RiskMap from "../components/RiskMap";
import { COLORS } from "../constants/colors";
import { fetchAlerts, formatRelativeTime, type Alert } from "../utils/apiService";
import { getRegisteredHouse } from "../utils/houseStorage";

const LEGEND_ITEMS = [
  { label: "Rendah", color: "#00FF00" },
  { label: "Sedang", color: "#FFFF00" },
  { label: "Tinggi", color: "#FF0000" },
];

export default function PetaRisiko() {
  const router = useRouter();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [alertsLoading, setAlertsLoading] = useState(true);
  const [alertsError, setAlertsError] = useState<string | null>(null);
  const [registeredHouse, setRegisteredHouse] = useState<any>(null);

  useEffect(() => {
    // Load registered house info
    getRegisteredHouse().then(setRegisteredHouse);
    
    // Load alerts for registered house
    let cancelled = false;

    fetchAlerts()
      .then((data) => {
        if (cancelled) return;
        setAlerts(data);
      })
      .catch((err) => {
        if (cancelled) return;
        console.warn("❌ Gagal fetch /api/alerts:", err.message);
        setAlertsError("Gagal memuat peringatan dini. Pastikan server backend berjalan.");
      })
      .finally(() => {
        if (!cancelled) setAlertsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const topAlert = alerts[0];

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Peta Risiko</Text>
        {registeredHouse && (
          <Text style={styles.subtitle}>
            {registeredHouse.name} ({registeredHouse.id})
          </Text>
        )}
      </View>

      {/* Map + Floating Legend */}
      <View style={styles.mapWrapper}>
        <RiskMap />

        <View style={styles.legendOverlay}>
          <FloatingLegend items={LEGEND_ITEMS} />
        </View>

        {/* Peringatan Dini — banner dari /api/alerts */}
        {!alertsLoading && !alertsError && topAlert && (
          <TouchableOpacity
            style={[
              styles.alertBanner,
              { backgroundColor: topAlert.type === "danger" ? COLORS.kritis : COLORS.waspada },
            ]}
            onPress={() => router.push("/notifikasi")}
            activeOpacity={0.9}
          >
            <Feather name="alert-triangle" size={18} color={COLORS.white} />
            <View style={styles.alertBody}>
              <Text style={styles.alertTitle} numberOfLines={1}>
                {topAlert.title}
              </Text>
              <Text style={styles.alertMeta}>
                {alerts.length} peringatan aktif · {formatRelativeTime(topAlert.time)}
              </Text>
            </View>
            <Feather name="chevron-right" size={18} color={COLORS.white} />
          </TouchableOpacity>
        )}
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
  subtitle: {
    fontSize: 13,
    color: COLORS.textGray,
    marginTop: 2,
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

  alertBanner: {
    position: "absolute",
    bottom: 16,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  alertBody: { flex: 1 },
  alertTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.white,
  },
  alertMeta: {
    fontSize: 11,
    color: "rgba(255,255,255,0.85)",
    marginTop: 2,
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
