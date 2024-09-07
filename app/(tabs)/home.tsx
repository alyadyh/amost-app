import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Octicons } from '@expo/vector-icons'
import { Medicine } from '@/types/types';
import { dummyMeds } from '@/data/dummy';

const Home = () => {
  // Define the grouped meds type
  type GroupedMedsType = { [key: string]: Medicine[] };

  // Function to get current time in 24-hour format (HH:mm)
  const getCurrentTime = (): string => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const [days, setDays] = useState([
    { id: 1, name: 'Sen', date: '' },
    { id: 2, name: 'Sel', date: '' },
    { id: 3, name: 'Rab', date: '' },
    { id: 4, name: 'Kam', date: '' },
    { id: 5, name: 'Jum', date: '' },
    { id: 6, name: 'Sab', date: '' },
    { id: 7, name: 'Min', date: '' },
  ]);

  const [meds, setMeds] = useState<Medicine[]>(dummyMeds);
  const [currentDay, setCurrentDay] = useState<number>(new Date().getDay()); // 0 = Sunday, 1 = Monday, etc.
  const [currentTime, setCurrentTime] = useState<string>(getCurrentTime());

  // Function to get the current week's dates for Monday to Sunday
  const getWeekDates = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)); // Set to Monday

    const weekDays = days.map((day, index) => {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + index);
      return {
        ...day,
        date: currentDay.getDate().toString()
      };
    });
    setDays(weekDays);
  };

  // Function to get meds for the current day
  const getMedsForDay = (dayId: number): Medicine[] => {
    return meds
      .filter((med: Medicine) => {
        // Check if today is the day to take this medicine
        return (dayId - 1) % med.frequencyIntervalDays === 0;
      })
      .sort((a: Medicine, b: Medicine) => a.reminderTimes[0].localeCompare(b.reminderTimes[0])); // Sort by reminderTimes
  };

  // Function to group meds by reminderTimes and sort them
  const groupMedsByReminderTime = (meds: Medicine[]): GroupedMedsType => {
    const groupedMeds: GroupedMedsType = {};

    meds.forEach((med: Medicine) => {
      med.reminderTimes.forEach((time: string) => {
        if (!groupedMeds[time]) {
          groupedMeds[time] = [];
        }
        groupedMeds[time].push(med);
      });
    });

    // Sort reminderTimes
    const sortedGroupedMeds: GroupedMedsType = Object.keys(groupedMeds)
      .sort((a, b) => a.localeCompare(b))
      .reduce((result: GroupedMedsType, time: string) => {
        result[time] = groupedMeds[time];
        return result;
      }, {});

    return sortedGroupedMeds;
  };

  // Check if the time is within the active range (15 minutes before and after)
  const isActive = (reminderTime: string): boolean => {
    const reminder = new Date();
    const [hours, minutes] = reminderTime.split(':').map(Number);

    reminder.setHours(hours, minutes, 0, 0);

    const current = new Date();
    const currentMinutes = current.getHours() * 60 + current.getMinutes();
    const reminderMinutes = reminder.getHours() * 60 + reminder.getMinutes();

    // Check if the current time is within 15 minutes before or after the reminderTime
    return Math.abs(currentMinutes - reminderMinutes) <= 15;
  };

  // Map getDay to the day array (0=Sun, 1=Mon, etc.)
  const getCurrentDayIndex = (): number => {
    return currentDay === 0 ? 7 : currentDay; // Adjust to match the days array where 1=Monday
  };

  // Handle day click for testing
  const handleDayClick = (dayId: number) => {
    setCurrentDay(dayId); // Set the clicked day as the current day
  };

  useEffect(() => {
    getWeekDates(); // Calculate and set week dates on component load

    // Update current time every minute
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 60000);

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, []);

  const medsForDay = getMedsForDay(getCurrentDayIndex());
  const groupedMeds = groupMedsByReminderTime(medsForDay);

  return (
    <SafeAreaView className="h-full bg-white">
      <View className="px-6 py-16">
        <Text className="text-3xl text-black font-black mb-8">Hari ini</Text>

        <View className='flex-row justify-between mb-6'>
          {days.map(day => (
            <TouchableOpacity
              key={day.id}
              className={`items-center px-2.5 py-2 rounded-lg ${getCurrentDayIndex() === day.id ? 'bg-amost-primary' : ''}`}
              onPress={() => handleDayClick(day.id)} // Make the day clickable
            >
              <Text className={`font-bold text-xs ${getCurrentDayIndex() === day.id ? 'text-white' : 'text-amost-secondary-dark_2'}`}>
                {day.name}
              </Text>
              <Text className={`font-bold text-base ${getCurrentDayIndex() === day.id ? 'text-white' : 'text-black'}`}>
                {day.date}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          {Object.keys(groupedMeds).map((time) => (
            <View key={time} className="mb-4">
              {/* Display reminder time */}
              <View className='flex-row items-center mb-1.5'>
                <Text className='max-w-10 font-medium'>{time}</Text>
                <View className="flex-1 border-dashed border-t border-black ml-4" />
              </View>

              {/* Display all meds that have the same reminder time */}
              {groupedMeds[time].map((med: Medicine) => (
                <View key={med.id} className={`flex-row justify-between ml-12 bg-amost-secondary-light_1 ${isActive(time) ? 'p-6' : 'p-4'} rounded-lg items-center border border-amost-primary mb-2`}>
                  <View>
                    <Text className='text-xl font-bold text-black'>{med.medName}</Text>
                    <Text className='text-sm font-semibold text-amost-primary'>{med.dosage}</Text>
                  </View>
                  <View>
                    <Octicons name="kebab-horizontal" size={20} />
                  </View>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Home;
