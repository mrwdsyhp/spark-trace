import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { COLORS } from "../constants/colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: COLORS.white,
        tabBarInactiveTintColor: "rgba(255,255,255,0.6)",
        tabBarLabelStyle: { display: "none" },
        tabBarIconStyle: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 0,
          paddingTop: 0,
          marginTop: 10,
          height: "100%",
        },
        tabBarStyle: {
          backgroundColor: COLORS.primaryBlue,
          borderRadius: 30,
          marginHorizontal: 16,
          marginBottom: 16,
          height: 65,
          position: "absolute",
          borderTopWidth: 0,
          borderBottomWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ tabBarIcon: ({ color }) => <Feather name="home" size={22} color={color} /> }} />
      <Tabs.Screen name="notifikasi" options={{ tabBarIcon: ({ color }) => <Feather name="bell" size={22} color={color} /> }} />
      <Tabs.Screen name="PetaRisiko" options={{ tabBarIcon: ({ color }) => <Feather name="map" size={22} color={color} /> }} />
      <Tabs.Screen
        name="rekomendasi"
        options={{ tabBarIcon: ({ color }) => <Feather name={"info"} size={22} color={color} /> }}
      />
      <Tabs.Screen name="profil" options={{ tabBarIcon: ({ color }) => <Feather name="user" size={22} color={color} /> }} />
      <Tabs.Screen name="laporan" options={{ href: null, tabBarStyle: { display: "none"} }} />
    </Tabs>
  );
}