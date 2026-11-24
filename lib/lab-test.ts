"use client";
import { useSyncExternalStore } from "react";

export function isLabTest() {
  return typeof location !== "undefined" && location.origin === "http://127.0.0.1:3184";
}
const subscribe = () => () => {};
export function useLabTest() {
  return useSyncExternalStore(subscribe, isLabTest, () => false);
}
