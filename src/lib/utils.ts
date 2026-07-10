import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Định dạng thời gian: dd/MM/yyyy HH:mm:ss */
export function formatDateTime(input: string | Date | number | null | undefined): string {
  if (input == null) return "—";
  let d: Date;
  if (input instanceof Date) {
    d = input;
  } else if (typeof input === "number") {
    d = new Date(input);
  } else {
    const s = input.trim();
    if (s.includes("/")) {
      const [datePart, timePart] = s.split(" ");
      const [dd, MM, yyyy] = datePart.split("/");
      d = new Date(`${yyyy}-${MM}-${dd}T${timePart || "00:00:00"}`);
    } else if (s.includes(" ") && !s.includes("T") && s.includes("-")) {
      d = new Date(s.replace(" ", "T"));
    } else {
      d = new Date(s);
    }
  }
  if (isNaN(d.getTime())) return String(input);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}
