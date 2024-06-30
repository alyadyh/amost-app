import { View, Text } from 'react-native'
import React from 'react'

const Logs = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text className="text-3xl font-bold">Logs!</Text>
    </View>
  )
}

export default Logs