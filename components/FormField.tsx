import { Octicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, TextInputProps } from "react-native";

interface FormFieldProps extends TextInputProps {
  title: string;
  value: string;
  placeholder: string;
  leftIcon?: any;
  handleChangeText: (text: string) => void;
  otherStyles?: string;
  errorMessage?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  title,
  value,
  placeholder,
  leftIcon,
  handleChangeText,
  otherStyles,
  errorMessage,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-amost-secondary-dark_1 font-bold">{title}</Text>

      <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-amost-secondary-dark_1 focus:border-secondary flex flex-row items-center">
        {leftIcon && <Octicons name={leftIcon} size={20} style={{ marginRight: 14, color: "#6E6E6E" }} />}

        <TextInput
          className="flex-1 text-amost-secondary-dark_1 font-semibold text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="text-amost-secondary-dark_2"
          onChangeText={handleChangeText}
          secureTextEntry={(title === "Password" || title === "Konfirmasi Password") && !showPassword}
          {...props}
          // errorMessage={errorMessage}
          // errorStyle={{}}
          // errorProps={{}}
        />


        {(title === "Password" || title === "Konfirmasi Password") && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            { !showPassword ? <Octicons name="eye" size={24} style={{ color: "#6E6E6E" }} /> : <Octicons name="eye-closed" size={24} style={{ color: "#6E6E6E" }} /> }
          </TouchableOpacity>
        )}
      </View>
      {errorMessage && <Text className="text-xs text-red">{errorMessage}</Text>}
    </View>
  );
};

export default FormField;
