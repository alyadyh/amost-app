'use client'

import * as ImagePicker from 'expo-image-picker'

export const pickImage = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
  if (status !== 'granted') {
    alert('Sorry, we need camera roll permissions to make this work!')
    return null
  }

  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  })

  if (!result.canceled) {
    return result.assets[0].uri // Return the selected image URI
  }
  return null // Return null if no image was selected
}
