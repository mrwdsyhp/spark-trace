import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants/colors";
import { saveRegisteredHouse, type RegisteredHouse } from "../utils/houseStorage";
import { validateHouseId } from "../utils/apiService";

export default function RegistrasiRumah() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [houseId, setHouseId] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [powerCapacity, setPowerCapacity] = useState("");
  const [profile, setProfile] = useState("residential");

  const handleRegister = async () => {
    // Validation
    if (!houseId.trim() || !name.trim() || !address.trim()) {
      Alert.alert("Error", "Mohon lengkapi semua field wajib");
      return;
    }

    if (!latitude.trim() || !longitude.trim()) {
      Alert.alert("Error", "Mohon lengkapi koordinat lokasi");
      return;
    }

    if (!powerCapacity.trim()) {
      Alert.alert("Error", "Mohon masukkan daya listrik");
      return;
    }

    setLoading(true);

    try {
      // Validate house ID exists in database
      const isValid = await validateHouseId(houseId.trim());
      if (!isValid) {
        Alert.alert("Error", "ID Rumah tidak ditemukan di database. Pastikan ID benar.");
        setLoading(false);
        return;
      }

      const houseData: RegisteredHouse = {
        id: houseId.trim(),
        name: name.trim(),
        address: address.trim(),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        powerCapacity: parseFloat(powerCapacity),
        profile: profile,
      };

      await saveRegisteredHouse(houseData);
      
      Alert.alert(
        "Berhasil",
        "Rumah berhasil didaftarkan sebagai rumah utama",
        [
          {
            text: "OK",
            onPress: () => router.replace("/"),
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Gagal menyimpan data rumah");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={COLORS.black} />
          </TouchableOpacity>
          <Text style={styles.title}>Registrasi Rumah</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.subtitle}>
            Daftarkan rumah Anda untuk memulai monitoring kelistrikan
          </Text>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>ID Rumah *</Text>
              <TextInput
                style={styles.input}
                placeholder="Contoh: H004"
                value={houseId}
                onChangeText={setHouseId}
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nama Rumah *</Text>
              <TextInput
                style={styles.input}
                placeholder="Contoh: Rumah Keluarga"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Alamat *</Text>
              <TextInput
                style={styles.input}
                placeholder="Alamat lengkap"
                value={address}
                onChangeText={setAddress}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.half]}>
                <Text style={styles.label}>Latitude *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="-7.7956"
                  value={latitude}
                  onChangeText={setLatitude}
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={[styles.inputGroup, styles.half]}>
                <Text style={styles.label}>Longitude *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="110.3695"
                  value={longitude}
                  onChangeText={setLongitude}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Daya Listrik (VA) *</Text>
              <TextInput
                style={styles.input}
                placeholder="Contoh: 2200"
                value={powerCapacity}
                onChangeText={setPowerCapacity}
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Profil Rumah</Text>
              <TextInput
                style={styles.input}
                placeholder="residential"
                value={profile}
                onChangeText={setProfile}
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={[styles.registerButton, loading && styles.registerButtonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.registerButtonText}>Daftarkan Rumah</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.white },
  container: { flexGrow: 1 },
  
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  backButton: { marginRight: 12 },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.black,
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textGray,
    marginBottom: 24,
    textAlign: "center",
  },

  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  half: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.black,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.black,
    backgroundColor: COLORS.white,
  },

  registerButton: {
    backgroundColor: COLORS.primaryBlue,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  registerButtonDisabled: {
    backgroundColor: "#C6D4EE",
  },
  registerButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
});