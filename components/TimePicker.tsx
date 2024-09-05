import Octicons from '@expo/vector-icons/Octicons';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet
} from 'react-native';
import PickerSelect from 'react-native-picker-select'; // Import PickerSelect

interface TimePickerProps {
  title: string;
  onConfirm?: (time: string) => void;
}

const TimePickerComponent: React.FC<TimePickerProps> = ({ title, onConfirm }) => {
  const [time, setTime] = useState({ hour: 0, minute: 0 });
  const [show, setShow] = useState(false);
  const [formattedTime, setFormattedTime] = useState('');

  const showTimepicker = () => setShow(true);

  const handleConfirm = () => {
    const formatted = `${time.hour.toString().padStart(2, '0')}:${time.minute
      .toString()
      .padStart(2, '0')}`;
    setFormattedTime(formatted);
    if (onConfirm) {
      onConfirm(formatted);
    }
    setShow(false);
  };

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
        <Octicons name='clock' size={20} style={{ color: "#6E6E6E" }} />
      </TouchableOpacity>
      <Modal
        transparent={true}
        animationType="slide"
        visible={show}
        onRequestClose={() => setShow(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShow(false)}
          className="flex-1 justify-center items-center bg-black/50"
        >
          <TouchableWithoutFeedback onPress={() => setShow(false)}>
            <View style={styles.modalContent}>
              <View className="flex-row items-center">
                {/* Hour Picker */}
                <PickerSelect
                  value={time.hour}
                  onValueChange={(value) =>
                    setTime(prevState => ({ ...prevState, hour: value }))
                  }
                  items={Array.from({ length: 24 }, (_, i) => ({
                    label: i.toString().padStart(2, '0'),
                    value: i,
                  }))}
                  useNativeAndroidPickerStyle={false}
                  style={pickerSelectStyles}
                />

                <Text className="text-xl mx-2.5">:</Text>

                {/* Minute Picker */}
                <PickerSelect
                  value={time.minute}
                  onValueChange={(value) =>
                    setTime(prevState => ({ ...prevState, minute: value }))
                  }
                  items={Array.from({ length: 60 }, (_, i) => ({
                    label: i.toString().padStart(2, '0'),
                    value: i,
                  }))}
                  useNativeAndroidPickerStyle={false}
                  style={pickerSelectStyles}
                />
              </View>
              <View className="">
                <TouchableOpacity onPress={handleConfirm} className="px-4 py-2 bg-amost-primary rounded-full">
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

const styles = StyleSheet.create({
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 18,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#6E6E6E',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    width: 80, // fixed width to make it consistent
  },
  inputAndroid: {
    fontSize: 18,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#6E6E6E',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    width: 80, // fixed width to make it consistent
  },
});
