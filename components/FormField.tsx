import { Octicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, TextInputProps } from "react-native";

interface FormFieldProps extends TextInputProps {
  title: string;
  value: string;
  placeholder: string;
  handleChangeText: (text: string) => void;
  otherStyles?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-amost-secondary-dark_1 font-bold">{title}</Text>

      <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-amost-secondary-dark_1 focus:border-secondary flex flex-row items-center">
        <TextInput
          className="flex-1 text-amost-secondary-dark_1 font-semibold text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="text-amost-secondary-dark_2"
          onChangeText={handleChangeText}
          secureTextEntry={(title === "Password" || title === "Konfirmasi Password") && !showPassword}
          {...props}
        />

        {(title === "Password" || title === "Konfirmasi Password") && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            { !showPassword ? <Octicons name="eye" size={24} /> : <Octicons name="eye-closed" size={24} /> }
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
