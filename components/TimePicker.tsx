import Octicons from '@expo/vector-icons/Octicons';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
interface TimePickerProps {
  title: string;
  onConfirm?: (time: string) => void;
  value?: string;
}

const TimePickerComponent: React.FC<TimePickerProps> = ({ title, onConfirm, value }) => {
  const [time, setTime] = useState<{
    hour: { label: string; value: number }, 
    minute: { label: string; value: number } 
  }>({
    hour: { label: '00', value: 0 },
    minute: { label: '00', value: 0 },
  });
  const [show, setShow] = useState(false);
  const [formattedTime, setFormattedTime] = useState(value || '');

  const showTimepicker = () => setShow(true);

  useEffect(() => {
    console.log('TimePicker re-rendered with value:', value);
    if (value !== formattedTime) {
      setFormattedTime(value || '');
    }
  }, [value, formattedTime]);  

  const handleConfirm = () => {
    const formatted = `${time.hour.label}:${time.minute.label}`;
    setFormattedTime(formatted);
    if (onConfirm) {
      onConfirm(formatted);
    }
    setShow(false);
  };

  const hourData = Array.from({ length: 24 }, (_, i) => ({
    label: i.toString().padStart(2, '0'),
    value: i,
  }));

  // Minute data in multiples of 5
  const minuteData = Array.from({ length: 12 }, (_, i) => {
    const minuteValue = i * 5;
    return {
      label: minuteValue.toString().padStart(2, '0'),
      value: minuteValue,
    };
  });

  return (
    <View className="space-y-2">
      <Text className="text-base text-amost-secondary-dark_1 font-medium">{title}</Text>
      <TouchableOpacity
        onPress={showTimepicker}
        activeOpacity={0.7}
        className="w-full h-16 px-4 rounded-2xl border-2 border-amost-secondary-dark_2 flex-row items-center"
      >
        <TextInput
          className="flex-1 text-amost-secondary-dark_1 font-semibold text-base"
          placeholder="00:00"
          value={formattedTime}
          editable={false}
          pointerEvents="none"
        />
        <Octicons name="clock" size={20} style={{ color: '#6E6E6E' }} />
      </TouchableOpacity>

      <Modal
        transparent={true}
        animationType="none"
        visible={show}
        onRequestClose={() => setShow(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShow(false)}
          className="flex-1 justify-center items-center bg-black/50"
        >
          <TouchableWithoutFeedback onPress={() => setShow(false)}>
            <View className="w-72 bg-white rounded-2xl p-4 px-6 items-center">
              <View className="flex-row items-center">
                {/* Hour Dropdown */}
                <Dropdown
                  style={pickerSelectStyles.dropdown}
                  containerStyle={pickerSelectStyles.dropdownContainer}
                  itemTextStyle={pickerSelectStyles.textItem}
                  selectedTextStyle={pickerSelectStyles.textItem}
                  renderRightIcon={() => null}
                  data={hourData}
                  labelField="label"
                  valueField="value"
                  placeholder="00"
                  value={time.hour} // Pass the full object (hour)
                  onChange={(item) => setTime((prev) => ({ ...prev, hour: item }))}
                />

                <Text className="text-xl mx-2.5">:</Text>

                {/* Minute Dropdown */}
                <Dropdown
                  style={pickerSelectStyles.dropdown}
                  containerStyle={pickerSelectStyles.dropdownContainer}
                  itemTextStyle={pickerSelectStyles.textItem}
                  selectedTextStyle={pickerSelectStyles.textItem}
                  renderRightIcon={() => null}
                  data={minuteData}
                  labelField="label"
                  valueField="value"
                  placeholder="00"
                  value={time.minute}
                  onChange={(item) => setTime((prev) => ({ ...prev, minute: item }))}
                />
              </View>
              <View className="mt-4">
                <TouchableOpacity
                  onPress={handleConfirm}
                  className="px-4 py-2 bg-amost-primary rounded-full"
                >
                  <Text className="text-white font-bold">Konfirmasi</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default TimePickerComponent;

const pickerSelectStyles = StyleSheet.create({
  dropdown: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#6E6E6E',
    borderRadius: 14,
    width: 80,
  },
  dropdownContainer: {
    maxHeight: 150,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    borderWidth: 2,
    borderTopWidth: 0,
    marginTop: 20,
  },
  textItem: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6E6E6E',
    textAlign: 'center',
  },
});
