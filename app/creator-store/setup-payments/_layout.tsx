import { router, Stack, useRouter, Slot } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Button, Text } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

export default function RootLayout() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Add Payments",
          headerShown: true,
          headerTitleAlign: "center",
          headerTintColor: "white",
          headerTitleStyle: {
            fontFamily: "HelveticaNeue-Bold",
            fontSize: 18,
          },
          headerTransparent: true,

          headerLeft: () => (
            <TouchableOpacity onPressIn={() => router.back()}>
              <Ionicons name="chevron-back" size={16} color="white" />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
