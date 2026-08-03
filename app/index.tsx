import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Animated,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

const { width } = Dimensions.get("window");

// Palet warna presisi sesuai Mockup
const COLORS = {
  headerBg: "#377AE6",       // Biru utama header & aksen bawah
  cardBg: "#4C85E6",         // Biru terang card UI
  whiteBg: "#FFFFFF",        // Background putih utama
  darkText: "#101828",       // Teks gelap
  lightText: "#F0F5FF",      // Teks terang/putih
  subText: "#E0EBFF",        // Subteks biru muda
  mutedGray: "#64748B",      // Teks abu-abu
  greenDot: "#22C55E",       // Status Aman (Hijau)
  yellowDot: "#EAB308",      // Status Waspada (Kuning)
  redDot: "#EF4444",         // Status Bahaya (Merah)
  navBg: "#2B58A5",          // Bottom nav biru tua
  navActive: "#FFFFFF",      // Tab aktif
  navInactive: "#8EB5F5",    // Tab non-aktif
};

export default function Index() {
  // State Navigasi
  const [activeTab, setActiveTab] = useState<"home" | "map" | "bell" | "user">("home");

  // State Simulasi Sensor Live
  const [isSimulating, setIsSimulating] = useState(true);
  const [statusMode, setStatusMode] = useState<"Aman" | "Waspada" | "Bahaya">("Aman");
  const [arusValue, setArusValue] = useState(5.2);
  const [suhuValue, setSuhuValue] = useState(32);
  const [riskScore, setRiskScore] = useState(5);

  // State Modal Detail Card
  const [activeModal, setActiveModal] = useState<"status" | "arus" | "suhu" | "map" | "bell" | "info" | null>(null);

  // Animation pulse untuk green dot status
  const [pulseAnim] = useState(new Animated.Value(1));

  // Effect Pulsing Green Dot
  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.5,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();
    return () => pulseLoop.stop();
  }, [pulseAnim]);

  // Effect Simulasi Real-Time Data Sensor
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      if (statusMode === "Aman") {
        setArusValue(Number((5.1 + Math.random() * 0.3).toFixed(1)));
        setSuhuValue(Math.floor(31 + Math.random() * 3));
        setRiskScore(Math.floor(4 + Math.random() * 3));
      } else if (statusMode === "Waspada") {
        setArusValue(Number((8.2 + Math.random() * 0.8).toFixed(1)));
        setSuhuValue(Math.floor(42 + Math.random() * 4));
        setRiskScore(Math.floor(35 + Math.random() * 10));
      } else {
        setArusValue(Number((12.5 + Math.random() * 1.5).toFixed(1)));
        setSuhuValue(Math.floor(58 + Math.random() * 6));
        setRiskScore(Math.floor(75 + Math.random() * 15));
      }
    }, 2500);
    return () => clearInterval(interval);
  }, [isSimulating, statusMode]);

  // Haptic trigger helper
  const triggerFeedback = (style = Haptics.ImpactFeedbackStyle.Light) => {
    try {
      Haptics.impactAsync(style);
    } catch {
      // Fallback untuk web / platform tanpa haptic
    }
  };

  // Switch status mode untuk simulasi interaktif
  const toggleStatusMode = () => {
    triggerFeedback(Haptics.ImpactFeedbackStyle.Medium);
    if (statusMode === "Aman") {
      setStatusMode("Waspada");
    } else if (statusMode === "Waspada") {
      setStatusMode("Bahaya");
    } else {
      setStatusMode("Aman");
    }
  };

  const getStatusColor = () => {
    if (statusMode === "Aman") return COLORS.greenDot;
    if (statusMode === "Waspada") return COLORS.yellowDot;
    return COLORS.redDot;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.headerBg} />

      {/* Header Atas (Warna Biru Utama) */}
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.avatarButton}
            onPress={() => {
              triggerFeedback();
              setActiveTab("user");
            }}
          >
            <View style={styles.avatarCircle}>
              <Feather name="user" size={24} color="#1E293B" />
            </View>
          </TouchableOpacity>

          <View style={styles.headerTextWrap}>
            <Text style={styles.headerTitle}>Halo Fathur</Text>
            <Text style={styles.headerSubtitle}>Waspada Selalu</Text>
          </View>

          {/* Quick Simulation Toggle */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.simBadge}
            onPress={() => {
              triggerFeedback(Haptics.ImpactFeedbackStyle.Medium);
              setIsSimulating(!isSimulating);
            }}
          >
            <View
              style={[
                styles.simDot,
                { backgroundColor: isSimulating ? "#22C55E" : "#94A3B8" },
              ]}
            />
            <Text style={styles.simText}>
              {isSimulating ? "Live Data" : "Paused"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Body Container (Putih Melengkung) */}
      <View style={styles.mainContentSheet}>
        {activeTab === "home" && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
          >
            {/* Status Card Utama */}
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.statusCard}
              onPress={() => {
                triggerFeedback();
                setActiveModal("status");
              }}
              onLongPress={toggleStatusMode}
            >
              <View style={styles.statusIconWrap}>
                <Ionicons name="shield" size={28} color="#101828" />
              </View>

              <View style={styles.statusTextContainer}>
                <Text style={styles.statusTitle}>
                  Status: {statusMode}
                </Text>
                <Text style={styles.statusRiskText}>
                  Skor Risiko: {riskScore}%
                </Text>
              </View>

              {/* Pulsing Status Dot Indicator */}
              <View style={styles.dotWrap}>
                <Animated.View
                  style={[
                    styles.pulseHalo,
                    {
                      backgroundColor: getStatusColor(),
                      transform: [{ scale: pulseAnim }],
                      opacity: pulseAnim.interpolate({
                        inputRange: [1, 1.5],
                        outputRange: [0.6, 0],
                      }),
                    },
                  ]}
                />
                <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
              </View>
            </TouchableOpacity>

            {/* Metric Row (Arus & Suhu Side-by-Side) */}
            <View style={styles.metricRow}>
              {/* Arus Card */}
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.metricCard}
                onPress={() => {
                  triggerFeedback();
                  setActiveModal("arus");
                }}
              >
                <View style={styles.metricHeaderRow}>
                  <Ionicons name="flash" size={26} color="#101828" />
                </View>
                <View style={styles.metricTextWrap}>
                  <Text style={styles.metricLabel}>Arus:</Text>
                  <Text style={styles.metricValue}>{arusValue} A</Text>
                </View>
              </TouchableOpacity>

              {/* Suhu Card */}
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.metricCard}
                onPress={() => {
                  triggerFeedback();
                  setActiveModal("suhu");
                }}
              >
                <View style={styles.metricHeaderRow}>
                  <Ionicons name="thermometer" size={26} color="#101828" />
                </View>
                <View style={styles.metricTextWrap}>
                  <Text style={styles.metricLabel}>Suhu:</Text>
                  <Text style={styles.metricValue}>{suhuValue} °C</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Map Preview Card */}
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.mapCard}
              onPress={() => {
                triggerFeedback();
                setActiveModal("map");
              }}
            >
              <View style={styles.mapIconLeft}>
                <Ionicons name="map" size={32} color="#101828" />
              </View>

              <View style={styles.mapPreviewBox}>
                {/* Visual Grid Peta */}
                <View style={styles.mapGridContainer}>
                  {[0, 1, 2, 3].map((row) => (
                    <View key={row} style={styles.mapGridRow}>
                      {[0, 1, 2, 3, 4, 5].map((col) => (
                        <View key={col} style={styles.mapGridCell} />
                      ))}
                    </View>
                  ))}
                </View>

                {/* Simulated Road Lines */}
                <View style={styles.roadLineHorizontal} />
                <View style={styles.roadLineVertical} />

                {/* Map Pin Marker */}
                <View style={styles.mapPinContainer}>
                  <Ionicons name="location" size={28} color="#EF4444" />
                </View>
              </View>
            </TouchableOpacity>

            {/* Action Cards Row (Notifikasi & Informasi) */}
            <View style={styles.actionRow}>
              {/* Notifikasi Card */}
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.actionCard}
                onPress={() => {
                  triggerFeedback();
                  setActiveModal("bell");
                }}
              >
                <Ionicons name="notifications" size={24} color="#101828" />
                <Feather name="chevron-right" size={22} color="#101828" />
              </TouchableOpacity>

              {/* Informasi Card */}
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.actionCard}
                onPress={() => {
                  triggerFeedback();
                  setActiveModal("info");
                }}
              >
                <Ionicons name="information-circle" size={26} color="#101828" />
                <Feather name="chevron-right" size={22} color="#101828" />
              </TouchableOpacity>
            </View>

            {/* Controls Interaktif Tambahan untuk Demo */}
            <View style={styles.demoControlBox}>
              <Text style={styles.demoTitle}>Uji Status Simulasi:</Text>
              <View style={styles.demoBtnRow}>
                <TouchableOpacity
                  style={[
                    styles.demoBtn,
                    statusMode === "Aman" && { backgroundColor: COLORS.greenDot },
                  ]}
                  onPress={() => {
                    triggerFeedback();
                    setStatusMode("Aman");
                  }}
                >
                  <Text style={styles.demoBtnText}>Aman</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.demoBtn,
                    statusMode === "Waspada" && { backgroundColor: COLORS.yellowDot },
                  ]}
                  onPress={() => {
                    triggerFeedback();
                    setStatusMode("Waspada");
                  }}
                >
                  <Text style={styles.demoBtnText}>Waspada</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.demoBtn,
                    statusMode === "Bahaya" && { backgroundColor: COLORS.redDot },
                  ]}
                  onPress={() => {
                    triggerFeedback();
                    setStatusMode("Bahaya");
                  }}
                >
                  <Text style={styles.demoBtnText}>Bahaya</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )}

        {/* Tab Content Placeholder: Map */}
        {activeTab === "map" && (
          <View style={styles.tabContentContainer}>
            <Ionicons name="map-outline" size={60} color={COLORS.headerBg} />
            <Text style={styles.tabTitle}>Peta Lokasi Panel</Text>
            <Text style={styles.tabSub}>
              Panel Utama Gedung A (Terhubung & Aktif)
            </Text>
            <TouchableOpacity
              style={styles.actionBtnPrimary}
              onPress={() => setActiveTab("home")}
            >
              <Text style={styles.actionBtnText}>Kembali ke Dashboard</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Tab Content Placeholder: Bell */}
        {activeTab === "bell" && (
          <View style={styles.tabContentContainer}>
            <Ionicons name="notifications-outline" size={60} color={COLORS.headerBg} />
            <Text style={styles.tabTitle}>Riwayat Notifikasi</Text>
            <Text style={styles.tabSub}>3 Notifikasi sistem hari ini</Text>
            <TouchableOpacity
              style={styles.actionBtnPrimary}
              onPress={() => setActiveTab("home")}
            >
              <Text style={styles.actionBtnText}>Kembali ke Dashboard</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Tab Content Placeholder: User */}
        {activeTab === "user" && (
          <View style={styles.tabContentContainer}>
            <Ionicons name="person-outline" size={60} color={COLORS.headerBg} />
            <Text style={styles.tabTitle}>Profil & Pengaturan</Text>
            <Text style={styles.tabSub}>Pengguna: Fathur (Operator Spark-Trace)</Text>
            <TouchableOpacity
              style={styles.actionBtnPrimary}
              onPress={() => setActiveTab("home")}
            >
              <Text style={styles.actionBtnText}>Kembali ke Dashboard</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Akses Melengkung Bawah & Floating Bottom Navigation */}
      <View style={styles.bottomAreaContainer}>
        {/* Curved Arc Background Shape */}
        <View style={styles.arcShape} />

        {/* Pill Floating Nav */}
        <View style={styles.pillNav}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.navItem}
            onPress={() => {
              triggerFeedback();
              setActiveTab("home");
            }}
          >
            <Ionicons
              name={activeTab === "home" ? "home" : "home-outline"}
              size={24}
              color={activeTab === "home" ? COLORS.navActive : COLORS.navInactive}
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.navItem}
            onPress={() => {
              triggerFeedback();
              setActiveTab("map");
            }}
          >
            <Ionicons
              name={activeTab === "map" ? "map" : "map-outline"}
              size={24}
              color={activeTab === "map" ? COLORS.navActive : COLORS.navInactive}
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.navItem}
            onPress={() => {
              triggerFeedback();
              setActiveTab("bell");
            }}
          >
            <Ionicons
              name={activeTab === "bell" ? "notifications" : "notifications-outline"}
              size={24}
              color={activeTab === "bell" ? COLORS.navActive : COLORS.navInactive}
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.navItem}
            onPress={() => {
              triggerFeedback();
              setActiveTab("user");
            }}
          >
            <Ionicons
              name={activeTab === "user" ? "person" : "person-outline"}
              size={24}
              color={activeTab === "user" ? COLORS.navActive : COLORS.navInactive}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* MODAL POPUPS FOR INTERACTIVITY */}
      {/* 1. Modal Status Detail */}
      <Modal
        visible={activeModal === "status"}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detail Risiko Sistem</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}>
                <Feather name="x" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={[styles.statusBadgeLarge, { backgroundColor: getStatusColor() }]}>
                <Text style={styles.statusBadgeText}>Status: {statusMode}</Text>
              </View>
              <Text style={styles.modalDetailText}>
                Skor Risiko Terhitung: <Text style={{ fontWeight: "700" }}>{riskScore}%</Text>
              </Text>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Deteksi Percikan (Spark):</Text>
                <Text style={styles.infoValue}>0 percikan/menit</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Kualitas Isolasi Kabel:</Text>
                <Text style={styles.infoValue}>98% (Sangat Baik)</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Tegangan Listrik:</Text>
                <Text style={styles.infoValue}>220 V (Stabil)</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setActiveModal(null)}
            >
              <Text style={styles.modalCloseBtnText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 2. Modal Arus Detail */}
      <Modal
        visible={activeModal === "arus"}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detail Telemetri Arus</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}>
                <Feather name="x" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.metricModalVal}>{arusValue} Ampere</Text>
              <Text style={styles.modalDetailText}>
                Batas Aman Operasional: 0.0 A - 10.0 A
              </Text>
              {/* Graph placeholder */}
              <View style={styles.graphBox}>
                <Ionicons name="analytics" size={48} color={COLORS.headerBg} />
                <Text style={{ marginTop: 8, color: "#64748B" }}>Grafik Arus Real-Time Active</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setActiveModal(null)}
            >
              <Text style={styles.modalCloseBtnText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 3. Modal Suhu Detail */}
      <Modal
        visible={activeModal === "suhu"}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detail Sensor Suhu</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}>
                <Feather name="x" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.metricModalVal}>{suhuValue} °Celcius</Text>
              <Text style={styles.modalDetailText}>
                Batas Panas Kritis: 50.0 °C
              </Text>
              <View style={styles.graphBox}>
                <Ionicons name="thermometer-outline" size={48} color={COLORS.headerBg} />
                <Text style={{ marginTop: 8, color: "#64748B" }}>Sensor Thermal Kabel Utuh</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setActiveModal(null)}
            >
              <Text style={styles.modalCloseBtnText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 4. Modal Map Detail */}
      <Modal
        visible={activeModal === "map"}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Lokasi Monitoring Sensor</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}>
                <Feather name="x" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={{ fontSize: 16, fontWeight: "700", color: "#1E293B" }}>
                Panel Utama - Gedung A
              </Text>
              <Text style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>
                Koordinat: -6.2088, 106.8456
              </Text>
              <Text style={{ fontSize: 13, color: "#64748B", marginTop: 2 }}>
                Sinyal IoT: 94% (Kuat)
              </Text>
            </View>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setActiveModal(null)}
            >
              <Text style={styles.modalCloseBtnText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 5. Modal Bell / Notifications */}
      <Modal
        visible={activeModal === "bell"}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pemberitahuan Sistem</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}>
                <Feather name="x" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <View style={styles.logItem}>
                <Ionicons name="checkmark-circle" size={20} color="#22C55E" />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.logTitle}>Sistem Berjalan Normal</Text>
                  <Text style={styles.logTime}>10 menit yang lalu</Text>
                </View>
              </View>
              <View style={styles.logItem}>
                <Ionicons name="information-circle" size={20} color="#3B82F6" />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.logTitle}>Kalibrasi Sensor Selesai</Text>
                  <Text style={styles.logTime}>1 jam yang lalu</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setActiveModal(null)}
            >
              <Text style={styles.modalCloseBtnText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 6. Modal Info Detail */}
      <Modal
        visible={activeModal === "info"}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Informasi Perangkat</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}>
                <Feather name="x" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Perangkat:</Text>
                <Text style={styles.infoValue}>Spark-Trace Guard v2.4</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Firmware:</Text>
                <Text style={styles.infoValue}>v1.0.8-stable</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>IP Address:</Text>
                <Text style={styles.infoValue}>192.168.1.104</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setActiveModal(null)}
            >
              <Text style={styles.modalCloseBtnText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.headerBg,
  },

  /* HEADER ATAS */
  headerContainer: {
    backgroundColor: COLORS.headerBg,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarButton: {
    borderRadius: 24,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTextWrap: {
    marginLeft: 14,
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.subText,
    marginTop: 2,
    fontWeight: "500",
  },
  simBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  simDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  simText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  /* MAIN WHITE SHEET */
  mainContentSheet: {
    flex: 1,
    backgroundColor: COLORS.whiteBg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
  },
  scrollContainer: {
    padding: 18,
    paddingBottom: 110,
    gap: 14,
  },

  /* STATUS CARD */
  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 18,
    elevation: 2,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  statusIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  statusTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#101828",
  },
  statusRiskText: {
    fontSize: 14,
    color: "#1E293B",
    marginTop: 4,
    fontWeight: "600",
  },
  dotWrap: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  statusDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  pulseHalo: {
    position: "absolute",
    width: 22,
    height: 22,
    borderRadius: 11,
  },

  /* METRIC ROW */
  metricRow: {
    flexDirection: "row",
    gap: 14,
  },
  metricCard: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    padding: 18,
    minHeight: 110,
    justifyContent: "space-between",
    elevation: 2,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  metricHeaderRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  metricTextWrap: {
    marginTop: 12,
  },
  metricLabel: {
    fontSize: 14,
    color: "#1E293B",
    fontWeight: "600",
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#101828",
    marginTop: 2,
  },

  /* MAP CARD */
  mapCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    padding: 14,
    elevation: 2,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  mapIconLeft: {
    width: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  mapPreviewBox: {
    flex: 1,
    height: 90,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#E2E8F0",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  mapGridContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  mapGridRow: {
    flex: 1,
    flexDirection: "row",
  },
  mapGridCell: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: "#94A3B8",
    opacity: 0.3,
  },
  roadLineHorizontal: {
    position: "absolute",
    top: "45%",
    left: 0,
    right: 0,
    height: 12,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#CBD5E1",
  },
  roadLineVertical: {
    position: "absolute",
    left: "55%",
    top: 0,
    bottom: 0,
    width: 12,
    backgroundColor: "#FFFFFF",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#CBD5E1",
  },
  mapPinContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },

  /* ACTION CARDS ROW */
  actionRow: {
    flexDirection: "row",
    gap: 14,
  },
  actionCard: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 20,
    elevation: 2,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },

  /* DEMO CONTROLS BOX */
  demoControlBox: {
    marginTop: 8,
    backgroundColor: "#F8FAFC",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  demoTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  demoBtnRow: {
    flexDirection: "row",
    gap: 8,
  },
  demoBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
  },
  demoBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1E293B",
  },

  /* TAB CONTENT PLACEHOLDERS */
  tabContentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  tabTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1E293B",
    marginTop: 16,
  },
  tabSub: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 6,
    textAlign: "center",
  },
  actionBtnPrimary: {
    marginTop: 24,
    backgroundColor: COLORS.headerBg,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  actionBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },

  /* BOTTOM AREA & NAVBAR */
  bottomAreaContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  arcShape: {
    position: "absolute",
    bottom: -60,
    width: width * 1.3,
    height: 140,
    borderRadius: (width * 1.3) / 2,
    backgroundColor: COLORS.headerBg,
  },
  pillNav: {
    flexDirection: "row",
    width: "84%",
    height: 56,
    backgroundColor: COLORS.navBg,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  navItem: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  /* MODALS */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 22,
    minHeight: 300,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },
  modalBody: {
    paddingVertical: 12,
    gap: 12,
  },
  statusBadgeLarge: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusBadgeText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
  modalDetailText: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 6,
  },
  metricModalVal: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
  },
  graphBox: {
    height: 120,
    backgroundColor: "#F1F5F9",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  infoLabel: {
    fontSize: 14,
    color: "#64748B",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
  },
  logItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  logTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
  },
  logTime: {
    fontSize: 12,
    color: "#94A3B8",
  },
  modalCloseBtn: {
    marginTop: 18,
    backgroundColor: COLORS.headerBg,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  modalCloseBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
});