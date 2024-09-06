import React from 'react';
import { LineChart } from "react-native-chart-kit";
import { useWindowDimensions, Text, View } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

const BezierLineChart = () => {
  const { width } = useWindowDimensions()

  return (
    <View className='mt-6'>
      <LinearGradient
        colors={['#ff8a00', '#ffa726']}
        start={[0, 0]}
        end={[1, 1]}
        style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10, paddingTop: 16, paddingLeft: 16, paddingBottom: 32, paddingRight: 16 }}
      >
        <Text style={{ fontSize: 16, fontWeight: '600', color: 'white' }}>Grafik Kepatuhan Anda</Text>
      </LinearGradient>
      <LineChart
        data={{
          labels: ["January", "February", "March", "April", "May", "June"],
          datasets: [
            {
              data: [
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100
              ]
            }
          ] 
        }}
        width={width - 48}
        height={220}
        // yAxisLabel="$"
        yAxisSuffix="%"
        yAxisInterval={1}
        chartConfig={{
          backgroundColor: "#e26a00",
          backgroundGradientFrom: "#fb8c00",
          backgroundGradientTo: "#ffa726",
          decimalPlaces: 0, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#ffa726"
          }
        }}
        bezier
        style={{
          borderRadius: 10,
          marginTop: -10
        }}
      />
    </View>
  );
};

export default BezierLineChart;
