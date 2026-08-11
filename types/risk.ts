export type HouseRiskPoint = {
  id: string;
  latitude: number;
  longitude: number;
  /** Risk score 0-100, produced by the AI Engine. */
  riskScore: number;
  /** RT identifier used to aggregate houses into a zone. */
  rtId: string;
};

export type RiskZone = {
  rtId: string;
  /** Average risk score of all houses in the RT. */
  avgRiskScore: number;
  /** Number of houses aggregated into this zone. */
  houseCount: number;
  /** Zone centroid (average of member house coordinates). */
  center: {
    latitude: number;
    longitude: number;
  };
  /**
   * Simplified RT boundary radius in meters.
   *
   * A real deployment would use official RT boundary polygons from the
   * Kelurahan/Bappeda GIS data. For the prototype we approximate the boundary
   * as a circle around the centroid.
   */
  radiusMeters: number;
};
