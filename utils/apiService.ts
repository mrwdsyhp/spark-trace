import Constants from "expo-constants";
import type { Feature, FeatureCollection, Point } from "geojson";
import { getRegisteredHouseId } from "./houseStorage";

/**
 * ============================================================
 * apiService — lapisan akses data backend Express (end-to-end)
 * ============================================================
 * Semua fungsi di sini mengambil data ASLI dari backend
 * (spark-trace-backend) — tidak ada mock data.
 *
 * Semua API calls sekarang menggunakan registeredHouseId untuk
 * single-house monitoring sesuai SparkTrace requirements.
 *
 * CATATAN KONEKSI PERANGKAT ANDROID (via USB / Android Studio):
 * - HP dan komputer harus saling menjangkau port 5000:
 *   a) Satu jaringan Wi-Fi : host otomatis terdeteksi dari Metro (hostUri).
 *   b) Hanya kabel USB     : jalankan `adb reverse tcp:5000 tcp:5000`
 *      (atau `npm run android:reverse`), maka localhost di HP
 *      diteruskan ke port 5000 di komputer.
 */
const BACKEND_PORT = 5000;

/**
 * Resolusi host backend secara dinamis:
 * - Dev (Metro aktif): pakai IP komputer yang menjalankan Metro,
 *   mis. hostUri "192.168.1.5:8081" -> http://192.168.1.5:5000.
 * - Fallback: http://localhost:5000 (kombinasikan dengan adb reverse).
 */
function resolveApiBaseUrl(): string {
  const hostUri = Constants.expoConfig?.hostUri;
  const host = hostUri?.split(":")[0];

  if (host && host !== "localhost" && host !== "127.0.0.1") {
    return `http://${host}:${BACKEND_PORT}`;
  }
  return `http://localhost:${BACKEND_PORT}`;
}

export const API_BASE_URL = resolveApiBaseUrl();

// ---------------------------------------------------------------------------
// Tipe data — selaras dengan respons JSON backend Express
// ---------------------------------------------------------------------------

/** Respons `GET /api/houses` — properties per feature dari tabel `houses`. */
export interface HouseProperties {
  id: string;
  rt_id: string;
  risk_score: number;
}

/** Satu Feature Point GeoJSON seperti yang dikirim `ST_AsGeoJSON(geom)`. */
export interface HouseFeature extends Feature<Point, HouseProperties> {}

/** Respons `GET /api/houses` — FeatureCollection siap render ke peta. */
export interface HousesGeoJSON extends FeatureCollection<Point, HouseProperties> {}

/** Level peringatan dini: >= 80 danger, >= 50 warning. */
export type AlertType = "danger" | "warning";

/** Satu item respons `GET /api/alerts`. */
export interface Alert {
  id: string;
  houseId: string;
  alertType: string;
  severity: string;
  title: string;
  message: string;
  riskScore?: number;
  currentA?: number;
  powerW?: number;
  isRead: boolean;
  type: AlertType;
  time: string;
}

/** Satu item mitigasi dari tabel `mitigations`. */
export interface MitigationItem {
  id: string;
  houseId: string;
  riskLevel: string;
  title: string;
  description: string;
  priority: number;
  status: string;
  createdAt: string;
}

/** Respons `GET /api/mitigations/:houseId` — mitigasi untuk rumah terdaftar. */
export interface Mitigation {
  houseId: string;
  riskScore: number;
  riskLevel: string;
  mitigations: MitigationItem[];
  // Fallback format untuk backward compatibility
  worstNode?: string;
  recommendations?: string[];
}

/** Respons `GET /api/sensor/:houseId` — data sensor rumah terdaftar. */
export interface SensorData {
  houseId: string;
  recordedAt: string;
  voltage: number;
  current: number;
  power: number;
  powerVa: number;
  powerFactor: number;
  frequency: number;
  energy: number;
}

/** Respons pembungkus sensor data */
export interface SensorDataResponse {
  success: boolean;
  data: SensorData | null;
  message?: string;
}

/** Respons `GET /api/risk/:houseId` — data risiko rumah terdaftar. */
export interface RiskData {
  houseId: string;
  rtId?: string;
  riskScore: number;
  riskLevel: "aman" | "waspada" | "kritis";
  currentA?: number;
  powerW?: number;
  powerFactor?: number;
  assessedAt: string;
  source: string;
}

/** Respons pembungkus risk data */
export interface RiskDataResponse {
  success: boolean;
  data: RiskData | null;
}

// ---------------------------------------------------------------------------
// HTTP helper
// ---------------------------------------------------------------------------

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`);
  if (!res.ok) {
    throw new Error(`GET ${path} gagal: HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

/** GeoJSON seluruh rumah untuk dirender ke peta risiko (multi-house). */
export function fetchHousesGeoJSON(): Promise<HousesGeoJSON> {
  return getJson<HousesGeoJSON>("/api/houses");
}

/** GeoJSON rumah terdaftar untuk peta risiko single-house. */
export async function fetchRegisteredHouseGeoJSON(): Promise<HouseFeature> {
  const houseId = await getRegisteredHouseId();
  if (!houseId) {
    throw new Error("No registered house found");
  }
  return getJson<HouseFeature>(`/api/houses/${houseId}`);
}

/** Daftar peringatan dini untuk rumah terdaftar. */
export async function fetchAlerts(): Promise<Alert[]> {
  const houseId = await getRegisteredHouseId();
  if (!houseId) {
    return []; // Return empty array if no registered house
  }
  try {
    return await getJson<Alert[]>(`/api/alerts/${houseId}`);
  } catch (error) {
    console.warn("Failed to fetch alerts:", error);
    return [];
  }
}

/** Rekomendasi mitigasi untuk rumah terdaftar. */
export async function fetchMitigation(): Promise<Mitigation | null> {
  const houseId = await getRegisteredHouseId();
  if (!houseId) {
    return null;
  }
  try {
    return await getJson<Mitigation>(`/api/mitigations/${houseId}`);
  } catch (error) {
    console.warn("Failed to fetch mitigation:", error);
    return null;
  }
}

/** Data sensor untuk rumah terdaftar (hanya arus/current). */
export async function fetchSensorData(): Promise<SensorData | null> {
  const houseId = await getRegisteredHouseId();
  if (!houseId) {
    return null;
  }
  try {
    const response = await getJson<SensorDataResponse>(`/api/sensor/${houseId}`);
    return response.data;
  } catch (error) {
    console.warn("Failed to fetch sensor data:", error);
    return null;
  }
}

/** Data risiko untuk rumah terdaftar. */
export async function fetchRiskData(): Promise<RiskData | null> {
  const houseId = await getRegisteredHouseId();
  if (!houseId) {
    return null;
  }
  try {
    const response = await getJson<RiskDataResponse>(`/api/risk/${houseId}`);
    return response.data;
  } catch (error) {
    console.warn("Failed to fetch risk data:", error);
    return null;
  }
}

/** Validasi house ID exists di database untuk registrasi */
export async function validateHouseId(houseId: string): Promise<boolean> {
  try {
    const response = await getJson<{ success: boolean; data?: any }>(`/api/houses/${houseId}/validate`);
    return response.success;
  } catch (error) {
    console.warn("Failed to validate house ID:", error);
    return false;
  }
}

/** Format ISO timestamp menjadi "baru saja" / "5 menit lalu" / "2 jam lalu". */
export function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return iso;

  const minutes = Math.floor((Date.now() - then) / 60_000);

  if (minutes < 1) return "baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} hari lalu`;

  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}