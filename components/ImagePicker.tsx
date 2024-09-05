import React, { useState } from 'react';
import { View, Image, Button, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const ImagePickerComponent = ({ onImageSelect }: { onImageSelect: (uri: string) => void }) => {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    // Ask for permission to access media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    // Open image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // Check if the user canceled the picker or if an image was selected
    if (!result.canceled) {
        // Use `assets` array to get the image URI
        const selectedImageUri = result.assets[0].uri;
        setImage(selectedImageUri);
  
        // If the onImageSelect prop is provided, call it with the selected image URI
        if (onImageSelect) {
          onImageSelect(selectedImageUri);
        }
      }
    };

  return (
    <View style={{ alignItems: 'center', marginVertical: 10 }}>
      <Button title="Upload Image" onPress={pickImage} />

      {image && (
        <View style={{ marginTop: 10, alignItems: 'center' }}>
          <Text>Selected Image:</Text>
          <Image source={{ uri: image }} style={{ width: 200, height: 200, marginTop: 10 }} />
        </View>
      )}
    </View>
  );
};

export default ImagePickerComponent;
