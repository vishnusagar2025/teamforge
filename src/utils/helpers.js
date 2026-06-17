export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
export const getInitials = (name) =>
  name?.split(" ").map(n => n[0]).join("").toUpperCase() || "U";
export const truncate = (str, n) =>
  str?.length > n ? str.substring(0, n) + "..." : str;
