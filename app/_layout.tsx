import { useFonts } from "expo-font";
import { Stack } from "expo-router";

export default function RootLayout() {
  useFonts({
    'Outfit-Regular':require('./../assets/fonts/Outfit-Regular.ttf'),
    'Outfit-Medium':require('./../assets/fonts/Outfit-Medium.ttf'),
    'Outfit-Bold':require('./../assets/fonts/Outfit-Bold.ttf'),
  })
  return (
    
    <Stack screenOptions={{headerShown:false}}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
