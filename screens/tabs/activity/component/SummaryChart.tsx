import React, { useEffect, useState } from 'react';
import { BarChart, barDataItem } from "react-native-gifted-charts";
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { LinearGradient } from '@/components/ui/linear-gradient';
import { supabase } from '@/lib/supabase';
import { LogWithMeds } from "@/constants/types";
import { ActivityIndicator } from "react-native";
import { format, startOfWeek, addDays } from 'date-fns';

export default function MedicationAdherenceChart() {
  const [adherenceData, setAdherenceData] = useState<barDataItem[]>([]);

  // Helper function to get the date in 'YYYY-MM-DD' format using local time
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-CA'); // 'en-CA' returns the format 'YYYY-MM-DD'
  }

  // Get the current week's dates (Monday to Sunday)
  const getCurrentWeekDates = (): { dayName: string, date: string }[] => {
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 1 }); // Monday as the first day
    const weekDays = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    return weekDays.map((day, index) => {
      const currentDate = addDays(start, index);
      return {
        dayName: day,
        date: formatDate(currentDate),
      };
    });
  }

  // Function to calculate adherence percentage for a given day
  const calculateAdherenceForDay = (logs: LogWithMeds[], date: string): number => {
    const logsForDay = logs.filter(log => log.log_date === date);
    const totalLogs = logsForDay.length;
    const takenLogs = logsForDay.filter(log => log.taken === true).length;

    return totalLogs > 0 ? Math.round((takenLogs / totalLogs) * 100) : 0;
  }

  const fetchLogs = async () => {
    try {
      // Fetch user session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session?.user?.id) {
        throw new Error("User is not authenticated");
      }

      const userId = sessionData.session.user.id;

      // Define the date range: current week (Monday to Sunday)
      const currentDate = new Date();
      const startOfWeekDate = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday
      const endOfWeekDate = addDays(startOfWeekDate, 6); // Sunday

      // Fetch med_logs with related medicines
      const { data: logsData, error: logsError } = await supabase
        .from('med_logs')
        .select(`
          *
        `)
        .eq('user_id', userId)
        .gte('updated_at', formatDate(startOfWeekDate))
        .lte('updated_at', formatDate(endOfWeekDate));

      if (logsError) {
        throw logsError;
      }

      // Filter logs where 'taken' is true and medicines data exists
      const takenLogs = logsData?.filter(log => log.taken === true && log.medicines !== null) || [];

      // Get the current week's dates
      const weekDates = getCurrentWeekDates();

      // Calculate adherence data
      const updatedAdherenceData: barDataItem[] = weekDates.map(dayInfo => {
        const adherencePercentage = calculateAdherenceForDay(logsData || [], dayInfo.date);
        const validValue = adherencePercentage > 0 ? adherencePercentage : 1; // Changed from 0.001 to 1 to ensure integer
        const validLabel = dayInfo.dayName;

        return {
          value: validValue,
          label: validLabel,
        };
      });

      // Log adherence data for debugging
      console.log("Adherence Data:", updatedAdherenceData);

      // Validate the structure before setting the state
      if (updatedAdherenceData.every(item => typeof item.value === 'number' && typeof item.label === 'string')) {
        setAdherenceData(updatedAdherenceData);
      } else {
        throw new Error("Invalid adherence data format");
      }

    } catch (err: any) {
      console.error("Error fetching logs:", err);
    }
  }

  useEffect(() => {
    fetchLogs();
  }, []);

  const minBarValue = 1; // Changed from 0.001 to 1
  const adherenceDataMaps = adherenceData.map(item => ({
    ...item,
    value: item.value > 0 ? item.value : minBarValue,
  }));

  return (
    <VStack space='lg'>
      <LinearGradient 
        className="w-full rounded-xl p-6"
        colors={["#fb8c00", "#F0B201"]}
        start={[0, 1]}
        end={[1, 0]}
      >
        <VStack space='lg'>
          <Text size='xl' className='font-bold text-white'>
            Grafik Kepatuhan Anda
          </Text>
          <BarChart
            data={adherenceDataMaps}
            barWidth={15}
            height={200}
            width={230}
            minHeight={3}
            barBorderRadius={3}
            spacing={17}
            noOfSections={4}
            yAxisThickness={0}
            xAxisThickness={0}
            xAxisLabelsVerticalShift={2}
            xAxisLabelTextStyle={{ color: "white", fontSize: 10 }}
            yAxisTextStyle={{ color: "white", fontSize: 12 }}
            frontColor="#ffffff"
          />
        </VStack>
      </LinearGradient>
    </VStack>
  );
}
