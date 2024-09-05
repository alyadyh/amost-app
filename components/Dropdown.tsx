import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Octicons from '@expo/vector-icons/Octicons';

interface Item {
  label: string;
  value: any;
}

interface DropdownComponentProps {
  title: string;
  data: Item[];
  leftIcon?: any; 
  onChange?: (value: Item) => void;
}

const DropdownComponent: React.FC<DropdownComponentProps> = ({ title, data, leftIcon, onChange }) => {
  const [value, setValue] = useState<any>(null);
  
  const handleChange = (item: Item) => {
    setValue(item.value);
    if (onChange) {
      onChange(item);
    }
  };

  const renderItem = (item: Item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
        {item.value === value && leftIcon && (
          <Octicons
            style={styles.icon}
            color="black"
            name={leftIcon}
            size={20}
          />
        )}
      </View>
    );
  };

  return (
    <View className="space-y-2">
      <Text className="text-base text-amost-secondary-dark_1 font-medium">{title}</Text>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Pilih yang sesuai"
        searchPlaceholder="Cari..."
        value={value}
        onChange={handleChange}
        renderLeftIcon={() =>
          leftIcon ? <Octicons style={styles.icon} color="black" name={leftIcon} size={20} /> : null
        }
        renderItem={renderItem}
      />
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  dropdown: {
    width: '100%',
    height: 64,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#6E6E6E',
    padding: 12,
  },
  icon: {
    marginRight: 12,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#6E6E6E',
  },
  placeholderStyle: {
    fontSize: 16,
    paddingHorizontal: 4,
    fontWeight: '600',
    color: '#6E6E6E',
  },
  selectedTextStyle: {
    fontSize: 16,
    paddingHorizontal: 4,
    fontWeight: '600',
    color: '#454545',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
  },
});
