"use server";

import { supabase } from "@/constants/supabase";
import { getCurrentUser } from "./auth";
import { Log } from "@/constants/types";
import { format } from "date-fns";

export const fetchLog = async () => {
  const user = await getCurrentUser();

  try {
    const { data, error } = await supabase
      .from("logs")
      .select("*")
      .eq("user_id", user?.id)
      .order("log_date", { ascending: false });

    if (error) {
      throw new Error(`Error fetching log: ${error.message}`);
    }
    return data;
  } catch (error) {
    console.error("Error during log fetch:", error);
    return null;
  }
};

export const updateLog = async (logData: {
  medicine_id: string;
  med_name: string;
  log_date: string;
  reminder_time: string;
  taken: boolean | null;
  log_time?: string | null;
}) => {
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from("logs")
    .update(logData)
    .eq("user_id", user?.id)
    .eq("medicine_id", logData.medicine_id)
    .eq("log_date", logData.log_date)
    .eq("reminder_time", logData.reminder_time);
  if (error) {
    console.error("Error updating log:", error.message);
    throw error;
  }
  return data;
};

export const fetchMonthLogs = async (
  oneMonthAgo: Date,
): Promise<Log[]> => {
  const user = await getCurrentUser();

  try {
    const { data: logsData, error: logsError } = await supabase
      .from("logs")
      .select("*")
      .eq("user_id", user?.id)
      .eq("taken", true)
      .gte("log_date", oneMonthAgo.toISOString());

    if (logsError) {
      throw new Error(logsError.message);
    }

    // Filter out logs with no associated medicine
    const validLogs: Log[] = logsData?.filter((log) =>
      log.medicine_id !== null && log.medicine !== null
    ) || [];

    return validLogs;
  } catch (error) {
    console.error("Error fetching logs:", error);
    return [];
  }
};

export const fetchWeeklyLogs = async (
  startOfWeekDate: Date,
  endOfWeekDate: Date,
): Promise<Log[]> => {
  const user = await getCurrentUser();

  try {
    // Fetch logs for the user within the current week (Monday to Sunday)
    const { data: logsData, error: logsError } = await supabase
      .from("logs")
      .select("*")
      .eq("user_id", user?.id)
      .gte("log_date", format(startOfWeekDate, "yyyy-MM-dd")) // Ensure the date format is consistent
      .lte("log_date", format(endOfWeekDate, "yyyy-MM-dd")); // End date of the week

    if (logsError) {
      throw new Error(logsError.message);
    }

    // Return the fetched logs
    return logsData || [];
  } catch (error) {
    console.error("Error fetching logs for week:", error);
    return [];
  }
};
