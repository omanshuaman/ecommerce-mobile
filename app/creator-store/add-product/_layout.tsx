import { router, Stack, useRouter, Slot } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Button, Text } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { headingStyle } from "@/components/ui/heading/styles";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const router = useRouter();

  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Add Product",
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
    </SafeAreaProvider>
  );
}
