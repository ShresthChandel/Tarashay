export interface MapPin {
  country: string;
  lat: number;
  lng: number;
}

const COORDS: Record<string, [number, number]> = {
  India: [20.5937, 78.9629],
  "United States": [37.0902, -95.7129],
  "United Kingdom": [55.3781, -3.436],
  Canada: [56.1304, -106.3468],
  Australia: [-25.2744, 133.7751],
  Germany: [51.1657, 10.4515],
  France: [46.2276, 2.2137],
  Singapore: [1.3521, 103.8198],
  UAE: [23.4241, 53.8478],
  Japan: [36.2048, 138.2529],
  Other: [0, 0],
};

export function countryToCoordinates(country: string): MapPin | null {
  const coords = COORDS[country];
  if (!coords) return null;
  return { country, lat: coords[0], lng: coords[1] };
}

export const PLACEHOLDER_PINS: MapPin[] = [
  { country: "India", lat: 24.53, lng: 81.3 },
  { country: "United States", lat: 40.7, lng: -74.0 },
  { country: "United Kingdom", lat: 51.5, lng: -0.12 },
  { country: "Germany", lat: 52.52, lng: 13.4 },
  { country: "Australia", lat: -33.87, lng: 151.21 },
];
