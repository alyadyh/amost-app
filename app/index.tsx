import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function App() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text className="text-3xl font-bold">AMOST!</Text>
      <Link href="/home" style={{ color: 'blue' }}>Go to Home</Link>
    </View>
  );
}
