import { DateTime } from "luxon";
import type { FirestoreTimestamp } from "@/src/types/postList";

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

export const coerceDateTime = (value: unknown) => {
  if (!value) return null;

  if (value instanceof Date) {
    const dt = DateTime.fromJSDate(value);
    return dt.isValid ? dt : null;
  }

  if (typeof value === "string") {
    const iso = DateTime.fromISO(value);
    if (iso.isValid) return iso;
    const fromJS = DateTime.fromJSDate(new Date(value));
    return fromJS.isValid ? fromJS : null;
  }

  if (typeof value === "number") {
    const dt = DateTime.fromMillis(value);
    return dt.isValid ? dt : null;
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "seconds" in (value as FirestoreTimestamp)
  ) {
    const { seconds, nanoseconds = 0 } = value as FirestoreTimestamp;
    const millis = seconds * 1000 + Math.floor(nanoseconds / 1_000_000);
    const dt = DateTime.fromMillis(millis);
    return dt.isValid ? dt : null;
  }

  return null;
};

export const formatPostDate = (createdAt: unknown) => {
  const date = coerceDateTime(createdAt)?.setLocale("es");
  if (!date) return "";

  const formatted = date.toFormat("dd 'de' MMMM, yyyy");
  const relative = date.toRelative({ style: "short" }) ?? "";
  return relative ? `${formatted} · ${relative}` : formatted;
};

export const getPlainText = (html: string) =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const getExcerpt = (content: string, maxLength = 220) => {
  const plain = getPlainText(content);
  if (plain.length <= maxLength) return plain;
  return `${plain.slice(0, maxLength).trim()}…`;
};

export const getReadingTime = (content: string) => {
  const words = getPlainText(content).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};
