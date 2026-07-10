// Thuật toán gom order theo ưu tiên spec:
//   TH1 (có vận chuyển): Đơn vị nhận hàng → Đủ tải trọng xe → Tuyến đường
//   TH2 (không vận chuyển): gom theo Đơn vị nhận hàng
import { VEHICLES, VehicleType, pickVehicle, routeForReceiver } from "@/data/fleet";

export type ConsolidateInput = {
  id: string;
  receiver: string;
  weight: number; // kg
  volume: number; // m3
  lines: number;
  qty: number;
  hasTransport: boolean;
  route?: string;
};

export type ConsolidatedGroup = {
  key: string;
  receiver: string;
  route: string;
  hasTransport: boolean;
  totalWeight: number;
  totalVolume: number;
  vehicle: VehicleType;
  orders: ConsolidateInput[];
};

const MAX_CAP = VEHICLES[VEHICLES.length - 1].capacityKg;
const MAX_VOL = VEHICLES[VEHICLES.length - 1].volumeM3;

// Chọn tuyến đại diện cho bucket: tuyến chiếm đa số, nếu lẫn thì "Đa tuyến"
function bucketRoute(orders: ConsolidateInput[]): string {
  const count: Record<string, number> = {};
  orders.forEach((o) => {
    const r = o.route || routeForReceiver(o.receiver);
    count[r] = (count[r] || 0) + 1;
  });
  const entries = Object.entries(count);
  if (entries.length === 1) return entries[0][0];
  entries.sort((a, b) => b[1] - a[1]);
  return `${entries[0][0]} (+${entries.length - 1} tuyến)`;
}

export function consolidateOrders(orders: ConsolidateInput[]): ConsolidatedGroup[] {
  const groups: ConsolidatedGroup[] = [];
  const withT = orders.filter((o) => o.hasTransport);
  const noT = orders.filter((o) => !o.hasTransport);

  // TH1: Ưu tiên 1 — gom theo Đơn vị nhận hàng
  const byReceiver: Record<string, ConsolidateInput[]> = {};
  withT.forEach((o) => {
    (byReceiver[o.receiver] ||= []).push({ ...o, route: o.route || routeForReceiver(o.receiver) });
  });

  Object.entries(byReceiver).forEach(([receiver, list]) => {
    // Ưu tiên 2 — Đủ tải trọng xe: greedy bin-pack theo capacity trước
    // Sort giảm dần theo tải để tăng tỉ lệ lấp đầy xe
    const sorted = [...list].sort((a, b) => b.weight - a.weight);
    const buckets: ConsolidateInput[][] = [];
    const bw: number[] = [];
    const bv: number[] = [];

    sorted.forEach((o) => {
      // Ưu tiên 3 — Tuyến đường: khi có nhiều bucket còn chỗ, ưu tiên bucket cùng tuyến
      let placed = -1;
      let sameRoute = -1;
      for (let i = 0; i < buckets.length; i++) {
        if (bw[i] + o.weight <= MAX_CAP && bv[i] + o.volume <= MAX_VOL) {
          if (placed === -1) placed = i;
          if (sameRoute === -1 && buckets[i].some((x) => x.route === o.route)) sameRoute = i;
        }
      }
      const idx = sameRoute !== -1 ? sameRoute : placed;
      if (idx === -1) {
        buckets.push([o]); bw.push(o.weight); bv.push(o.volume);
      } else {
        buckets[idx].push(o); bw[idx] += o.weight; bv[idx] += o.volume;
      }
    });

    buckets.forEach((bucket, i) => {
      groups.push({
        key: `${receiver}-T-${i}`,
        receiver,
        route: bucketRoute(bucket),
        hasTransport: true,
        totalWeight: bw[i],
        totalVolume: bv[i],
        vehicle: pickVehicle(bw[i], bv[i]),
        orders: bucket,
      });
    });
  });

  // TH2: không vận chuyển → 1 nhóm/đơn vị nhận
  const byReceiverNoT: Record<string, ConsolidateInput[]> = {};
  noT.forEach((o) => (byReceiverNoT[o.receiver] ||= []).push(o));
  Object.entries(byReceiverNoT).forEach(([receiver, list]) => {
    const tw = list.reduce((s, o) => s + o.weight, 0);
    const tv = list.reduce((s, o) => s + o.volume, 0);
    groups.push({
      key: `${receiver}-noT`,
      receiver, route: "—", hasTransport: false,
      totalWeight: tw, totalVolume: tv,
      vehicle: pickVehicle(tw, tv),
      orders: list,
    });
  });

  return groups;
}
