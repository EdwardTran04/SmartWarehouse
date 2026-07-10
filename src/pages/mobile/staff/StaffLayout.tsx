import { NavLink, Outlet, useLocation } from "react-router-dom";
import { ClipboardList, CalendarDays, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/app/tasks", icon: ClipboardList, label: "Task" },
  { to: "/app/leave", icon: CalendarDays, label: "Nghỉ phép" },
  { to: "/app/profile", icon: User, label: "Hồ sơ" },
];

export default function StaffLayout() {
  const { pathname } = useLocation();
  const hideNav = /\/app\/tasks\/[^/]+$/.test(pathname);
  return (
    <div className="min-h-screen bg-muted/30 flex justify-center">
      <div className="w-full max-w-[480px] min-h-screen bg-background flex flex-col shadow-xl relative">
        <main className={cn("flex-1 pb-24", hideNav && "pb-6")}>
          <Outlet />
        </main>
        {!hideNav && (
          <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] border-t bg-background/95 backdrop-blur z-50">
            <div className="grid grid-cols-3">
              {tabs.map((t) => (
                <NavLink
                  key={t.to}
                  to={t.to}
                  className={({ isActive }) =>
                    cn(
                      "flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    )
                  }
                >
                  <t.icon className="h-5 w-5" />
                  {t.label}
                </NavLink>
              ))}
            </div>
            <div className="h-[env(safe-area-inset-bottom)]" />
          </nav>
        )}
      </div>
    </div>
  );
}