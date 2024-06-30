import { View, Text, Image } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'

import Octicons from '@expo/vector-icons/Octicons';

interface TabIconProps {
  icon: any;
  color: string;
  name: string;
  focused: boolean;
}

const TabIcon: React.FC<TabIconProps> = ({ icon, color, name, focused }) => {
  return (
    <View className='flex items-center justify-center gap-2'>
      <Octicons 
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
                icon="skip"
                color={color}
                name="Obatku"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="logs"
          options={{
            title: "Logs",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon="quote"
                color={color}
                name="Logs"
                focused={focused}
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
              />
            ),
          }}
        />
      </Tabs>
    </>
  )
}

export default TabsLayout