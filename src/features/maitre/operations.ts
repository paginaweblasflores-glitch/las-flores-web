export function isValidMaitreAccessCode(value: string): boolean {
  return /^\d{4,6}$/.test(value);
}

export function getStaffLoginDestination(role: string): string | null {
  const normalizedRole = role.toLowerCase();
  switch (normalizedRole) {
    case "admin":
      return "/admin";
    case "cashier":
      return "/caja";
    case "staff":
      return "/salon";
    case "ventas":
      return "/panel-reservas";
    default:
      return null;
  }
}
