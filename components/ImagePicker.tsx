import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

interface ImagePickerComponentProps {
  title: string;
  value: string;
  onImageSelect: (uri: string) => void;
}

const ImagePickerComponent: React.FC<ImagePickerComponentProps> = ({
  title,
  value,
  onImageSelect,
}) => {
  const [imageUri, setImageUri] = useState<string>(value);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImageUri = result.assets[0].uri;
      setImageUri(selectedImageUri);
      onImageSelect(selectedImageUri); // Use the correct prop name
    }
  };

  return (
    <View className="space-y-2">
      <Text className="text-base text-amost-secondary-dark_1 font-medium">{title}</Text>

      <TouchableOpacity onPress={pickImage} activeOpacity={0.7}>
        <View className="w-full h-16 px-4 rounded-2xl border-2 border-amost-secondary-dark_2 flex flex-row items-center">
          <Octicons name="image" size={20} style={{ marginRight: 14, color: "#6E6E6E" }} />

          <TextInput
            className={`flex-1 text-base font-semibold ${imageUri ? 'text-amost-secondary-dark_1' : 'text-amost-secondary-dark_2'}`}
            value={imageUri ? imageUri : "Masukkan Foto Obat"} // Placeholder when no image is selected
            placeholderTextColor="text-amost-secondary-dark_2"
            editable={false}
          />
        </View>
      </TouchableOpacity>

      {imageUri && (
        <View style={{ marginTop: 10, alignItems: 'center' }}>
          <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />
        </View>
      )}
    </View>
  );
};

export default ImagePickerComponent;
