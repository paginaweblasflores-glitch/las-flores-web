export function getReservationResumeState<T extends { id: string }>(
  pendingZoneId: string,
  zones: T[],
): { zone: T; step: 1 } | null {
  const zone = zones.find((item) => item.id === pendingZoneId);
  return zone ? { zone, step: 1 } : null;
}
