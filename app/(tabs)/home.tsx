import { View, Text } from 'react-native'
import React from 'react'

const Home = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text className="text-3xl font-bold">HOME!</Text>
    </View>
  )
}

export default Home