import type { HouseRiskPoint, RiskZone } from "../types/risk";

/**
 * Dummy dataset for testing the risk map without a live backend.
 *
 * 15 houses spread over 3 RTs in Yogyakarta with distinct risk profiles:
 * - RT-001 (Tugu area): high risk — dense housing, aged wiring
 * - RT-002 (Kotabaru area): moderate risk
 * - RT-003 (Alun-Alun Kidul area): low risk
 */
export const MOCK_HOUSES: HouseRiskPoint[] = [
  // RT-001 — high risk cluster
  { id: "h-01", latitude: -7.7875, longitude: 110.3625, riskScore: 92, rtId: "RT-001" },
  { id: "h-02", latitude: -7.7885, longitude: 110.3638, riskScore: 85, rtId: "RT-001" },
  { id: "h-03", latitude: -7.7870, longitude: 110.3642, riskScore: 78, rtId: "RT-001" },
  { id: "h-04", latitude: -7.7892, longitude: 110.3618, riskScore: 88, rtId: "RT-001" },
  { id: "h-05", latitude: -7.7880, longitude: 110.3632, riskScore: 71, rtId: "RT-001" },

  // RT-002 — moderate risk cluster
  { id: "h-06", latitude: -7.7895, longitude: 110.3745, riskScore: 55, rtId: "RT-002" },
  { id: "h-07", latitude: -7.7908, longitude: 110.3758, riskScore: 48, rtId: "RT-002" },
  { id: "h-08", latitude: -7.7890, longitude: 110.3762, riskScore: 42, rtId: "RT-002" },
  { id: "h-09", latitude: -7.7912, longitude: 110.3740, riskScore: 58, rtId: "RT-002" },
  { id: "h-10", latitude: -7.7902, longitude: 110.3752, riskScore: 37, rtId: "RT-002" },

  // RT-003 — low risk cluster
  { id: "h-11", latitude: -7.8045, longitude: 110.3635, riskScore: 22, rtId: "RT-003" },
  { id: "h-12", latitude: -7.8058, longitude: 110.3648, riskScore: 35, rtId: "RT-003" },
  { id: "h-13", latitude: -7.8040, longitude: 110.3652, riskScore: 18, rtId: "RT-003" },
  { id: "h-14", latitude: -7.8062, longitude: 110.3628, riskScore: 28, rtId: "RT-003" },
  { id: "h-15", latitude: -7.8050, longitude: 110.3642, riskScore: 12, rtId: "RT-003" },
];

/**
 * Simulates the server-side aggregation (in production this runs in the
 * AI Engine / backend before data ever reaches the Warga app):
 * group houses by RT, average the risk scores, and derive the zone centroid.
 *
 * Only the aggregate leaves the backend — individual house coordinates are
 * never sent to Warga, which is what keeps the privacy boundary intact.
 */
export function aggregateByRT(houses: HouseRiskPoint[]): RiskZone[] {
  const grouped = new Map<string, HouseRiskPoint[]>();

  for (const house of houses) {
    const group = grouped.get(house.rtId) ?? [];
    group.push(house);
    grouped.set(house.rtId, group);
  }

  return Array.from(grouped.entries()).map(([rtId, group]) => {
    const avgRiskScore = group.reduce((sum, h) => sum + h.riskScore, 0) / group.length;
    const latitude = group.reduce((sum, h) => sum + h.latitude, 0) / group.length;
    const longitude = group.reduce((sum, h) => sum + h.longitude, 0) / group.length;

    return {
      rtId,
      avgRiskScore: Math.round(avgRiskScore),
      houseCount: group.length,
      center: { latitude, longitude },
      radiusMeters: 220,
    };
  });
}

/** Pre-aggregated zones — what the Warga-facing API would return. */
export const MOCK_ZONES: RiskZone[] = aggregateByRT(MOCK_HOUSES);
