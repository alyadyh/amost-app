import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const MedLayout = () => {
  return (
    <>
      <Stack screenOptions={{animation: "none"}}>
        <Stack.Screen name="addMed" options={{ headerShown: false }} />
        <Stack.Screen name="editMed" options={{ headerShown: false }} />
        <Stack.Screen name="logMed" options={{ headerShown: false }} />
        <Stack.Screen name="medDetail" options={{ headerShown: false }} />
      </Stack>
    </>
  );
};

export default MedLayout;
