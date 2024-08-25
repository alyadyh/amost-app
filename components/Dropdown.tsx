import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Octicons from '@expo/vector-icons/Octicons';

interface Item {
  label: string;
  value: string;
}

interface DropdownComponentProps {
  title: string;
  data: Item[];
  leftIcon?: any; // Optional leftIcon
}

const DropdownComponent: React.FC<DropdownComponentProps> = ({ title, data, leftIcon }) => {
  const [value, setValue] = useState<string | null>(null);

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
      <View style={styles.dropdownContainer}>
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
          placeholder="Select item"
          searchPlaceholder="Search..."
          value={value}
          onChange={item => {
            setValue(item.value);
          }}
          renderLeftIcon={() => (
            leftIcon ? <Octicons style={styles.icon} color="black" name={leftIcon} size={20} /> : null
          )}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  dropdownContainer: {
    alignItems: 'center',
  },
  dropdown: {
    width: '100%',
    height: 64,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#454545',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
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
  },
  placeholderStyle: {
    color: '#454545',
    fontSize: 16,
    paddingHorizontal: 4,
  },
  selectedTextStyle: {
    fontSize: 16,
    paddingHorizontal: 4,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
