import React, { useState } from "react";
import { Link, router, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import Octicons from '@expo/vector-icons/Octicons';
import DropdownComponent from "@/components/Dropdown";

type Log = {
  name: string;
  status: string;
  taken: boolean;
};

type Section = {
  date: string;
  logs: Log[];
};

const data: Section[] = [
  {
    date: 'Today, 10 Agustus',
    logs: [
      { name: 'Amoxicillin', status: 'Taken at 12:00', taken: true },
      { name: 'Vitamin C', status: 'Taken at 12:03', taken: true },
      { name: 'Ibuprofen', status: 'Taken at 16:39', taken: true },
      { name: 'Migraine Relief', status: 'Skipped', taken: false },
      { name: 'Vitamin A', status: 'No status', taken: false },
      { name: 'Soybean oil', status: 'No status', taken: true },
      { name: 'Imodium', status: 'No status', taken: false },
    ],
  },
  {
    date: 'Yesterday, 9 Agustus',
    logs: [
      { name: 'Amoxicillin', status: 'Taken at 12:00', taken: true },
      { name: 'Amoxicillin', status: 'Taken at 12:00', taken: true },
      { name: 'Vitamin C', status: 'Taken at 12:03', taken: true },
      { name: 'Ibuprofen', status: 'Taken at 16:39', taken: true },
      { name: 'Migraine Relief', status: 'Skipped', taken: false },
      { name: 'Vitamin A', status: 'No status', taken: false },
      { name: 'Soybean oil', status: 'No status', taken: false },
      { name: 'Imodium', status: 'No status', taken: false },
    ],
  },
];

const LogCard: React.FC<{ log: Log }> = ({ log }) => (
  <View className="flex flex-row justify-between items-center p-3 mb-4 bg-white rounded-lg shadow border border-lg border-amost-secondary-dark_2">
    <View className="flex flex-row items-center">
      <View className="mr-4">
        <Feather
          name={log.taken ? 'check-square' : 'x-square'}
          size={28}
          color={log.taken ? 'green' : 'red'}
        />
      </View>

      <View>
        <Text className="font-bold text-base">{log.name}</Text>
        <Text className="text-gray-500">{log.status}</Text>
      </View>
    </View>
    <TouchableOpacity>
      <Feather name="edit" size={24} color="black" />
    </TouchableOpacity>
  </View>
);

const LogSection: React.FC<{ section: Section }> = ({ section }) => (
  <View className="mb-6">
    <Text className="text-lg font-bold mb-6">{section.date}</Text>

    <View>
      {section.logs.map((log, index) => (
        <LogCard key={index} log={log} />
      ))}
    </View>
  </View>
);

const LogMed: React.FC = () => {
  return (
    <SafeAreaView className="h-full bg-white">
      <View className="px-6 py-10">
        <View className="flex-row items-center space-x-8">
          <TouchableOpacity 
            activeOpacity={0.7}
          >
            <Link href="/activity">
              <View className="bg-amost-secondary-gray_1 px-4 py-1 items-center justify-center rounded-full">
                <Octicons name="chevron-left" size={35} style={{ color: `#454545` }} />
              </View>
            </Link>
          </TouchableOpacity>
          <Text className="text-3xl text-black font-black">
            Log
          </Text>
        </View>

        <ScrollView className="mt-10">
          {data.map((section, index) => (
            <LogSection key={index} section={section} />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default LogMed;
