import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants/colors";
import { fetchAlerts, formatRelativeTime, type Alert } from "../utils/apiService";
import { getRegisteredHouse } from "../utils/houseStorage";

const ICON = {
  warning: { name: "alert-circle" as const, color: COLORS.waspada },
  danger: { name: "alert-triangle" as const, color: COLORS.kritis },
};

export default function Notifikasi() {
  const [alerts, setAlerts] = useState<Alert[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [registeredHouse, setRegisteredHouse] = useState<any>(null);

  useEffect(() => {
    // Load registered house info
    getRegisteredHouse().then(setRegisteredHouse);
    
    // Load alerts
    fetchAlerts()
      .then((data) => {
        setAlerts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn("❌ Gagal fetch /api/alerts:", err.message);
        setError("Gagal memuat peringatan. Pastikan server backend berjalan.");
        setLoading(false);
      });
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <Text style={styles.heading}>Riwayat Peringatan</Text>
      {registeredHouse && (
        <Text style={styles.subheading}>
          Rumah: {registeredHouse.name} ({registeredHouse.id})
        </Text>
      )}

      {loading && !error && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primaryBlue} />
        </View>
      )}

      {error && (
        <View style={styles.center}>
          <Feather name="wifi-off" size={32} color={COLORS.textGray} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {alerts && alerts.length === 0 && (
        <View style={styles.center}>
          <Feather name="check-circle" size={32} color={COLORS.aman} />
          <Text style={styles.emptyText}>Tidak ada peringatan aktif</Text>
        </View>
      )}

      {alerts && alerts.length > 0 && (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {alerts.map((item) => {
            const icon = ICON[item.type];

            return (
              <View key={item.id} style={styles.card}>
                <View style={[styles.iconWrap, { backgroundColor: icon.color + "1A" }]}>
                  <Feather name={icon.name} size={20} color={icon.color} />
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardText}>{item.description}</Text>
                  <Text style={styles.cardTime}>{formatRelativeTime(item.time)}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.white },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.black,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  subheading: {
    fontSize: 13,
    color: COLORS.textGray,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 13,
    color: COLORS.textGray,
    textAlign: "center",
    lineHeight: 19,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textGray,
  },

  card: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    alignItems: "flex-start",
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 2,
  },
  cardBody: { flex: 1 },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.black,
    marginBottom: 2,
  },
  cardText: {
    fontSize: 13,
    color: COLORS.black,
    lineHeight: 19,
    marginBottom: 4,
  },
  cardTime: {
    fontSize: 12,
    color: COLORS.textGray,
  },
});
