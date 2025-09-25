import { DateTime } from "luxon";

export const getGreating = () => {
  const date = DateTime.now();
  const houre = date.hour;

  if (houre < 12) {
    return "Buenos días";
  }

  if (houre < 18) {
    return "Buenas tardes";
  }

  return "Buenas noches";
};

export const cutText = (text: string, size: number) => {
  if (text.length > size) {
    return text.slice(0, size) + "...";
  }
  return text;
};
