import { View, Text, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { Octicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const Profile = () => {
  return (
    <SafeAreaView className="h-full bg-white">
      <View className="px-6 py-16">
        <Text className="text-3xl text-black font-black">Profil</Text>

        <View>
          <View className="mt-8 items-center">
            <Image
              source={require('@/assets/images/profile-placeholder.png')}
              className="w-28 h-28 rounded-full"
            />
          </View>

          <View className="mt-4 space-y-2 items-center">
            <Text className="text-2xl font-bold">Jane Doe</Text>
            <Text className="text-md">janedoe@gmail.com</Text>
          </View>
        </View>

        {/* Options */}
        <View className="mt-12 w-full divide-y divide-amost-secondary-dark_2">

          {/* Settings */}
          <View>
            <TouchableOpacity
              className="flex-row items-center justify-between p-6 bg-white rounded-lg"
              // onPress={() => router.push('/settings')}
            >
              <View className="flex-row items-center">
                <Octicons name="gear" size={20} color="#454545" />
                <Text className="ml-4 text-lg font-medium text-amost-secondary-dark_1">Settings</Text>
              </View>
              <Octicons name="chevron-right" size={20} />
            </TouchableOpacity>
          </View>

          {/* Privacy */}
          <View>
            <TouchableOpacity
              className="flex-row items-center justify-between p-6 bg-white rounded-lg"
              // onPress={() => router.push('/privacy')}
            >
              <View className="flex-row items-center">
                <Octicons name="shield" size={20} color="#454545" />
                <Text className="ml-4 text-lg font-medium text-amost-secondary-dark_1">Privacy</Text>
              </View>
              <Octicons name="chevron-right" size={20} />
            </TouchableOpacity>
          </View>

          {/* Help Center */}
          <View>
            <TouchableOpacity
              className="flex-row items-center justify-between p-6 bg-white rounded-lg"
              // onPress={() => router.push('/helpCenter')}
            >
              <View className="flex-row items-center">
                <Octicons name="globe" size={20} color="#454545" />
                <Text className="ml-4 text-lg font-medium text-amost-secondary-dark_1">Help Center</Text>
              </View>
              <Octicons name="chevron-right" size={20} />
            </TouchableOpacity>
          </View>

          {/* Log out */}
          <View>
            <TouchableOpacity
              className="flex-row items-center justify-between p-6 bg-white rounded-lg"
              // onPress={() => router.push('/logout')}
            >
              <View className="flex-row items-center">
                <Octicons name="sign-out" size={20} color="#454545" />
                <Text className="ml-4 text-lg font-medium text-amost-secondary-dark_1">Log out</Text>
              </View>
              <Octicons name="chevron-right" size={20} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
