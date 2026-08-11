import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RekomendasiModal from "../components/RekomendasiModal";
import RiskMap from "../components/RiskMap";
import { COLORS, RiskStatus, STATUS_COLOR, STATUS_LABEL } from "../constants/colors";

export default function Index() {
  const router = useRouter();
  const [status] = useState<RiskStatus>("aman");
  const [riskScore] = useState(5);
  const [arus] = useState("5.2 A");
  const [daya] = useState("795 W");
  const [showRekomendasi, setShowRekomendasi] = useState(false);

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
            <Text style={styles.subtitle}>Waspada Selalu</Text>
          </View>
        </View>

        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusIconWrap}>
            <Feather name="shield" size={22} color={COLORS.black} />
          </View>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.statusText}>Status: {STATUS_LABEL[status]}</Text>
            <Text style={styles.riskText}>Skor Risiko: {riskScore}%</Text>
          </View>
          <View style={[styles.dot, { backgroundColor: STATUS_COLOR[status] }]} />
        </View>

        {/* Metric Cards */}
        <View style={styles.row}>
          <View style={styles.metricCard}>
            {/* Kelompok Kiri: Ikon dan Label */}
            <View style={styles.metricLeft}>
              <Feather name="zap" size={20} color={COLORS.black} />
              <Text style={styles.metricLabel}>Arus:</Text>
            </View>
            
            {/* Bagian Kanan: Nilai */}
            <Text style={styles.metricValue}>{arus}</Text>
          </View>
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

      <RekomendasiModal visible={showRekomendasi} onClose={() => setShowRekomendasi(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.white },
  container: { padding: 20, paddingBottom: 40 },
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

  row: { flexDirection: "row", gap: 12, marginBottom: 12 },
// -- BAGIAN YANG DIUBAH --
  metricCard: { 
    flex: 1, 
    flexDirection: "row", // Membuat elemen berbaris ke samping
    justifyContent: "space-between", // Mendorong bagian kiri dan kanan ke ujung
    alignItems: "center", // Memastikan teks dan ikon sejajar di tengah
    backgroundColor: COLORS.primaryBlue, 
    borderRadius: 16, 
    padding: 16 
  },
  metricLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8, // Memberi jarak antara ikon petir dan teks "Arus:"
  },
  metricLabel: { fontSize: 14, color: COLORS.black }, // Menghapus marginTop yang sebelumnya ada
  metricValue: { fontSize: 18, fontWeight: "700", color: COLORS.black },
  // -------------------------
  mapCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: COLORS.primaryBlue, borderRadius: 16,
    padding: 14, marginBottom: 12, height: 98,
  },

  actionCard: {
    flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8,
    backgroundColor: COLORS.primaryBlue, borderRadius: 16, padding: 16,
  },
  actionText: { fontSize: 14, fontWeight: "600", color: COLORS.black },
});