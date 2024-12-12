"use server";

import { supabase } from "@/constants/supabase";
import { getCurrentUser } from "./auth";

export const fetchMedicines = async () => {
  const user = await getCurrentUser();

  try {
    const { data, error } = await supabase
      .from("medicines")
      .select("*")
      .eq("user_id", user?.id)
      .eq("deleted", false);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (error) {
    console.error("Error fetching medicines:", error);
    return null;
  }
};

export const fetchMedicineById = async (medId: string) => {
  try {
    const { data, error } = await supabase
      .from("medicines")
      .select("*")
      .eq("id", medId)
      .eq("deleted", false)
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (error) {
    console.error("Error fetching medicines:", error);
    return null;
  }
};

export const insertMedicine = async (medicineData: any) => {
  const user = await getCurrentUser();
  const formattedData = {
    user_id: user?.id,
    ...medicineData,
  };

  // console.log(
  //   "Formatted Data being inserted:",
  //   JSON.stringify(formattedData, null, 2),
  // ); // Log formatted data

  const { data, error } = await supabase.from("medicines").insert(
    formattedData,
  );

  // console.log("Supabase Response Data:", data); // Log response data from Supabase
  // console.log("Supabase Error (if any):", error); // Log Supabase error

  return { success: !error, error };
};

export const updateMedicine = async (medicineId: string, medicineData: any) => {
  try {
    const { error } = await supabase.from("medicines").update(medicineData).eq(
      "id",
      medicineId,
    );

    if (error) {
      throw new Error(`Error updating medicine: ${error.message}`);
    }
    return true;
  } catch (error) {
    console.error("Error updating medicine:", error);
    return false;
  }
};

export const deleteMedicine = async (
  medicineId: string,
) => {
  try {
    const { error } = await supabase.from("medicines").update({ deleted: true })
      .eq("id", medicineId);
    return true;
  } catch (error) {
    console.error("Error deleting medicine:", error);
    return false;
  }
};
