import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants/colors";
import { fetchMitigation } from "../utils/apiService";
import { getRegisteredHouse } from "../utils/houseStorage";

type Rekomendasi = {
  id: string;
  riskScore: number;
  title: string;
  description: string;
  isDone: boolean;
};

export default function RekomendasiScreen() {
  const [items, setItems] = useState<Rekomendasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registeredHouse, setRegisteredHouse] = useState<any>(null);

  useEffect(() => {
    // Load registered house info
    getRegisteredHouse().then(setRegisteredHouse);
    
    // Load mitigation data
    fetchMitigation()
      .then((data) => {
        if (data) {
          // Handle new API response format
          if (data.mitigations && data.mitigations.length > 0) {
            setItems(
              data.mitigations.map((mitigation: any, i: number) => ({
                id: String(mitigation.id),
                riskScore: data.riskScore,
                title: mitigation.title,
                description: mitigation.description || `Prioritas ${mitigation.priority} — ${mitigation.riskLevel}`,
                isDone: mitigation.status === 'completed',
              }))
            );
          } else if (data.recommendations) {
            // Handle fallback format
            setItems(
              data.recommendations.map((rec: string, i: number) => ({
                id: String(i),
                riskScore: data.riskScore,
                title: rec,
                description: `Prioritas untuk Node ${data.worstNode} — skor risiko tertinggi`,
                isDone: false,
              }))
            );
          }
        }
      })
      .catch((err) => {
        console.warn("❌ Gagal fetch /api/mitigations:", err.message);
        setError("Gagal memuat rekomendasi. Pastikan server backend berjalan.");
      })
      .finally(() => setLoading(false));
  }, []);

  const markDone = (id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, isDone: true } : i)));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Rekomendasi Mitigasi</Text>
        {registeredHouse && (
          <Text style={styles.subtitle}>
            Rumah: {registeredHouse.name} ({registeredHouse.id})
          </Text>
        )}

        {loading && (
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

        {!loading && !error && items.length === 0 && (
          <View style={styles.center}>
            <Feather name="check-circle" size={32} color={COLORS.aman} />
            <Text style={styles.errorText}>Belum ada rekomendasi untuk ditampilkan</Text>
          </View>
        )}

        {!loading &&
          !error &&
          [...items]
            .sort((a, b) => b.riskScore - a.riskScore)
            .map((item) => (
              <View key={item.id} style={styles.card}>
                <Text style={styles.riskBadge}>Risk {item.riskScore}%</Text>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDesc}>{item.description}</Text>
                <TouchableOpacity
                  style={[styles.doneButton, item.isDone && styles.doneButtonDisabled]}
                  onPress={() => markDone(item.id)}
                  disabled={item.isDone}
                >
                  <Text style={styles.doneButtonText}>
                    {item.isDone ? "Selesai" : "Tandai selesai"}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flexGrow: 1 },
  title: { fontSize: 20, fontWeight: "700", color: COLORS.black, marginBottom: 8 },
  subtitle: { fontSize: 13, color: COLORS.textGray, marginBottom: 16 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 60,
  },
  errorText: {
    fontSize: 13,
    color: COLORS.textGray,
    textAlign: "center",
    lineHeight: 19,
  },
  card: { backgroundColor: "#F5F6F8", borderRadius: 14, padding: 14, marginBottom: 12 },
  riskBadge: { fontSize: 12, fontWeight: "700", color: COLORS.kritis, marginBottom: 4 },
  cardTitle: { fontSize: 15, fontWeight: "700", color: COLORS.black, marginBottom: 4 },
  cardDesc: { fontSize: 13, color: COLORS.textGray, marginBottom: 10 },
  doneButton: { backgroundColor: COLORS.primaryBlue, borderRadius: 10, paddingVertical: 8, alignItems: "center" },
  doneButtonDisabled: { backgroundColor: "#C6D4EE" },
  doneButtonText: { color: COLORS.white, fontWeight: "600", fontSize: 13 },
});
