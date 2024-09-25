'use client'

import * as ImagePicker from 'expo-image-picker'

export const pickImage = async () => {
  // Request permissions for the camera and media library
  const cameraPermission = await ImagePicker.requestCameraPermissionsAsync()
  const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync()

  if (cameraPermission.status !== 'granted' || mediaLibraryPermission.status !== 'granted') {
    alert('Sorry, we need camera and media library permissions to make this work!')
    return null
  }

  // Prompt the user to either capture a new image using the camera or select from the gallery
  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,  // Enable editing (cropping)
    aspect: [1, 1],       // Set the crop frame to a 1:1 aspect ratio
    quality: 1,
  })

  // If the camera is canceled, open the image picker to select from the gallery
  if (result.canceled) {
    const galleryResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,  // Enable editing (cropping)
      aspect: [1, 1],       // Set the crop frame to a 1:1 aspect ratio
      quality: 1,
    })

    if (!galleryResult.canceled) {
      return galleryResult.assets[0].uri // Return the selected image URI from the gallery
    }

    return null // Return null if no image is selected from the gallery
  }

  // If the user captured an image, return the URI of the captured image
  return result.assets[0].uri
}
