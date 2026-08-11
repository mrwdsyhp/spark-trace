import { StyleSheet, Text, View } from "react-native";

type LegendItem = {
  label: string;
  color: string;
};

type FloatingLegendProps = {
  items: LegendItem[];
};

export default function FloatingLegend({ items }: FloatingLegendProps) {
  return (
    <View style={styles.capsule}>
      {items.map((item, i) => (
        <View key={item.label} style={styles.indicator}>
          <View style={[styles.dot, { backgroundColor: item.color }]} />
          <Text style={styles.label}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  capsule: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  indicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#444",
  },
});
