import { Feather } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants/colors";

type Peringatan = {
  id: string;
  pesan: string;
  waktu: string;
  level: "waspada" | "kritis";
};

const MOCK_PERINGATAN: Peringatan[] = [
  {
    id: "w-1",
    pesan: "Arus melebihi batas aman di Node A — terdeteksi lonjakan 8.2 A pada jalur utama Jl. Malioboro.",
    waktu: "10 menit lalu",
    level: "kritis",
  },
  {
    id: "w-2",
    pesan: "Koneksi sensor terputus di Node C (Kotabaru). Data tidak diterima sejak 30 menit terakhir.",
    waktu: "32 menit lalu",
    level: "kritis",
  },
  {
    id: "w-3",
    pesan: "Fluktuasi tegangan terdeteksi di Node B. Tegangan turun ke 198 V selama 5 detik.",
    waktu: "1 jam lalu",
    level: "waspada",
  },
  {
    id: "w-4",
    pesan: "Suhu kabel di Node D melebihi ambang normal (62 °C). Pantau secara berkala.",
    waktu: "3 jam lalu",
    level: "waspada",
  },
  {
    id: "w-5",
    pesan: "Pemeliharaan rutin Node E dijadwalkan besok pukul 09.00–12.00 WIB.",
    waktu: "Kemarin, 14:30",
    level: "waspada",
  },
];

const ICON = {
  waspada: { name: "alert-circle" as const, color: COLORS.waspada },
  kritis: { name: "alert-triangle" as const, color: COLORS.kritis },
};

export default function Notifikasi() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <Text style={styles.heading}>Riwayat Peringatan</Text>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_PERINGATAN.map((item) => {
          const icon = ICON[item.level];

          return (
            <View key={item.id} style={styles.card}>
              <View style={[styles.iconWrap, { backgroundColor: icon.color + "1A" }]}>
                <Feather name={icon.name} size={20} color={icon.color} />
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardText}>{item.pesan}</Text>
                <Text style={styles.cardTime}>{item.waktu}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
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
    paddingBottom: 16,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },

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
  cardText: {
    fontSize: 14,
    color: COLORS.black,
    lineHeight: 20,
    marginBottom: 4,
  },
  cardTime: {
    fontSize: 12,
    color: COLORS.textGray,
  },
});
