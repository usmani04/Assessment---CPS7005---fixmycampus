export const statusColor = (s) => ({
  New: "#3B82F6",
  "In Progress": "#F59E0B",
  Resolved: "#10B981"
}[s]);

export const statusText = statusColor;

export const statusBg = (s) => ({
  New: "#EFF6FF",
  "In Progress": "#FFFBEB",
  Resolved: "#ECFDF5"
}[s]);

export const priorityColor = (p) => ({
  Low: "#6B7280",
  Medium: "#F59E0B",
  High: "#EF4444"
}[p]);

export const priorityBg = (p) => ({
  Low: "#F3F4F6",
  Medium: "#FFFBEB",
  High: "#FEE2E2"
}[p]);