import { View, Text } from 'react-native'
import React from 'react'

const Medication = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text className="text-3xl font-bold">Medication!</Text>
    </View>
  )
}

export default Medication