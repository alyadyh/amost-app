"use server";

import { supabase } from "@/constants/supabase";

export async function savePushTokenToSupabase(
  userId: string,
  expoPushToken: string,
) {
  const { error } = await supabase.from("profiles").update({
    expo_push_token: expoPushToken,
  }).eq("id", userId);

  if (error) {
    console.error("Error saving push token to Supabase:", error.message);
  } else {
    console.log("Push token saved successfully");
  }
}

export async function notifPreferenceToSupabase(
  userId: string,
  isEnabled: boolean,
) {
  const { error } = await supabase.from("profiles").update({
    notif_is_enabled: isEnabled,
  }).eq("id", userId);

  if (error) {
    console.error("Error saving push token to Supabase:", error.message);
  } else {
    console.log("Push token saved successfully");
  }
}
