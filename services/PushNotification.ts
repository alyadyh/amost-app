import React, { useEffect, useState } from 'react'
import { Alert, Platform } from 'react-native'
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { supabase } from '../lib/supabase'
import axios from 'axios'

const BACKEND_URL = 'http://localhost:3000' // Replace with your deployed URL in production

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
})

export async function registerForPushNotificationsAsync() {
  let token

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }

    if (finalStatus !== 'granted') {
      Alert.alert('Failed to get push token for push notification!')
      return null
    }

    token = (await Notifications.getExpoPushTokenAsync()).data
    console.log('Expo Push Token:', token)
  } else {
    Alert.alert('Must use physical device for Push Notifications')
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C'
    })
  }

  return token
}

export async function savePushTokenToSupabase(userId: string, expoPushToken: string) {
  const { error } = await supabase.from('profiles').update({ expo_push_token: expoPushToken }).eq('id', userId)

  if (error) {
    console.error('Error saving push token to Supabase:', error.message)
  } else {
    console.log('Push token saved successfully')
  }
}

export async function handleNotificationAction(logId: any, action: any) {
  try {
    const response = await axios.post(`${BACKEND_URL}/notification-response`, {
      logId,
      action
    })
    console.log('Action handled successfully:', response.data)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error handling notification action:', error.message)
    } else {
      console.error('Error handling notification action:', error)
    }
  }
}
