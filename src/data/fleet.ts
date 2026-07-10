// Danh mục xe & tuyến đường + đối tác vận chuyển (mock)

export type VehicleType = {
  code: string;
  name: string;
  capacityKg: number;
  volumeM3: number;
};

export const VEHICLES: VehicleType[] = [
  { code: "V500", name: "Xe tải 500kg", capacityKg: 500, volumeM3: 2 },
  { code: "V1T", name: "Xe tải 1 tấn", capacityKg: 1000, volumeM3: 4 },
  { code: "V15", name: "Xe tải 1.5 tấn", capacityKg: 1500, volumeM3: 6 },
  { code: "V35", name: "Xe tải 3.5 tấn", capacityKg: 3500, volumeM3: 14 },
  { code: "V8", name: "Xe tải 8 tấn", capacityKg: 8000, volumeM3: 28 },
  { code: "V15T", name: "Xe container 15 tấn", capacityKg: 15000, volumeM3: 55 },
];

export type Route = { code: string; name: string };

export const ROUTES: Route[] = [
  { code: "HN-HP", name: "Hà Nội → Hải Phòng" },
  { code: "HN-DN", name: "Hà Nội → Đà Nẵng" },
  { code: "HN-HCM", name: "Hà Nội → TP.HCM" },
  { code: "HCM-CT", name: "TP.HCM → Cần Thơ" },
  { code: "HCM-BD", name: "TP.HCM → Bình Dương" },
  { code: "HN-QN", name: "Hà Nội → Quảng Ninh" },
];

export type Partner = { code: string; name: string; email: string; phone: string };

export const PARTNERS: Partner[] = [
  { code: "VTP", name: "Viettel Post", email: "dispatch@viettelpost.vn", phone: "0912 000 001" },
  { code: "GHN", name: "Giao Hàng Nhanh", email: "ops@ghn.vn", phone: "0912 000 002" },
  { code: "NJV", name: "Ninja Van VN", email: "vn.ops@ninjavan.co", phone: "0912 000 003" },
  { code: "JT", name: "J&T Express", email: "hub@jtexpress.vn", phone: "0912 000 004" },
];

export function pickVehicle(totalKg: number, totalM3: number): VehicleType {
  const sorted = [...VEHICLES].sort((a, b) => a.capacityKg - b.capacityKg);
  return sorted.find((v) => v.capacityKg >= totalKg && v.volumeM3 >= totalM3) ?? sorted[sorted.length - 1];
}

export function routeForReceiver(receiver: string): string {
  const r = receiver.toLowerCase();
  if (r.includes("hải phòng") || r.includes("hp")) return "HN-HP";
  if (r.includes("đà nẵng") || r.includes("dn")) return "HN-DN";
  if (r.includes("hcm") || r.includes("sài gòn") || r.includes("hồ chí minh")) return "HN-HCM";
  if (r.includes("cần thơ")) return "HCM-CT";
  if (r.includes("bình dương")) return "HCM-BD";
  if (r.includes("quảng ninh")) return "HN-QN";
  return "HN-HCM";
}
