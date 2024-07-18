import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const MedLayout = () => {
  return (
    <>
      <Stack screenOptions={{animation: "none"}}>
        <Stack.Screen name="add-med" options={{ headerShown: false }} />
      </Stack>
    </>
  );
};

export default MedLayout;
