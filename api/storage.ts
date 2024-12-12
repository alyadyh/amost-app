"use server";

import { supabase } from "@/constants/supabase";

export const uploadImage = async (
  selectedImageUri: string,
  storagePath: string,
): Promise<string> => {
  try {
    const response = await fetch(selectedImageUri);
    const arrayBuffer = await response.arrayBuffer();
    const fileExt = selectedImageUri.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(storagePath)
      .upload(fileName, arrayBuffer, {
        contentType: `image/${fileExt}`,
      });

    if (error) {
      throw new Error(`Error uploading image: ${error.message}`);
    }

    const imageUrl =
      `https://snyctjesxxylnzvygnrn.supabase.co/storage/v1/object/public/${storagePath}/${data.path}`;

    return imageUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
