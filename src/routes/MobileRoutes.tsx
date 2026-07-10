import { Route, Navigate } from "react-router-dom";
import MobileApp from "../pages/mobile/MobileApp";
import StaffLayout from "../pages/mobile/staff/StaffLayout";
import StaffTasks from "../pages/mobile/staff/StaffTasks";
import StaffTaskDetail from "../pages/mobile/staff/StaffTaskDetail";
import StaffLeave from "../pages/mobile/staff/StaffLeave";
import StaffProfile from "../pages/mobile/staff/StaffProfile";

/* =============================================================
   MOBILE ROUTES
   - /mobile      → MobileApp (screen-based SPA with PhoneFrame)
   - /app/*       → Staff PWA-ready app with bottom nav
   ============================================================= */
export const MobileRoutes = () => (
  <>
    {/* Mobile prototype viewer (PhoneFrame + sidebar) */}
    <Route path="/mobile" element={<MobileApp />} />

    {/* Staff mobile app (PWA-ready) */}
    <Route path="/app" element={<StaffLayout />}>
      <Route index element={<Navigate to="/app/tasks" replace />} />
      <Route path="tasks" element={<StaffTasks />} />
      <Route path="tasks/:code" element={<StaffTaskDetail />} />
      <Route path="leave" element={<StaffLeave />} />
      <Route path="profile" element={<StaffProfile />} />
    </Route>
  </>
);
