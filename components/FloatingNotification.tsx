import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
  runOnJS,
} from "react-native-reanimated";
import { COLORS } from "../constants/colors";
import { fetchAlerts, formatRelativeTime, type Alert } from "../utils/apiService";
import { getRegisteredHouse } from "../utils/houseStorage";

interface FloatingNotificationProps {
  visible: boolean;
  onDismiss: () => void;
  onPress?: () => void;
}

export default function FloatingNotification({
  visible,
  onDismiss,
  onPress,
}: FloatingNotificationProps) {
  const [alert, setAlert] = useState<Alert | null>(null);
  const [registeredHouse, setRegisteredHouse] = useState<any>(null);
  
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Load registered house info
      getRegisteredHouse().then(setRegisteredHouse);
      
      // Load alerts for registered house
      fetchAlerts().then((alerts) => {
        if (alerts && alerts.length > 0) {
          setAlert(alerts[0]);
        }
      });

      // Animate in
      translateY.value = withSpring(0, { damping: 15 });
      opacity.value = withSpring(1, { damping: 15 });
    } else {
      // Animate out
      translateY.value = withSpring(-100, { damping: 15 });
      opacity.value = withSpring(0, { damping: 15 });
    }
  }, [visible]);

  const handleDismiss = () => {
    translateY.value = withSequence(
      withSpring(-100, { damping: 15 }),
      withDelay(300, withSpring(0))
    );
    opacity.value = withSequence(
      withSpring(0, { damping: 15 }),
      withDelay(300, withSpring(1))
    );
    setTimeout(() => {
      runOnJS(onDismiss)();
    }, 300);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!visible || !alert || !registeredHouse) {
    return null;
  }

  const isDanger = alert.severity === "critical" || alert.severity === "high";
  const bgColor = isDanger ? COLORS.kritis : COLORS.waspada;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <TouchableOpacity
        style={[styles.notification, { backgroundColor: bgColor }]}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Feather name="alert-triangle" size={20} color={COLORS.white} />
          </View>
          
          <View style={styles.textContainer}>
            <Text style={styles.houseLabel}>
              {registeredHouse.name} ({registeredHouse.id})
            </Text>
            <Text style={styles.title} numberOfLines={1}>
              {alert.title}
            </Text>
            <Text style={styles.description} numberOfLines={2}>
              {alert.description}
            </Text>
            <Text style={styles.time}>
              {formatRelativeTime(alert.created_at)}
            </Text>
          </View>

          <TouchableOpacity style={styles.dismissButton} onPress={handleDismiss}>
            <Feather name="x" size={18} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 16,
    zIndex: 1000,
  },
  notification: {
    borderRadius: 12,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  content: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  houseLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
    marginBottom: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 4,
  },
  time: {
    fontSize: 11,
    color: "rgba(255,255,255,0.8)",
  },
  dismissButton: {
    marginLeft: 8,
    padding: 4,
  },
});