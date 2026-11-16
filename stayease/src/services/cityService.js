import { apiRequest } from "./api";

export async function getCities() {
  return apiRequest("/cities");
}

export function formatCityLabel(city) {
  return city?.name || "";
}

export function formatPropertyLocation(address, city) {
  return [address?.trim(), city?.name]
    .filter((part, index, parts) => part && parts.indexOf(part) === index)
    .join(", ");
}