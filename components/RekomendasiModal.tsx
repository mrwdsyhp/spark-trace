import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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

export default function RekomendasiModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [items, setItems] = useState(DUMMY_DATA);

  const markDone = (id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, isDone: true } : i)));
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Rekomendasi Mitigasi</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={22} color={COLORS.black} />
            </TouchableOpacity>
          </View>
          <ScrollView>
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
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  sheet: { backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: "75%" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  title: { fontSize: 18, fontWeight: "700", color: COLORS.black },
  card: { backgroundColor: "#F5F6F8", borderRadius: 14, padding: 14, marginBottom: 12 },
  riskBadge: { fontSize: 12, fontWeight: "700", color: COLORS.kritis, marginBottom: 4 },
  cardTitle: { fontSize: 15, fontWeight: "700", color: COLORS.black, marginBottom: 4 },
  cardDesc: { fontSize: 13, color: COLORS.textGray, marginBottom: 10 },
  doneButton: { backgroundColor: COLORS.primaryBlue, borderRadius: 10, paddingVertical: 8, alignItems: "center" },
  doneButtonDisabled: { backgroundColor: "#C6D4EE" },
  doneButtonText: { color: COLORS.white, fontWeight: "600", fontSize: 13 },
});