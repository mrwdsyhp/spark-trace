import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RekomendasiModal from "../components/RekomendasiModal";
import RiskMap from "../components/RiskMap";
import FloatingNotification from "../components/FloatingNotification";
import { COLORS, RiskStatus, STATUS_COLOR, STATUS_LABEL } from "../constants/colors";
import { fetchAlerts, fetchMitigation, fetchSensorData, formatRelativeTime, type Alert, type Mitigation, type SensorData } from "../utils/apiService";
import { getRegisteredHouse, isHouseRegistered } from "../utils/houseStorage";

type RekomendasiItem = {
  id: string;
  riskScore: number;
  title: string;
  description: string;
  isDone: boolean;
};

export default function Index() {
  const router = useRouter();
  const [showRekomendasi, setShowRekomendasi] = useState(false);
  const [loading, setLoading] = useState(true);
  const [houseRegistered, setHouseRegistered] = useState(false);
  const [showFloatingNotification, setShowFloatingNotification] = useState(false);

  // Data dari backend (Peringatan Dini & Mitigasi)
  const [status, setStatus] = useState<RiskStatus>("aman");
  const [riskScore, setRiskScore] = useState<number>(0);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [mitigation, setMitigation] = useState<Mitigation | null>(null);
  
  // Data sensor - hanya arus/current
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [registeredHouse, setRegisteredHouse] = useState<any>(null);

  useEffect(() => {
    // Check if house is registered
    isHouseRegistered().then((registered) => {
      if (!registered) {
        router.replace("/registrasi");
      } else {
        setHouseRegistered(true);
        loadRegisteredHouse();
      }
    });
  }, []);

  const loadRegisteredHouse = async () => {
    try {
      const house = await getRegisteredHouse();
      setRegisteredHouse(house);
      setLoading(false);
      
      // Load monitoring data
      loadMonitoringData();
    } catch (error) {
      console.error("Failed to load registered house:", error);
      router.replace("/registrasi");
    }
  };

  const loadMonitoringData = () => {
    // Load mitigation data
    fetchMitigation()
      .then((data) => {
        if (data) {
          // Handle new API response format with mitigations array
          if (data.mitigations && data.mitigations.length > 0) {
            setMitigation({
              worstNode: data.houseId || registeredHouse?.id || "Unknown",
              riskScore: data.riskScore || 0,
              recommendations: data.mitigations.map(m => m.title)
            });
            setRiskScore(data.riskScore || 0);
            setStatus(data.riskLevel || "aman");
          } else if (data.recommendations) {
            // Handle fallback format
            setMitigation(data);
            setRiskScore(data.riskScore || 0);
            setStatus(data.riskLevel || "aman");
          } else {
            // Handle simple format without recommendations
            setMitigation({
              worstNode: data.houseId || registeredHouse?.id || "Unknown",
              riskScore: data.riskScore || 0,
              recommendations: data.recommendations || []
            });
            setRiskScore(data.riskScore || 0);
            setStatus(data.riskLevel || "aman");
          }
        }
      })
      .catch((err) => console.warn("❌ Gagal fetch /api/mitigations:", err.message));

    // Load alerts
    fetchAlerts()
      .then((data) => {
        setAlerts(data);
        // Show floating notification if there are critical alerts
        if (data && data.length > 0 && data[0].severity === 'critical') {
          setShowFloatingNotification(true);
        }
      })
      .catch((err) => console.warn("❌ Gagal fetch /api/alerts:", err.message));

    // Load sensor data (hanya arus)
    fetchSensorData()
      .then(setSensorData)
      .catch((err) => console.warn("❌ Gagal fetch /api/sensor:", err.message));
  };

  const mitigationItems: RekomendasiItem[] = mitigation
    ? mitigation.recommendations.map((rec, i) => ({
        id: String(i),
        riskScore: mitigation.riskScore,
        title: rec,
        description: `Prioritas untuk Node ${mitigation.worstNode} — skor risiko tertinggi`,
        isDone: false,
      }))
    : [];

  const topAlert = alerts[0];

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primaryBlue} />
          <Text style={styles.loadingText}>Memuat data rumah...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Feather name="user" size={20} color={COLORS.black} />
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.name}>Halo Fathur</Text>
            <Text style={styles.subtitle}>{registeredHouse?.name || "Waspada Selalu"}</Text>
          </View>
        </View>

        {/* Status Card — ketuk untuk membuka rekomendasi mitigasi */}
        <TouchableOpacity
          style={styles.statusCard}
          onPress={() => setShowRekomendasi(true)}
          activeOpacity={0.85}
        >
          <View style={styles.statusIconWrap}>
            <Feather name="shield" size={22} color={COLORS.black} />
          </View>
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.statusText}>Status: {STATUS_LABEL[status]}</Text>
            <Text style={styles.riskText}>
              Skor Risiko: {riskScore !== null && riskScore !== undefined ? `${riskScore}%` : "—"} · Ketuk untuk mitigasi
            </Text>
          </View>
          <View style={[styles.dot, { backgroundColor: STATUS_COLOR[status] }]} />
        </TouchableOpacity>

        {/* Peringatan Dini — ringkasan dari /api/alerts */}
        {topAlert && (
          <TouchableOpacity
            style={styles.alertCard}
            onPress={() => router.push("/notifikasi")}
            activeOpacity={0.85}
          >
            <Feather
              name="alert-triangle"
              size={20}
              color={topAlert.type === "danger" ? COLORS.kritis : COLORS.waspada}
            />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={styles.alertTitle}>{topAlert.title}</Text>
              <Text style={styles.alertDesc} numberOfLines={1}>
                {topAlert.message || topAlert.description}
              </Text>
              <Text style={styles.alertMeta}>
                {alerts.length} peringatan aktif · {formatRelativeTime(topAlert.time)}
              </Text>
            </View>
            <Feather name="chevron-right" size={18} color={COLORS.textGray} />
          </TouchableOpacity>
        )}

        {/* Single Metric Card - Arus Only */}
        <View style={styles.metricCard}>
          <View style={styles.metricLeft}>
            <Feather name="zap" size={24} color={COLORS.black} />
            <Text style={styles.metricLabel}>Arus Listrik</Text>
          </View>
          <Text style={styles.metricValue}>
            {sensorData && sensorData.current != null ? `${Number(sensorData.current).toFixed(2)} A` : "—"}
          </Text>
        </View>
        
        {/* Map Card */}
        <TouchableOpacity
          style={styles.mapCard}
          onPress={() => router.push("/PetaRisiko")}
          activeOpacity={0.85}
        >
          <Feather name="map" size={22} color={COLORS.black} style={{ marginRight: 10 }} />
          <RiskMap preview onPress={() => router.push("/PetaRisiko")} />
        </TouchableOpacity>

        {/* Action Cards */}
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push("/laporan")}
          >
            <Feather name="camera" size={20} color={COLORS.black} />
            <Text style={styles.actionText}>Laporan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push("/notifikasi")}
          >
            <Feather name="alert-triangle" size={20} color={COLORS.black} />
            <Text style={styles.actionText}>Peringatan</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <RekomendasiModal
        visible={showRekomendasi}
        onClose={() => setShowRekomendasi(false)}
        items={mitigationItems}
      />

      <FloatingNotification
        visible={showFloatingNotification}
        onDismiss={() => setShowFloatingNotification(false)}
        onPress={() => {
          setShowFloatingNotification(false);
          router.push("/notifikasi");
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.white },
  container: { padding: 20, paddingBottom: 40 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.textGray,
  },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.bgLight, alignItems: "center", justifyContent: "center" },
  name: { fontSize: 18, fontWeight: "700", color: COLORS.black },
  subtitle: { fontSize: 13, color: COLORS.textGray, marginTop: 2 },

  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 18,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  statusIconWrap: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: COLORS.white,
    borderWidth: 1, borderColor: "#EEE",
    alignItems: "center", justifyContent: "center",
  },
  statusText: { fontSize: 20, fontWeight: "700", color: COLORS.black },
  riskText: { fontSize: 13, color: COLORS.textGray, marginTop: 2 },
  dot: { width: 10, height: 10, borderRadius: 5, marginLeft: "auto" },

  alertCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.kritis,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  alertTitle: { fontSize: 14, fontWeight: "700", color: COLORS.black },
  alertDesc: { fontSize: 12, color: COLORS.textGray, marginTop: 2 },
  alertMeta: { fontSize: 11, color: COLORS.textGray, marginTop: 4 },

  // Single metric card - full width
  metricCard: { 
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.primaryBlue, 
    borderRadius: 16, 
    padding: 20,
    marginBottom: 12,
  },
  metricLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  metricLabel: { fontSize: 16, fontWeight: "600", color: COLORS.black },
  metricValue: { fontSize: 24, fontWeight: "700", color: COLORS.black },

  mapCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: COLORS.primaryBlue, borderRadius: 16,
    padding: 14, marginBottom: 12, height: 98,
  },

  row: { flexDirection: "row", gap: 12, marginBottom: 12 },
  actionCard: {
    flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8,
    backgroundColor: COLORS.primaryBlue, borderRadius: 16, padding: 16,
  },
  actionText: { fontSize: 14, fontWeight: "600", color: COLORS.black },
});