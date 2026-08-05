import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants/colors";

const DEVICE_INFO = {
  name: "Spark-Trace Guard v2.4",
  firmware: "v1.0.8-stable",
  ip: "192.168.1.104",
  online: true,
};

export default function Profil() {
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
            <Text style={styles.subtitle}>Jl. Kadipaten Kidul No. 12, Yogyakarta</Text>
          </View>
        </View>

        {/* Data Rumah */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Data Rumah</Text>
          <View style={styles.rowBetween}>
            <Text style={styles.label}>Alamat</Text>
            <Text style={styles.value}>Jl. Kadipaten Kidul No. 12</Text>
          </View>
          <View style={[styles.rowBetween, { marginTop: 8 }]}>
            <Text style={styles.label}>Jumlah Penghuni</Text>
            <Text style={styles.value}>4 orang</Text>
          </View>
        </View>

        {/* Perangkat Terpasang */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>Perangkat Terpasang</Text>
            <View style={styles.statusChip}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: DEVICE_INFO.online ? COLORS.aman : COLORS.textGray },
                ]}
              />
              <Text style={styles.statusChipText}>
                {DEVICE_INFO.online ? "Online" : "Offline"}
              </Text>
            </View>
          </View>

          <View style={[styles.rowBetween, { marginTop: 12 }]}>
            <Text style={styles.label}>Perangkat</Text>
            <Text style={styles.value}>{DEVICE_INFO.name}</Text>
          </View>
          <View style={[styles.rowBetween, { marginTop: 8 }]}>
            <Text style={styles.label}>Firmware</Text>
            <Text style={styles.value}>{DEVICE_INFO.firmware}</Text>
          </View>
          <View style={[styles.rowBetween, { marginTop: 8 }]}>
            <Text style={styles.label}>IP Address</Text>
            <Text style={styles.value}>{DEVICE_INFO.ip}</Text>
          </View>
        </View>

        {/* Menu */}
        <TouchableOpacity style={styles.menuItem}>
          <Feather name="key" size={18} color={COLORS.black} />
          <Text style={styles.menuText}>Ubah Password</Text>
          <Feather name="chevron-right" size={18} color={COLORS.textGray} style={{ marginLeft: "auto" }} />
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton}>
          <Feather name="log-out" size={18} color={COLORS.kritis} />
          <Text style={styles.logoutText}>Keluar</Text>
        </TouchableOpacity>
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

  statusChip: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: COLORS.white, borderRadius: 20,
    paddingHorizontal: 8, paddingVertical: 4,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusChipText: { fontSize: 11, fontWeight: "600", color: COLORS.black },

  menuItem: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#F5F6F8", borderRadius: 16,
    padding: 16, marginBottom: 12, gap: 12,
  },
  menuText: { fontSize: 14, fontWeight: "600", color: COLORS.black },

  logoutButton: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: COLORS.kritis,
    borderRadius: 16, padding: 14, gap: 8, marginTop: 8,
  },
  logoutText: { fontSize: 14, fontWeight: "700", color: COLORS.kritis },
});