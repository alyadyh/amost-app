'use client'

import * as ImagePicker from 'expo-image-picker'

export const pickImage = async () => {
  try {
    // Request permissions for camera and media library
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync()
    const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (cameraPermission.status !== 'granted' || mediaLibraryPermission.status !== 'granted') {
      alert('Sorry, we need camera and media library permissions to make this work!')
      return null
    }

    // Launch the camera
    const cameraResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1], // 1:1 aspect ratio
      quality: 1,
    })

    // If the camera result is canceled, launch the image picker
    if (cameraResult.canceled) {
      const galleryResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      })

      if (!galleryResult.canceled && galleryResult.assets.length > 0) {
        return galleryResult.assets[0].uri // Return the image URI
      }

      return null // No image selected from the gallery
    }

    // Return the URI of the captured image
    return cameraResult.assets[0].uri
  } catch (error) {
    console.error('Error selecting image:', error)
    return null
  }
}
