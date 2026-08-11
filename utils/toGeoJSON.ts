import type { Feature, FeatureCollection, Polygon, Position } from "geojson";

import type { HouseRiskPoint, RiskZone } from "../types/risk";

const EARTH_RADIUS_M = 6_371_000;

/**
 * Convert per-house risk points into a GeoJSON FeatureCollection of Points.
 *
 * NOTE: GeoJSON coordinates are `[longitude, latitude]` — the reverse of the
 * common `(lat, lng)` ordering. Getting this backwards is the most common GIS bug.
 */
export function housesToGeoJSON(houses: HouseRiskPoint[]): FeatureCollection {
  return {
    type: "FeatureCollection",
    features: houses.map(
      (h): Feature => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [h.longitude, h.latitude],
        },
        properties: {
          id: h.id,
          riskScore: h.riskScore,
        },
      }),
    ),
  };
}

/**
 * Build a circular polygon approximating an RT boundary.
 *
 * This is a deliberate simplification for the prototype: official RT boundary
 * polygons are not freely available, so we render a circle of `radiusMeters`
 * around the zone centroid. Swap this out for real polygons in production.
 */
function circlePolygon(
  center: { latitude: number; longitude: number },
  radiusMeters: number,
  steps = 32,
): Polygon {
  const ring: Position[] = [];

  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * 2 * Math.PI;
    // Offset in radians, then convert to degrees. Longitude offset is scaled by
    // 1/cos(latitude) so the circle isn't squashed east-west.
    const dLat = (radiusMeters * Math.sin(angle)) / EARTH_RADIUS_M;
    const dLng =
      (radiusMeters * Math.cos(angle)) /
      (EARTH_RADIUS_M * Math.cos((center.latitude * Math.PI) / 180));

    ring.push([
      center.longitude + (dLng * 180) / Math.PI,
      center.latitude + (dLat * 180) / Math.PI,
    ]);
  }

  return { type: "Polygon", coordinates: [ring] };
}

/**
 * Convert aggregated RT zones into a GeoJSON FeatureCollection of Polygons.
 */
export function zonesToGeoJSON(zones: RiskZone[]): FeatureCollection {
  return {
    type: "FeatureCollection",
    features: zones.map(
      (z): Feature => ({
        type: "Feature",
        geometry: circlePolygon(z.center, z.radiusMeters),
        properties: {
          rtId: z.rtId,
          avgRiskScore: z.avgRiskScore,
          houseCount: z.houseCount,
        },
      }),
    ),
  };
}
