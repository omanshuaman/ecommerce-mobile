import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  Text,
  ImageBackground,
  Dimensions,
  StatusBar,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { router, useLocalSearchParams } from "expo-router";
import {
  Select,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContentText,
  AccordionIcon,
  AccordionContent,
} from "@/components/ui/accordion";
import { RemoveIcon, AddIcon } from "@/components/ui/icon";
import { Box } from "@/components/ui/box";
import { useProduct } from "@/store/productStore";
import { fetchProductById, listProducts } from "@/api/products";
import { useQuery } from "@tanstack/react-query";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { Input } from "@/components/ui/input";
import { useBreakpointValue } from "@/components/ui/utils/use-break-point-value";
import ProductCard from "@/components/ProductCard";

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [showActionsheet, setShowActionsheet] = React.useState(false);
  const handleClose = () => setShowActionsheet(false);
  const [offersexpanded, offersSetIsExpanded] = useState(false);
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products", id],
    queryFn: () => fetchProductById(Number(id)),
  });
  const {
    data: products,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
    error: errorProducts,
  } = useQuery({
    queryKey: ["products"],
    queryFn: listProducts,
  });
  if (isLoading) {
    return (
      <Box className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator size="large" color="#fff" />
      </Box>
    );
  }
  if (error) {
    return <Text>Product not found!</Text>;
  }

  return (
    <SafeAreaView className="flex-1">
      <StatusBar backgroundColor={"#3b2c2d"} barStyle="light-content" />

      <ImageBackground
        source={require("../../../assets/bg-image.jpg")}
        style={{ flex: 1, paddingTop: 50 }}
        resizeMode="cover">
        <ScrollView className="px-4 py-6">
          <View className="relative">
            <Image
              source={{ uri: product.images[0] }}
              className="w-full mb-4 h-96"
              style={{ width: Dimensions.get("window").width - 40 }}
              resizeMode="cover"
            />

            <View className="absolute bottom-6 left-2 flex-row items-center space-x-1 gap-1">
              <Text
                className="bg-[#E5FF03] text-black text-2xl px-2 pt-0.5 border border-gray-800 shadow-lg shadow-gray-950"
                style={{ fontFamily: "PPFormulaCondensed-Bold", fontSize: 20 }}>
                OBSESSED
              </Text>
              <Text className="text-xl bg-white text-black font-normal px-2 py-0.5 border border-gray-800 rounded-sm">
                Like new
              </Text>
            </View>
          </View>

          <Text
            className="text-white uppercase"
            style={{
              fontFamily: "PPFormulaCondensed-Bold",
              fontSize: 40,
            }}>
            {product.title}
          </Text>

          <Box className="flex-row items-center gap-2">
            <Text className="text-xl text-white font-bold">
              ₹
              {Math.round(
                product.price / (1 - product.discountPercentage / 100)
              )}
            </Text>
            <Text className="text-lg text-gray-400 line-through">
              ₹{product.price}
            </Text>
          </Box>

          <Text className="text-white text-base mt-2">
            {product.description}
          </Text>

          <Box className="flex-row justify-between items-center py-5">
            <View className="flex-row justify-between items-center gap-2">
              <Image
                source={{
                  uri: "https://randomuser.me/api/portraits/women/1.jpg",
                }}
                className="size-6 rounded-full"
              />
              <Text
                className="text-white text-base"
                style={{ fontFamily: "HelveticaNeue-Medium", fontSize: 16 }}>
                Samuil Sadovsky
              </Text>
            </View>

            <TouchableOpacity className="border border-white px-2 py-1 rounded-sm">
              <Text
                className="text-gray-300"
                style={{ fontFamily: "HelveticaNeue-Medium", fontSize: 15 }}>
                View Store
              </Text>
            </TouchableOpacity>
          </Box>

          <View className="border border-white rounded-sm mt-1">
            <View
              className="flex-row justify-between items-center px-4 py-5"
              style={{
                borderBottomColor: "white",
                borderBottomWidth: 1,
                borderStyle: "dashed",
              }}>
              <Text
                className="text-white font-semibold text-lg"
                style={{ fontFamily: "HelveticaNeue-Medium" }}>
                Available Colors
              </Text>
              <View
                className="w-6 h-6 rounded-sm border border-white"
                style={{
                  backgroundColor: "#3b2c2d",
                }}
              />
            </View>

            <View
              className="flex-row justify-between items-center px-4 py-5"
              style={{
                borderBottomColor: "white",
                borderBottomWidth: 1,
                borderStyle: "dashed",
              }}>
              <Text
                className="text-white font-semibold text-lg"
                style={{ fontFamily: "HelveticaNeue-Medium" }}>
                Size
              </Text>
              <Text
                className="text-white font-semibold text-lg"
                style={{ fontFamily: "HelveticaNeue-Medium" }}>
                Medium
              </Text>
            </View>
            <Accordion
              size="md"
              variant="filled"
              type="single"
              isCollapsible={true}
              isDisabled={false}
              className="w-[100%]">
              <AccordionItem value="a">
                <AccordionHeader
                  className="bg-[#161616] py-2"
                  style={{
                    borderBottomColor: "white",
                    borderBottomWidth: detailsExpanded ? 0 : 1,
                    borderStyle: "dashed",
                  }}>
                  <AccordionTrigger>
                    {({ isExpanded }: { isExpanded: boolean }) => {
                      useEffect(() => {
                        setDetailsExpanded(isExpanded);
                      }, [isExpanded]);

                      return (
                        <>
                          <Text
                            className="text-white font-semibold text-lg"
                            style={{ fontFamily: "HelveticaNeue-Medium" }}>
                            Details
                          </Text>
                          {isExpanded ? (
                            <AccordionIcon
                              as={RemoveIcon}
                              className="ml-3"
                              color="white"
                              size="xl"
                            />
                          ) : (
                            <AccordionIcon
                              as={AddIcon}
                              className="ml-3"
                              color="white"
                              size="xl"
                            />
                          )}
                        </>
                      );
                    }}
                  </AccordionTrigger>
                </AccordionHeader>
                <AccordionContent className="bg-[#161616]">
                  <AccordionContentText className="text-white">
                    <View className="py-6">
                      <Text
                        className="text-white font-semibold text-lg"
                        style={{ fontFamily: "HelveticaNeue-Medium" }}>
                        Condition Details
                      </Text>
                      <Text
                        className="text-gray-100 text-base mb-4"
                        style={{ fontFamily: "HelveticaNeue-Light" }}>
                        Slight pilling on sleeves, soft fabric
                      </Text>

                      <Text
                        className="text-white font-semibold text-lg"
                        style={{ fontFamily: "HelveticaNeue-Medium" }}>
                        Design
                      </Text>
                      <Text
                        className="text-gray-100 text-base mb-4"
                        style={{ fontFamily: "HelveticaNeue-Light" }}>
                        Ribbed knit with relaxed fit
                      </Text>
                      <View className="flex-row items-center gap-2 justify-between w-full mb-4">
                        <Text
                          className="text-white font-semibold text-lg"
                          style={{ fontFamily: "HelveticaNeue-Medium" }}>
                          Listed date
                        </Text>
                        <Text
                          className="text-white font-semibold text-lg"
                          style={{ fontFamily: "HelveticaNeue-Medium" }}>
                          2025-03-31
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-2 justify-between w-full mb-4">
                        <Text
                          className="text-white font-semibold text-lg"
                          style={{ fontFamily: "HelveticaNeue-Medium" }}>
                          Style
                        </Text>
                        <Text
                          className="text-white font-semibold text-lg"
                          style={{ fontFamily: "HelveticaNeue-Medium" }}>
                          Off Shoulder
                        </Text>
                      </View>

                      <View className="flex-row items-center gap-2 justify-between w-full mb-4">
                        <Text
                          className="text-white font-semibold text-lg"
                          style={{ fontFamily: "HelveticaNeue-Medium" }}>
                          Occasion
                        </Text>
                        <Text
                          className="text-white font-semibold text-lg"
                          style={{ fontFamily: "HelveticaNeue-Medium" }}>
                          Casual
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-2 justify-between w-full mb-4">
                        <Text
                          className="text-white font-semibold text-lg"
                          style={{ fontFamily: "HelveticaNeue-Medium" }}>
                          Primary Material
                        </Text>
                        <Text
                          className="text-white font-semibold text-lg"
                          style={{ fontFamily: "HelveticaNeue-Medium" }}>
                          Cotton
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-2 justify-between w-full mb-4">
                        <Text
                          className="text-white font-semibold text-lg"
                          style={{ fontFamily: "HelveticaNeue-Medium" }}>
                          Brand Name
                        </Text>
                        <Text
                          className="text-white font-semibold text-lg"
                          style={{ fontFamily: "HelveticaNeue-Medium" }}>
                          Fab india
                        </Text>
                      </View>
                    </View>
                  </AccordionContentText>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="b">
                <AccordionHeader
                  className="bg-[#161616] py-2"
                  style={{
                    borderBottomColor: "white",
                    borderBottomWidth: offersexpanded ? 0 : 1,
                    borderStyle: "dashed",
                  }}>
                  <AccordionTrigger>
                    {({ isExpanded }: { isExpanded: boolean }) => {
                      useEffect(() => {
                        offersSetIsExpanded(isExpanded);
                      }, [isExpanded]);

                      return (
                        <>
                          <Text
                            className="text-white font-semibold text-lg"
                            style={{ fontFamily: "HelveticaNeue-Medium" }}>
                            Offers
                          </Text>
                          {isExpanded ? (
                            <AccordionIcon
                              as={RemoveIcon}
                              className="ml-3"
                              color="white"
                              size="xl"
                            />
                          ) : (
                            <AccordionIcon
                              as={AddIcon}
                              className="ml-3"
                              color="white"
                              size="xl"
                            />
                          )}
                        </>
                      );
                    }}
                  </AccordionTrigger>
                </AccordionHeader>
                <AccordionContent className="bg-[#161616]">
                  <AccordionContentText className="text-white">
                    <View className=" py-4">
                      <Text
                        className="text-white mb-2"
                        style={{
                          fontFamily: "HelveticaNeue-Medium",
                          fontSize: 15,
                        }}>
                        Flat 15% off on winterwear
                      </Text>
                      <Text
                        className="text-gray-300"
                        style={{ fontFamily: "HelveticaNeue-Light" }}>
                        Code: FLAT15
                      </Text>
                    </View>
                  </AccordionContentText>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="c">
                <AccordionHeader className="bg-[#161616] py-2">
                  <AccordionTrigger>
                    {({ isExpanded }: { isExpanded: boolean }) => (
                      <>
                        <Text
                          className="text-white font-semibold text-lg"
                          style={{ fontFamily: "HelveticaNeue-Medium" }}>
                          Delivery
                        </Text>
                        {isExpanded ? (
                          <AccordionIcon
                            as={RemoveIcon}
                            className="ml-3"
                            color="white"
                            size="xl"
                          />
                        ) : (
                          <AccordionIcon
                            as={AddIcon}
                            className="ml-3"
                            color="white"
                            size="xl"
                          />
                        )}
                      </>
                    )}
                  </AccordionTrigger>
                </AccordionHeader>
                <AccordionContent className="bg-[#161616]">
                  <AccordionContentText className="text-white">
                    <View className="py-2 flex-row justify-between items-center w-full">
                      <Text
                        className="text-white font-semibold text-lg"
                        style={{
                          fontFamily: "HelveticaNeue-Medium",
                        }}>
                        Enter PIN
                      </Text>
                      <View className="flex-row items-center gap-2">
                        <Input className="bg-black h-fit" size="xl">
                          <TextInput
                            placeholder="Enter PIN"
                            placeholderTextColor="#888"
                            className="text-white px-2"
                            style={{ fontSize: 18 }}
                            ref={(ref) => {
                              if (ref) {
                                ref.setNativeProps({
                                  style: {
                                    fontFamily: "HelveticaNeue-Bold",
                                  },
                                });
                              }
                            }}
                          />
                        </Input>
                        <TouchableOpacity className=" rounded-sm">
                          <Text
                            className="text-white"
                            style={{
                              fontFamily: "HelveticaNeue-Medium",
                              fontSize: 16,
                            }}>
                            Check
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </AccordionContentText>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </View>
          <View className="mb-10">
            <Text
              className="text-white py-4"
              style={{ fontFamily: "HelveticaNeue-Medium", fontSize: 16 }}>
              You may also like it
            </Text>
            <View className="flex flex-row flex-wrap gap-2 max-w-[960px] mx-auto w-full">
              {products.slice(0, 4).map((item: any, index: number) => (
                <TouchableOpacity key={index.toString()} className="w-[48%]">
                  <View className="overflow-hidden">
                    <View className="relative">
                      <Image
                        source={{ uri: item.images[0] }}
                        className="w-full h-48"
                        resizeMode="cover"
                      />
                      <View className="absolute bottom-1 left-1 flex-row items-center space-x-1 px-2 py-1 rounded-md gap-1">
                        <Text
                          className="bg-[#E5FF03] text-black px-2 pt-0.5 border border-gray-800 shadow-lg shadow-gray-950"
                          style={{
                            fontFamily: "PPFormulaCondensed-Bold",
                            fontSize: 15,
                          }}>
                          OBSESSED
                        </Text>
                        <Text
                          className=" bg-white text-black font-normal px-1 py-1 border border-gray-800"
                          style={{
                            fontFamily: "HelveticaNeue-Medium",
                            fontSize: 12,
                          }}>
                          Like new
                        </Text>
                      </View>
                    </View>

                    {/* Product Info */}
                    <View className="px-3 pt-2 pb-3">
                      <Text
                        className="text-white w-full"
                        numberOfLines={1}
                        style={{
                          fontFamily: "HelveticaNeue-Bold",
                          fontSize: 15,
                        }}>
                        {item.title}
                      </Text>
                      <Text
                        className="text-white mt-1"
                        style={{
                          fontFamily: "HelveticaNeue-Light",
                          fontSize: 13,
                        }}>
                        ₹{item.price}
                      </Text>
                      <Text
                        className="text-white mt-1"
                        style={{
                          fontFamily: "HelveticaNeue-Light",
                          fontSize: 13,
                        }}>
                        {item.brand}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
        <Box className="flex-row gap-3 p-2">
          <TouchableOpacity className="flex-1 bg-[#E5FF03] justify-center items-center py-2 rounded-sm shadow-lg shadow-white ">
            <Text
              className="text-black uppercase"
              style={{
                fontFamily: "PPFormulaCondensed-Bold",
                fontSize: 36,
              }}>
              Add to bag
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-1/5 border border-[#E5FF03] bg-transparent justify-center items-center py-2 rounded-sm  "
            onPress={() => setShowActionsheet(true)}>
            <AntDesign name="hearto" size={24} color="#E5FF03" />
          </TouchableOpacity>
        </Box>
        <Select className="">
          <SelectPortal isOpen={showActionsheet} onClose={handleClose}>
            <SelectBackdrop />
            <SelectContent className="bg-black border border-dashed p-4">
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              <Text
                className="text-white py-2"
                style={{ fontSize: 15, fontFamily: "HelveticaNeue-Medium" }}>
                Are you sure you want to unpublish?
              </Text>
              <Text
                className=" text-typography-400 pb-6 text-center "
                style={{ fontSize: 14, fontFamily: "HelveticaNeue-Light" }}>
                Unpublishing will remove it from people who have added it to
                their bag
              </Text>
              <TouchableOpacity className="bg-black py-2 border border-white items-center shadow-lg shadow-slate-50 rounded-sm w-full">
                <Text
                  className="text-white"
                  style={{
                    fontFamily: "PPFormulaCondensed-Bold",
                    fontSize: 36,
                  }}>
                  UNPUBLISH
                </Text>
              </TouchableOpacity>

              {/* Update Button */}
              <TouchableOpacity className="bg-[#E5FF03] py-1 mt-3 items-center shadow-lg shadow-slate-50 rounded-sm w-full">
                <Text
                  className="text-black"
                  style={{
                    fontFamily: "PPFormulaCondensed-Bold",
                    fontSize: 36,
                  }}>
                  CANCEL
                </Text>
              </TouchableOpacity>
            </SelectContent>
          </SelectPortal>
        </Select>
      </ImageBackground>
    </SafeAreaView>
  );
}
