"use server";

import { supabase } from "@/constants/supabase";
import { getCurrentUser } from "./auth";

export const fetchUserProfile = async () => {
  const user = await getCurrentUser();

  const { data: profileData, error } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, notif_is_enabled")
    .eq("id", user?.id)
    .single();

  if (error) {
    throw new Error(`Error fetching profile: ${error.message}`);
  }

  return profileData;
};

export const updateUserProfile = async (
  newName: string,
  newAvatar: string,
) => {
  const user = await getCurrentUser();

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: newName, avatar_url: newAvatar })
    .eq("id", user?.id)
    .single();

  if (error) {
    throw new Error(`Error updating profile: ${error.message}`);
  }
};
