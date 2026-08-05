import { SafeAreaView } from "react-native-safe-area-context";
import RiskMap from "../components/RiskMap";

export default function PetaRisiko() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <RiskMap />
    </SafeAreaView>
  );
}