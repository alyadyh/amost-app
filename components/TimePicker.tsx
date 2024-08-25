import Octicons from '@expo/vector-icons/Octicons';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';

interface TimePickerProps {
  title: string;
}

const TimePickerComponent: React.FC<TimePickerProps> = ({ title }) => {
  const [time, setTime] = useState({ hour: 0, minute: 0 });
  const [show, setShow] = useState(false);
  const [formattedTime, setFormattedTime] = useState('');

  const showTimepicker = () => setShow(true);

  const handleConfirm = () => {
    const formatted = `${time.hour.toString().padStart(2, '0')}:${time.minute
      .toString()
      .padStart(2, '0')}`;
    setFormattedTime(formatted);
    setShow(false);
  };

  const incrementHour = () => {
    setTime((prevState) => ({
      ...prevState,
      hour: (prevState.hour + 1) % 24,
    }));
  };

  const decrementHour = () => {
    setTime((prevState) => ({
      ...prevState,
      hour: (prevState.hour - 1 + 24) % 24,
    }));
  };

  const incrementMinute = () => {
    setTime((prevState) => ({
      ...prevState,
      minute: (prevState.minute + 5) % 60,
    }));
  };

  const decrementMinute = () => {
    setTime((prevState) => ({
      ...prevState,
      minute: (prevState.minute - 5 + 60) % 60,
    }));
  };

  return (
    <View className="space-y-2">
      <Text className="text-base text-amost-secondary-dark_1 font-medium">{title}</Text>
      <TouchableOpacity
        onPress={showTimepicker}
        activeOpacity={1}   //will not change its opacity when pressed
        className={`w-full h-16 px-4 rounded-2xl border-2 border-amost-secondary-dark_1 flex flex-row items-center`}
      >
        <TextInput
          className="flex-1 text-amost-secondary-dark_1 font-semibold text-base"
          placeholder="Select Time"
          value={formattedTime}
          editable={false}
          pointerEvents="none"
        />
        <Octicons name='clock' size={20} style={{ color: "#6E6E6E" }} />
      </TouchableOpacity>
      <Modal
        transparent={true}
        animationType="none"
        visible={show}
        onRequestClose={() => setShow(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShow(false)}>
          <View className="flex-1 justify-center items-center">
            <TouchableWithoutFeedback>
              <View className="w-[300px] bg-white rounded-3xl p-5 items-center shadow-lg shadow-black">
                <Text className="text-lg font-bold mb-5">Select Time</Text>
                <View className="flex-row items-center">
                  <View className="items-center mx-2.5">
                    <TouchableOpacity onPress={incrementHour} className="p-1">
                      <Text className="text-lg text-amost-primary">▲</Text>
                    </TouchableOpacity>
                    <Text className="text-xl my-2.5">
                      {time.hour.toString().padStart(2, '0')}
                    </Text>
                    <TouchableOpacity onPress={decrementHour} className="p-1">
                      <Text className="text-lg text-amost-primary">▼</Text>
                    </TouchableOpacity>
                  </View>
                  <Text className="text-xl">:</Text>
                  <View className="items-center mx-2.5">
                    <TouchableOpacity onPress={incrementMinute} className="p-1">
                      <Text className="text-lg text-amost-primary">▲</Text>
                    </TouchableOpacity>
                    <Text className="text-xl my-2.5">
                      {time.minute.toString().padStart(2, '0')}
                    </Text>
                    <TouchableOpacity onPress={decrementMinute} className="p-1">
                      <Text className="text-lg text-amost-primary">▼</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View className="mt-5">
                  <TouchableOpacity onPress={handleConfirm} className="px-4 py-2 bg-amost-primary rounded-full">
                    <Text className="text-white font-bold">Confirm</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default TimePickerComponent;
