import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants/colors";

export default function Laporan() {
  const router = useRouter();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [deskripsi, setDeskripsi] = useState("");

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const hapusFoto = () => setImageUri(null);

  const handleKirim = () => {
    Alert.alert("Sukses", "Laporan berhasil disimpan!");
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading}>Laporan Lapangan</Text>

        {/* Area Foto */}
        <TouchableOpacity
          style={imageUri ? styles.photoBoxWithImage : styles.photoBoxEmpty}
          onPress={imageUri ? undefined : pickImage}
          activeOpacity={imageUri ? 1 : 0.7}
        >
          {imageUri ? (
            <>
              <Image source={{ uri: imageUri }} style={styles.photoPreview} />
              <TouchableOpacity style={styles.removeBtn} onPress={hapusFoto} hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                <Feather name="x" size={16} color={COLORS.white} />
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.photoPlaceholder}>
              <Feather name="camera" size={32} color={COLORS.textGray} />
              <Text style={styles.photoHint}>Ketuk untuk melampirkan foto</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Input Deskripsi */}
        <TextInput
          style={styles.textInput}
          placeholder="Deskripsikan masalah yang ditemukan di lapangan..."
          placeholderTextColor={COLORS.textGray}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={deskripsi}
          onChangeText={setDeskripsi}
        />

        {/* Tombol Kirim */}
        <TouchableOpacity style={styles.submitButton} onPress={handleKirim} activeOpacity={0.85}>
          <Text style={styles.submitText}>Kirim Laporan</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.white },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 60 },

  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.black,
    marginBottom: 20,
  },

  // Foto — empty state
  photoBoxEmpty: {
    height: 200,
    borderRadius: 14,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: COLORS.textGray,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    backgroundColor: "#FAFAFA",
  },
  photoPlaceholder: { alignItems: "center", gap: 10 },
  photoHint: { fontSize: 14, color: COLORS.textGray },

  // Foto — filled state
  photoBoxWithImage: {
    height: 200,
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 20,
  },
  photoPreview: {
    width: "100%",
    height: "100%",
    borderRadius: 14,
  },
  removeBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },

  // Input teks
  textInput: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    fontSize: 14,
    color: COLORS.black,
    lineHeight: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },

  // Tombol kirim
  submitButton: {
    backgroundColor: COLORS.primaryBlue,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  submitText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },
});
