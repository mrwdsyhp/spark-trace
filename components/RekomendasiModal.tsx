import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../constants/colors";

type Rekomendasi = {
  id: string;
  riskScore: number;
  title: string;
  description: string;
  isDone: boolean;
};

export default function RekomendasiModal({
  visible,
  onClose,
  items,
}: {
  visible: boolean;
  onClose: () => void;
  /** Rekomendasi dari /api/mitigations (di-map oleh index.tsx). */
  items: Rekomendasi[];
}) {
  // Salin ke state lokal supaya tombol "Tandai selesai" bisa di-toggle.
  const [localItems, setLocalItems] = useState<Rekomendasi[]>(items);

  // Sinkronkan saat data backend berubah / modal dibuka ulang.
  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const markDone = (id: string) => {
    setLocalItems((prev) => prev.map((i) => (i.id === id ? { ...i, isDone: true } : i)));
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
            {[...localItems]
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