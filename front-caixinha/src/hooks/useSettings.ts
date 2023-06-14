import { SettingsContext } from "@/contexts/settings";
import { useContext } from "react";

export const useSettings = () => useContext(SettingsContext)