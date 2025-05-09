import { View, Text, Image, Modal } from "react-native";
import React from "react";
import { router, Tabs, usePathname, useRouter } from "expo-router";
import {
  Actionsheet,
  ActionsheetContent,
  ActionsheetItem,
  ActionsheetItemText,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetBackdrop,
} from "@/components/ui/actionsheet";
import { Button, ButtonText } from "@/components/ui/button";
import TabBar from "@/components/TabBar";
import { Feather } from "@expo/vector-icons";
import tabicons from "@/constants/tabicons";

const TabsLayout = () => {
  const pathname = usePathname();
  const [showActionsheet, setShowActionsheet] = React.useState(false);
  const handleClose = () => setShowActionsheet(false);
  const tabIcons = {
    index: tabicons.warehouse,
    addproduct: tabicons.PlusCircle,
    orders: tabicons.packageIcon,
    profile: "https://randomuser.me/api/portraits/men/1.jpg",
  };
  return (
    <>
      <Tabs
        backBehavior="history"
        tabBar={(props: any) => <TabBar {...props} tabIcons={tabIcons} />}>
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="addproduct"
          options={{
            title: "Add",
            headerShown: false,
          }}
          listeners={({}) => ({
            tabPress: (e: any) => {
              e.preventDefault(); // stop default behavior
              setShowActionsheet(true);
            },
          })}
        />
        <Tabs.Screen
          name="orders"
          options={{
            title: "Order",
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
          }}
        />
      </Tabs>
      <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent className="bg-black border border-black">
          <ActionsheetDragIndicatorWrapper className="pb-6">
            <ActionsheetDragIndicator className="w-12 h-[5px]" />
          </ActionsheetDragIndicatorWrapper>
          <View className="border border-white/90 rounded-md">
            <ActionsheetItem
              onPress={() => {
                router.push("/creator-store/add-product");
              }}
              className="flex-row justify-between items-center px-5 py-5 active:bg-[#E5FF03]">
              <Text
                className="text-white"
                style={{ fontSize: 17, fontFamily: "HelveticaNeue-Medium" }}>
                Add a new product
              </Text>
              <Feather name="camera" size={23} color="white" />
            </ActionsheetItem>
            <View className="border-t border-dashed border-white" />

            <ActionsheetItem
              onPress={() => {
                router.push("/creator-store/add-reel");
              }}
              className="flex-row justify-between items-center px-5 py-5 active:bg-[#E5FF03]">
              <Text
                className="text-white"
                style={{ fontSize: 17, fontFamily: "HelveticaNeue-Medium" }}>
                Upload Reel
              </Text>
              <Feather
                name="film"
                size={23}
                color="white"
                activeColor="black"
              />
            </ActionsheetItem>
          </View>
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
};

export default TabsLayout;
