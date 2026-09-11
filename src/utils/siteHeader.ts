export function getDeliveryButtonVisibilityClass(showDeliveryOnMobile: boolean) {
  return showDeliveryOnMobile ? "inline-block" : "hidden sm:inline-block";
}