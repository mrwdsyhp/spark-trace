import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants/colors";
import {
  clearRegisteredHouse,
  getRegisteredHouse,
  type RegisteredHouse,
} from "../utils/houseStorage";

export default function Pengaturan() {
  const router = useRouter();
  const [registeredHouse, setRegisteredHouse] = useState<RegisteredHouse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRegisteredHouse();
  }, []);

  const loadRegisteredHouse = async () => {
    try {
      const house = await getRegisteredHouse();
      setRegisteredHouse(house);
    } catch (error) {
      console.error("Failed to load registered house:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeHouse = () => {
    Alert.alert(
      "Ganti Rumah",
      "Anda akan diarahkan ke halaman registrasi untuk mendaftarkan rumah baru. Rumah saat ini akan dihapus dari monitoring.",
      [
        {
          text: "Batal",
          style: "cancel",
        },
        {
          text: "Lanjut",
          onPress: async () => {
            try {
              await clearRegisteredHouse();
              router.replace("/registrasi");
            } catch (error) {
              Alert.alert("Error", "Gagal mengganti rumah");
              console.error(error);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.center}>
          <Text style={styles.loadingText}>Memuat data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Pengaturan</Text>

        {/* Registered House Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rumah Terdaftar</Text>
          
          {registeredHouse ? (
            <View style={styles.houseCard}>
              <View style={styles.houseHeader}>
                <Feather name="home" size={24} color={COLORS.primaryBlue} />
                <Text style={styles.houseName}>{registeredHouse.name}</Text>
              </View>
              
              <View style={styles.houseDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>ID Rumah:</Text>
                  <Text style={styles.detailValue}>{registeredHouse.id}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Alamat:</Text>
                  <Text style={styles.detailValue}>{registeredHouse.address}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Koordinat:</Text>
                  <Text style={styles.detailValue}>
                    {registeredHouse.latitude.toFixed(4)}, {registeredHouse.longitude.toFixed(4)}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Daya Listrik:</Text>
                  <Text style={styles.detailValue}>{registeredHouse.powerCapacity} VA</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Profil:</Text>
                  <Text style={styles.detailValue}>{registeredHouse.profile}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.changeButton}
                onPress={handleChangeHouse}
              >
                <Feather name="refresh-cw" size={18} color={COLORS.white} />
                <Text style={styles.changeButtonText}>Ganti Rumah</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.noHouseCard}>
              <Feather name="home" size={32} color={COLORS.textGray} />
              <Text style={styles.noHouseText}>Belum ada rumah terdaftar</Text>
              <TouchableOpacity
                style={styles.registerButton}
                onPress={() => router.push("/registrasi")}
              >
                <Text style={styles.registerButtonText}>Daftarkan Rumah</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* App Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informasi Aplikasi</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Versi:</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mode:</Text>
              <Text style={styles.infoValue}>Single-House Monitoring</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.white },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.textGray,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.black,
    marginBottom: 24,
  },
  
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.black,
    marginBottom: 12,
  },

  houseCard: {
    backgroundColor: "#F5F6F8",
    borderRadius: 16,
    padding: 16,
  },
  houseHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  houseName: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.black,
    marginLeft: 12,
  },
  houseDetails: {
    gap: 12,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.textGray,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.black,
  },
  changeButton: {
    backgroundColor: COLORS.primaryBlue,
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  changeButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
  },

  noHouseCard: {
    backgroundColor: "#F5F6F8",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    gap: 12,
  },
  noHouseText: {
    fontSize: 14,
    color: COLORS.textGray,
  },
  registerButton: {
    backgroundColor: COLORS.primaryBlue,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  registerButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
  },

  infoCard: {
    backgroundColor: "#F5F6F8",
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.textGray,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.black,
  },
});