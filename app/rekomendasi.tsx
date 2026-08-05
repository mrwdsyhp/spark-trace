import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants/colors";

type Rekomendasi = {
  id: string;
  riskScore: number;
  title: string;
  description: string;
  isDone: boolean;
};

const DUMMY_DATA: Rekomendasi[] = [
  { id: "1", riskScore: 76, title: "Kurangi beban listrik", description: "Terdeteksi penggunaan daya tinggi bersamaan pada satu jalur kabel", isDone: false },
  { id: "2", riskScore: 45, title: "Periksa sambungan kabel utama", description: "Fluktuasi arus terdeteksi pada beberapa siklus terakhir", isDone: false },
  { id: "3", riskScore: 20, title: "Jadwalkan pemeriksaan rutin", description: "Tidak ada anomali signifikan, disarankan pengecekan berkala", isDone: false },
];

export default function RekomendasiScreen() {
  const [items, setItems] = useState(DUMMY_DATA);

  const markDone = (id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, isDone: true } : i)));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Rekomendasi Mitigasi</Text>
        {items
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
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: "700", color: COLORS.black, marginBottom: 16 },
  card: { backgroundColor: "#F5F6F8", borderRadius: 14, padding: 14, marginBottom: 12 },
  riskBadge: { fontSize: 12, fontWeight: "700", color: COLORS.kritis, marginBottom: 4 },
  cardTitle: { fontSize: 15, fontWeight: "700", color: COLORS.black, marginBottom: 4 },
  cardDesc: { fontSize: 13, color: COLORS.textGray, marginBottom: 10 },
  doneButton: { backgroundColor: COLORS.primaryBlue, borderRadius: 10, paddingVertical: 8, alignItems: "center" },
  doneButtonDisabled: { backgroundColor: "#C6D4EE" },
  doneButtonText: { color: COLORS.white, fontWeight: "600", fontSize: 13 },
});