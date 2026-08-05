import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Notifikasi() {
  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>Peringatan Dini</Text>
      {/* Nanti diisi list notifikasi sesuai spesifikasi A4 */}
    </SafeAreaView>
  );
}