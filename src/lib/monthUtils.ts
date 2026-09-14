// Últimos 12 meses ya cerrados (sin incluir el mes en curso, que aún no terminó)
export const getEligibleClosureMonths = () => {
  const months: { value: string; label: string }[] = [];
  const now = new Date();
  for (let i = 1; i <= 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("es-PE", { month: "long", year: "numeric" });
    months.push({ value, label: label.charAt(0).toUpperCase() + label.slice(1) });
  }
  return months;
};

export const formatMonthLabel = (monthStr: string) => {
  const [y, m] = monthStr.split("-").map(Number);
  const label = new Date(y, m - 1, 1).toLocaleDateString("es-PE", { month: "long", year: "numeric" });
  return label.charAt(0).toUpperCase() + label.slice(1);
};

export const getMonthDateRange = (monthStr: string) => {
  const [y, m] = monthStr.split("-").map(Number);
  const lastDay = new Date(y, m, 0).getDate();
  return {
    start: `${monthStr}-01T00:00:00`,
    end: `${monthStr}-${String(lastDay).padStart(2, "0")}T23:59:59`,
  };
};
