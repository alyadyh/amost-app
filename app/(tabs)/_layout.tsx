import { View, Text, Image } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'

import { Ionicons, Octicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface TabIconProps {
  icon: any;
  color: string;
  name: string;
  focused: boolean;
  type: number;
}

const TabIcon: React.FC<TabIconProps> = ({ icon, color, name, focused, type }) => {
  const IconComponent = type === 1 
    ? Octicons 
    : type === 2 
    ? MaterialCommunityIcons 
    : Ionicons;

  return (
    <View className='flex items-center justify-center gap-2'>
      <IconComponent 
        name={icon}
        color={color}
        size={24}
      />
      <Text className={`${focused ? 'font-semibold' : 'font-medium'} text-xs`} style={{ color: color }}>
        {name}
      </Text>
    </View>
  )
}

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#00A378",
          tabBarInactiveTintColor: "#61646B",
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#ffff",
            height: 84,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon="home"
                color={color}
                name="Beranda"
                focused={focused}
                type={1}
                />
              ),
            }}
            />
        <Tabs.Screen
          name="medication"
          options={{
            title: "Med",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
              icon="pill"
              color={color}
              name="Obatku"
              focused={focused}
              type={2}
              />
            ),
          }}
          />
        <Tabs.Screen
          name="activity"
          options={{
            title: "Activity",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
              icon="analytics-outline"
              color={color}
              name="Aktivitas"
              focused={focused}
              type={3}
              />
            ),
          }}
          />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
              icon="person"
              color={color}
              name="Profil"
              focused={focused}
              type={1}
              />
            ),
          }}
        />
      </Tabs>
    </>
  )
}

export default TabsLayout