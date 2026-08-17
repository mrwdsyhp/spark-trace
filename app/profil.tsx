import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants/colors";
import { getRegisteredHouse } from "../utils/houseStorage";

export default function Profil() {
  const router = useRouter();
  const [registeredHouse, setRegisteredHouse] = useState<any>(null);

  useEffect(() => {
    getRegisteredHouse().then(setRegisteredHouse);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Feather name="user" size={26} color={COLORS.black} />
          </View>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.name}>Fathur</Text>
            <Text style={styles.subtitle}>
              {registeredHouse ? registeredHouse.address : "Jl. Kadipaten Kidul No. 12, Yogyakarta"}
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/pengaturan")}>
          <Feather name="settings" size={18} color={COLORS.black} />
          <Text style={styles.menuText}>Pengaturan Rumah</Text>
          <Feather name="chevron-right" size={18} color={COLORS.textGray} style={{ marginLeft: "auto" }} />
        </TouchableOpacity>

        {/* Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Mode Monitoring</Text>
          <Text style={styles.value}>Single-House Monitoring</Text>
          <Text style={styles.subtitle}>
            {registeredHouse ? `Rumah: ${registeredHouse.name} (${registeredHouse.id})` : "Belum ada rumah terdaftar"}
          </Text>
        </View>

        {/* App Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Informasi Aplikasi</Text>
          <View style={styles.rowBetween}>
            <Text style={styles.label}>Versi</Text>
            <Text style={styles.value}>1.0.0</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.white },
  container: { padding: 20 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  avatar: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: COLORS.bgLight,
    alignItems: "center", justifyContent: "center",
  },
  name: { fontSize: 18, fontWeight: "700", color: COLORS.black },
  subtitle: { fontSize: 12, color: COLORS.textGray, marginTop: 2, maxWidth: 220 },

  card: {
    backgroundColor: "#F5F6F8",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: { fontSize: 14, fontWeight: "700", color: COLORS.black },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  label: { fontSize: 13, color: COLORS.textGray },
  value: { fontSize: 13, fontWeight: "600", color: COLORS.black },

  menuItem: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#F5F6F8", borderRadius: 16,
    padding: 16, marginBottom: 12, gap: 12,
  },
  menuText: { fontSize: 14, fontWeight: "600", color: COLORS.black },
});