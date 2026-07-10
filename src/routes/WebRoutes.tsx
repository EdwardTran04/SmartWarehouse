import { Route, Navigate } from "react-router-dom";
import Warehouses from "../pages/Warehouses";
import WarehouseConfigure from "../pages/WarehouseConfigure";
import Locations from "../pages/Locations";
import Rules from "../pages/Rules";
import Visualization from "../pages/Visualization";
import { RackTypesPage, PalletTypesPage, WoodboxTypesPage, ZoneTypesPage, LocationStatusPage } from "../pages/Catalogs";
import AutoDispatch from "../pages/AutoDispatch";
import {
  InboundOrders, InboundConfirm, InboundOrderDetail,
  InboundTasks, InboundTaskDetail,
  InboundApiMonitor, InboundExceptions, InboundConfig,
} from "../pages/Inbound";
import {
  InboundEmployees, InboundPositions, InboundTaskCatalog, InboundMapping,
  InboundKCS, InboundNonCompliant, InboundGR, InboundVOffice, InboundPacking, InboundPutaway,
} from "../pages/InboundMaster";
import {
  OutboundOrders, OutboundOrderDetail, OutboundConfirm,
  OutboundTasks, OutboundTaskDetail,
  OutboundAssignQueue, OutboundAssign, OutboundApiMonitor, OutboundExceptions, OutboundConfig,
} from "../pages/Outbound";
import Shipments from "../pages/Shipments";
import PartnerConfirm from "../pages/PartnerConfirm";

/* =============================================================
   WEB ROUTES (Desktop admin dashboard)
   - /inbound/*    → Inbound module
   - /outbound/*   → Outbound module
   - /master/*     → Master data management
   - /warehouses/* → Warehouse admin
   - /catalog/*    → Catalog management
   ============================================================= */
export const WebRoutes = () => (
  <>
    {/* ─── Auto Dispatch ─── */}
    <Route path="/auto-dispatch" element={<AutoDispatch />} />

    {/* ─── Inbound module – Order-centric ─── */}
    <Route path="/inbound" element={<Navigate to="/inbound/orders" replace />} />
    <Route path="/inbound/orders" element={<InboundOrders />} />
    <Route path="/inbound/orders/:id" element={<InboundOrderDetail />} />
    <Route path="/inbound/orders/:id/confirm" element={<InboundConfirm />} />
    <Route path="/inbound/tasks" element={<InboundTasks />} />
    <Route path="/inbound/tasks/:id" element={<InboundTaskDetail />} />

    {/* ─── Inbound operational sub-screens ─── */}
    <Route path="/inbound/kcs" element={<InboundKCS />} />
    <Route path="/inbound/non-compliant" element={<InboundNonCompliant />} />
    <Route path="/inbound/gr" element={<InboundGR />} />
    <Route path="/inbound/voffice" element={<InboundVOffice />} />
    <Route path="/inbound/packing" element={<InboundPacking />} />
    <Route path="/inbound/putaway" element={<InboundPutaway />} />
    <Route path="/inbound/api-monitor" element={<InboundApiMonitor />} />
    <Route path="/inbound/exceptions" element={<InboundExceptions />} />
    <Route path="/inbound/config" element={<InboundConfig />} />

    {/* ─── Outbound module – Order-centric ─── */}
    <Route path="/outbound" element={<Navigate to="/outbound/orders" replace />} />
    <Route path="/outbound/orders" element={<OutboundOrders />} />
    <Route path="/outbound/orders/:id" element={<OutboundOrderDetail />} />
    <Route path="/outbound/orders/:id/confirm" element={<OutboundConfirm />} />
    <Route path="/outbound/tasks" element={<OutboundTasks />} />
    <Route path="/outbound/tasks/:id" element={<OutboundTaskDetail />} />
    <Route path="/outbound/shipments" element={<Shipments />} />
    <Route path="/partner-confirm/:token" element={<PartnerConfirm />} />

    {/* ─── Master Data ─── */}
    <Route path="/master/employees" element={<InboundEmployees />} />
    <Route path="/master/positions" element={<InboundPositions />} />
    <Route path="/master/task-catalog" element={<InboundTaskCatalog />} />
    <Route path="/master/mapping" element={<InboundMapping />} />

    {/* ─── Warehouse admin ─── */}
    <Route path="/warehouses" element={<Warehouses />} />
    <Route path="/warehouses/:code/configure" element={<WarehouseConfigure />} />
    <Route path="/locations" element={<Locations />} />
    <Route path="/catalog/rack-types" element={<RackTypesPage />} />
    <Route path="/catalog/pallet-types" element={<PalletTypesPage />} />
    <Route path="/catalog/woodbox-types" element={<WoodboxTypesPage />} />
    <Route path="/catalog/zone-types" element={<ZoneTypesPage />} />
    <Route path="/catalog/location-status" element={<LocationStatusPage />} />
    <Route path="/rules" element={<Rules />} />
    <Route path="/visualization" element={<Visualization />} />
  </>
);
