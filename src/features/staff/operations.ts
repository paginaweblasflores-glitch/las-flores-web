export function getStaffLoginDestination(role: string): string | null {
  switch (role.toLowerCase()) {
    case "admin":
      return "/admin";
    case "cashier":
    case "staff":
      return "/caja";
    case "ventas":
      return "/panel-reservas";
    case "marketing":
      return "/marketing";
    default:
      return null;
  }
}
