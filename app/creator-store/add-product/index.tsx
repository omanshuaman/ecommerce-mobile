import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  ImageBackground,
  StatusBar,
} from "react-native";
import { Image } from "react-native";
import {
  AntDesign,
  Feather,
  FontAwesome6,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { usePathname, useRouter } from "expo-router";
import BrandModal from "./components/BrandModal";
import CategoryModal from "./components/CategoryModal";
import ProductConditionModal from "./components/ProductConditionModal";
import PrimaryMaterialModal from "./components/PrimaryMaterialModal";
import PrimaryColorModal from "./components/PrimaryColorModal";
import OccasionModal from "./components/OccasionModal";
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionTitleText,
  AccordionContentText,
  AccordionIcon,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  AddIcon,
  ExternalLinkIcon,
  RemoveIcon,
} from "@/components/ui/icon";
import { Divider } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Video } from "expo-av";
import { useProduct } from "@/store/productStore";
import { SafeAreaView } from "react-native-safe-area-context";

const AddProduct = () => {
  const [product, setProduct] = useState({
    id: Date.now(),
    image: null,
    video: null,
    mediaFiles: [] as { uri: string; type: "image" | "video" }[],
    selectedBrand: "",
    selectedCategory: [],
    originalPrice: "",
    discountedPrice: "",
    pieces: "",
    description: "",
    selectedProductCondition: "",
    selectedPrimaryMaterial: "",
    selectedPrimaryColor: "",
    selectedOccasion: "",
    productName: "",
    conditionDescription: "",
  });
  const [brandmodal, setBrandModal] = useState(false);
  const [categorymodal, setCategoryModal] = useState(false);
  const [productConditionmodal, setProductConditionModal] = useState(false);
  const [primaryMaterialModal, setPrimaryMaterialModal] = useState(false);
  const [primaryColorModal, setPrimaryColorModal] = useState(false);
  const [occasionModal, setOccasionModal] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();
  const items = useProduct((state: any) => state.items);
  useEffect(() => {
    if (!items || items.length === 0 || !items[0].product) return;
    setProduct((prev: any) => {
      // Prevent re-setting if values are already same (optional optimization)
      if (prev.productName === items[0].product.productName) return prev;

      return {
        ...prev,
        productName: items[0].product.productName,
        image: items[0].product.image,
        video: items[0].product.video,
        mediaFiles: items[0].product.mediaFiles,
        selectedBrand: items[0].product.selectedBrand,
        selectedCategory: items[0].product.selectedCategory,
        originalPrice: items[0].product.originalPrice,
        discountedPrice: items[0].product.discountedPrice,
        pieces: items[0].product.pieces,
        description: items[0].product.description,
        selectedProductCondition: items[0].product.selectedProductCondition,
        selectedPrimaryMaterial: items[0].product.selectedPrimaryMaterial,
        selectedPrimaryColor: items[0].product.selectedPrimaryColor,
        selectedOccasion: items[0].product.selectedOccasion,
        conditionDescription: items[0].product.conditionDescription,
      };
    });
  }, [items]);
  const path = usePathname();

  const updateProduct = (key: string, value: any) => {
    setProduct((prev) => ({ ...prev, [key]: value }));
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    if (!result.canceled) {
      updateProduct("image", result.assets[0].uri);
    }
  };

  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      quality: 1,
    });

    if (!result.canceled) {
      updateProduct("video", result.assets[0].uri);
    }
  };

  const addAnotherMedia = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });

    if (!result.canceled) {
      const fileType = result.assets[0].type?.includes("video")
        ? "video"
        : "image";
      updateProduct("mediaFiles", [
        ...product.mediaFiles,
        { uri: result.assets[0].uri, type: fileType },
      ]);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!product.image) newErrors.image = "Please upload a photo.";
    if (!product.productName)
      newErrors.productName = "Please enter a product name.";
    if (!product.selectedBrand)
      newErrors.selectedBrand = "Please select a brand.";
    if (product.selectedCategory.length === 0)
      newErrors.selectedCategory = "Please select at least one category.";
    if (!product.originalPrice || isNaN(Number(product.originalPrice)))
      newErrors.originalPrice = "Please enter a valid original price.";
    if (!product.discountedPrice || isNaN(Number(product.discountedPrice)))
      newErrors.discountedPrice = "Please enter a valid discounted price.";
    if (!product.pieces || isNaN(Number(product.pieces)))
      newErrors.pieces = "Please enter a valid number of pieces.";
    if (!product.selectedProductCondition)
      newErrors.selectedProductCondition = "Please select a product condition.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const saveProductToFile = async () => {
    try {
      const existingData = await AsyncStorage.getItem("myData");
      const parsedData = existingData ? JSON.parse(existingData) : [];

      let updatedData;

      if (path === "/creator-store/edit-product") {
        updatedData = parsedData.filter(
          (item: { id: string }) => String(item.id) !== String(product.id)
        );

        updatedData.push(product);
        Alert.alert("Success", "Product updated successfully.");
      } else {
        // Add new product
        updatedData = [...parsedData, product];
        Alert.alert("Success", "Product added successfully.");
      }

      await AsyncStorage.setItem("myData", JSON.stringify(updatedData));
    } catch (error) {
      Alert.alert("Error", "Failed to save product.");
      console.error(error);
    }
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#000" }}>
      <StatusBar backgroundColor={"#3b2c2d"} barStyle="light-content" />
      <ImageBackground
        source={require("../../../assets/bg-image.jpg")}
        style={{ flex: 1, paddingTop: 50 }}
        resizeMode="cover">
        <ScrollView className=" py-2 " nestedScrollEnabled={true}>
          {/* Upload Photo & Reel */}
          <View className="flex-row justify-between gap-2 mb-4 px-2 mr-2">
            {product.image ? (
              <TouchableOpacity className="w-3/5 mx-auto border border-white relative rounded-sm h-60">
                <Image
                  source={{ uri: product.image }}
                  resizeMode="cover"
                  className="w-full h-full self-center rounded-sm bg-black"
                />
                <TouchableOpacity
                  onPress={() => updateProduct("image", null)}
                  className="absolute text-white bg-black p-3 rounded-sm"
                  style={{
                    bottom: "5%",
                    left: "50%",
                    transform: [{ translateX: -16 }],
                  }}>
                  <AntDesign name="delete" size={14} color="white" />
                </TouchableOpacity>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={pickImage}
                className="w-3/5 mx-auto border border-white items-center justify-center rounded-sm h-60">
                <Ionicons name="image-outline" size={24} color="white" />
                <Text
                  className="text-white mt-2"
                  style={{
                    fontFamily: "HelveticaNeue-Medium",
                  }}>
                  Upload Photo
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {errors.image && (
            <Text className="text-red-500 text-sm px-2">{errors.image}</Text>
          )}
          <View className="px-6">
            <ScrollView horizontal className="mb-2">
              {product.mediaFiles.map((file, index) => (
                <View key={index} className="relative mr-4">
                  {file.type === "image" ? (
                    <Image
                      source={{ uri: file.uri }}
                      resizeMode="cover"
                      className="w-40 h-48 rounded-sm bg-black"
                    />
                  ) : (
                    <Video
                      source={{ uri: file.uri }}
                      className="rounded-sm bg-black"
                      style={{ width: 160, height: 192 }}
                      useNativeControls
                    />
                  )}
                  <TouchableOpacity
                    onPress={() => {
                      updateProduct(
                        "mediaFiles",
                        product.mediaFiles.filter((_, i) => i !== index)
                      );
                    }}
                    className="absolute text-white bg-black px-2 py-2 rounded-sm"
                    style={{
                      top: "5%",
                      left: "50%",
                      transform: [{ translateX: -16 }],
                    }}>
                    <AntDesign name="delete" size={14} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>

            <View className="">
              <View className="flex-row justify-between items-center mb-4">
                {/* Left: Heading */}
                <Text
                  className="text-white text-base"
                  style={{
                    fontFamily: "HelveticaNeue-Light",
                  }}>
                  Product Information
                </Text>
                {product.image && (
                  <TouchableOpacity
                    onPress={addAnotherMedia}
                    className="flex-row items-center gap-2 border border-white/60 px-4 py-2.5 rounded-sm">
                    <FontAwesome6 name="photo-film" size={12} color="white" />
                    <Text
                      className="text-white"
                      style={{
                        fontFamily: "HelveticaNeue-Light",
                        fontSize: 14,
                      }}>
                      Add more
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View className="py-2">
              <Text
                className="text-white mb-2"
                style={{
                  fontFamily: "HelveticaNeue-Medium",
                  fontSize: 14,
                }}>
                Product Name
              </Text>

              <TextInput
                placeholder="ENTER AN ENGAGING NAME"
                placeholderTextColor="#888"
                className="border border-white rounded-sm px-3 pt-1.5 text-white pb-0"
                style={{
                  fontSize: 26,
                }}
                ref={(ref) => {
                  if (ref) {
                    ref.setNativeProps({
                      style: { fontFamily: "PPFormulaCondensed-Bold" },
                    });
                  }
                }}
                value={product.productName}
                onChangeText={(text) => updateProduct("productName", text)}
              />
            </View>
            {errors.productName && (
              <Text className="text-red-500 text-sm">{errors.productName}</Text>
            )}
            <TouchableOpacity
              className="flex-row justify-between items-center py-3"
              onPress={() => setBrandModal(true)}>
              <Text
                className="text-white"
                style={{
                  fontFamily: "HelveticaNeue-Medium",
                }}>
                Brand
              </Text>
              <View className="flex-row items-center gap-2">
                <Text
                  className="text-typography-500 text-sm"
                  style={{
                    fontFamily: "HelveticaNeue-Medium",
                  }}>
                  {product.selectedBrand}
                </Text>
                <Ionicons name="chevron-forward" size={18} color="white" />
              </View>
            </TouchableOpacity>
            {errors.selectedBrand && (
              <Text className="text-red-500 text-sm">
                {errors.selectedBrand}
              </Text>
            )}
            <BrandModal
              brandModal={brandmodal}
              selectedBrand={product.selectedBrand}
              setBrandModal={setBrandModal}
              setSelectedBrand={(value) =>
                updateProduct("selectedBrand", value)
              }
            />
            <TouchableOpacity
              className="flex-row justify-between items-center py-4"
              onPress={() => setCategoryModal(true)}>
              <Text
                className="text-white"
                style={{
                  fontFamily: "HelveticaNeue-Medium",
                }}>
                Category
              </Text>
              <View className="flex-row items-center gap-2">
                <Text
                  className="text-typography-500 text-sm"
                  style={{
                    fontFamily: "HelveticaNeue-Medium",
                  }}>
                  {product.selectedCategory.length}
                </Text>
                <Ionicons name="chevron-forward" size={18} color="white" />
              </View>
            </TouchableOpacity>
            {errors.selectedCategory && (
              <Text className="text-red-500 text-sm">
                {errors.selectedCategory}
              </Text>
            )}
            <CategoryModal
              categoryModal={categorymodal}
              selectedCategory={product.selectedCategory}
              setCategoryModal={setCategoryModal}
              setSelectedCategory={(value) =>
                updateProduct("selectedCategory", value)
              }
            />

            <View className="flex-row justify-between items-center py-2">
              <Text
                className="text-white"
                style={{
                  fontFamily: "HelveticaNeue-Medium",
                }}>
                Original Price
              </Text>
              <View className="flex-row items-center gap-2">
                <Text
                  className="text-white"
                  style={{
                    fontFamily: "HelveticaNeue-Medium",
                  }}>
                  ₹
                </Text>
                <TextInput
                  keyboardType="numeric"
                  className=" text-white w-fit px-4 text-center rounded-sm border border-white pt-1 pb-0"
                  placeholder="0000"
                  maxLength={8}
                  placeholderTextColor="#888"
                  ref={(ref) => {
                    if (ref) {
                      ref.setNativeProps({
                        style: { fontFamily: "PPFormulaCondensed-Bold" },
                      });
                    }
                  }}
                  style={{
                    fontSize: 22,
                  }}
                  value={product.originalPrice}
                  onChangeText={(text) => updateProduct("originalPrice", text)}
                />
              </View>
            </View>
            {errors.originalPrice && (
              <Text className="text-red-500 text-sm">
                {errors.originalPrice}
              </Text>
            )}
            <View className="flex-row justify-between items-center py-1">
              <Text
                className="text-white"
                style={{
                  fontFamily: "HelveticaNeue-Medium",
                }}>
                Discounted Price
              </Text>
              <View className="flex-row items-center gap-2">
                <Text
                  className="text-white"
                  style={{
                    fontFamily: "HelveticaNeue-Medium",
                  }}>
                  ₹
                </Text>
                <TextInput
                  keyboardType="numeric"
                  className=" text-white w-fit px-4 text-center rounded-sm border border-white pt-1 pb-0"
                  placeholder="0000"
                  placeholderTextColor="#888"
                  maxLength={8}
                  ref={(ref) => {
                    if (ref) {
                      ref.setNativeProps({
                        style: { fontFamily: "PPFormulaCondensed-Bold" },
                      });
                    }
                  }}
                  style={{
                    fontSize: 22,
                  }}
                  value={product.discountedPrice}
                  onChangeText={(text) =>
                    updateProduct("discountedPrice", text)
                  }
                />
              </View>
            </View>
            {errors.discountedPrice && (
              <Text className="text-red-500 text-sm">
                {errors.discountedPrice}
              </Text>
            )}
            <View className="flex-row justify-between items-center py-1">
              <Text
                className="text-white"
                style={{
                  fontFamily: "HelveticaNeue-Medium",
                }}>
                No. of Pieces
              </Text>
              <View className="flex-row items-center gap-2">
                <TextInput
                  keyboardType="numeric"
                  className=" text-white w-fit px-4 text-right rounded-sm border border-white pt-1 pb-0"
                  placeholder="01"
                  maxLength={2}
                  placeholderTextColor="#888"
                  ref={(ref) => {
                    if (ref) {
                      ref.setNativeProps({
                        style: { fontFamily: "PPFormulaCondensed-Regular" },
                      });
                    }
                  }}
                  style={{
                    fontSize: 22,
                  }}
                  value={product.pieces}
                  onChangeText={(text) => updateProduct("pieces", text)}
                />
              </View>
            </View>
            {errors.pieces && (
              <Text className="text-red-500 text-sm">{errors.pieces}</Text>
            )}
            <TouchableOpacity
              className="flex-row justify-between items-center py-5"
              onPress={() => setProductConditionModal(true)}>
              <Text
                className="text-white"
                style={{
                  fontFamily: "HelveticaNeue-Medium",
                }}>
                Product Condition
              </Text>
              <View className="flex-row items-center gap-2">
                <Text
                  className="text-typography-500 text-sm"
                  style={{
                    fontFamily: "HelveticaNeue-Medium",
                  }}>
                  {product.selectedProductCondition}
                </Text>
                <Ionicons name="chevron-forward" size={18} color="white" />
              </View>
            </TouchableOpacity>
            {errors.selectedProductCondition && (
              <Text className="text-red-500 text-sm">
                {errors.selectedProductCondition}
              </Text>
            )}
            <ProductConditionModal
              productConditionModal={productConditionmodal}
              setProductConditionModal={setProductConditionModal}
              selectedProductCondition={product.selectedProductCondition}
              setSelectedProductCondition={(value) =>
                updateProduct("selectedProductCondition", value)
              }
              conditionDescription={product.conditionDescription}
              setConditionDescription={(value) =>
                updateProduct("conditionDescription", value)
              }
            />
            <Divider />
            <View className="mb-10">
              <Accordion
                size="md"
                variant="filled"
                type="single"
                isCollapsible={true}
                isDisabled={false}
                className="w-[100%]">
                <AccordionItem value="a">
                  <AccordionHeader className="bg-[#161616]">
                    <AccordionTrigger>
                      {({ isExpanded }: { isExpanded: boolean }) => {
                        return (
                          <>
                            <AccordionTitleText
                              className="text-white "
                              style={{
                                fontFamily: "HelveticaNeue-Medium",
                                fontSize: 15,
                              }}>
                              Add Additional Details
                            </AccordionTitleText>
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
                    <View className="gap-2 py-1">
                      <Text
                        className="text-white mb-1"
                        style={{
                          fontFamily: "HelveticaNeue-Medium",
                        }}>
                        Design Description
                      </Text>
                      <TextInput
                        multiline
                        className=" text-white px-3 py-3 rounded h-fit border border-white"
                        placeholder="DESCRIBE THE DESIGN"
                        placeholderTextColor="#888"
                        placeholderClassName=""
                        ref={(ref) => {
                          if (ref) {
                            ref.setNativeProps({
                              style: {
                                fontFamily: "PPFormulaCondensed-Regular",
                              },
                            });
                          }
                        }}
                        style={{
                          fontSize: 18,
                        }}
                        value={product.description}
                        onChangeText={(text) =>
                          updateProduct("description", text)
                        }
                      />
                    </View>

                    <TouchableOpacity
                      className="flex-row justify-between items-center py-3"
                      onPress={() => setPrimaryMaterialModal(true)}>
                      <Text
                        className="text-white"
                        style={{
                          fontFamily: "HelveticaNeue-Medium",
                        }}>
                        Primary Material
                      </Text>
                      <View className="flex-row items-center gap-2">
                        <Text
                          className="text-typography-500 text-sm"
                          style={{
                            fontFamily: "HelveticaNeue-Medium",
                          }}>
                          {product.selectedPrimaryMaterial}
                        </Text>
                        <Ionicons
                          name="chevron-forward"
                          size={18}
                          color="white"
                        />
                      </View>
                    </TouchableOpacity>
                    <PrimaryMaterialModal
                      primaryMaterialModal={primaryMaterialModal}
                      setPrimaryMaterialModal={setPrimaryMaterialModal}
                      selectedPrimaryMaterial={product.selectedPrimaryMaterial}
                      setSelectedPrimaryMaterial={(value: string) =>
                        updateProduct("selectedPrimaryMaterial", value)
                      }
                    />
                    <TouchableOpacity
                      className="flex-row justify-between items-center py-3"
                      onPress={() => setPrimaryColorModal(true)}>
                      <Text
                        className="text-white"
                        style={{
                          fontFamily: "HelveticaNeue-Medium",
                        }}>
                        Primary Color
                      </Text>
                      <View className="flex-row items-center gap-2">
                        <Text
                          className="text-typography-500 text-sm"
                          style={{
                            fontFamily: "HelveticaNeue-Medium",
                          }}>
                          {product.selectedPrimaryColor}
                        </Text>
                        <Ionicons
                          name="chevron-forward"
                          size={18}
                          color="white"
                        />
                      </View>
                    </TouchableOpacity>
                    <PrimaryColorModal
                      primaryColorModal={primaryColorModal}
                      setPrimaryColorModal={setPrimaryColorModal}
                      selectedPrimaryColor={product.selectedPrimaryColor}
                      setSelectedPrimaryColor={(value: string) =>
                        updateProduct("selectedPrimaryColor", value)
                      }
                    />
                    <TouchableOpacity
                      className="flex-row justify-between items-center py-3"
                      onPress={() => setOccasionModal(true)}>
                      <Text
                        className="text-white"
                        style={{
                          fontFamily: "HelveticaNeue-Medium",
                        }}>
                        Occasion
                      </Text>
                      <View className="flex-row items-center gap-2">
                        <Text
                          className="text-typography-500 text-sm"
                          style={{
                            fontFamily: "HelveticaNeue-Medium",
                          }}>
                          {product.selectedOccasion}
                        </Text>
                        <Ionicons
                          name="chevron-forward"
                          size={18}
                          color="white"
                        />
                      </View>
                    </TouchableOpacity>
                    <OccasionModal
                      occasionModal={occasionModal}
                      setOccasionModal={setOccasionModal}
                      selectedOccasion={product.selectedOccasion}
                      setSelectedOccasion={(value: string) =>
                        updateProduct("selectedOccasion", value)
                      }
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </View>
          </View>
        </ScrollView>

        {/* Publish Button */}
        <TouchableOpacity
          className="bg-[#E5FF03] py-2 m-2 rounded-sm shadow-lg shadow-slate-50 items-center"
          onPress={() => {
            if (validateForm()) {
              saveProductToFile();
            }
          }}>
          <Text
            className="text-black"
            style={{
              fontFamily: "PPFormulaCondensed-Bold",
              fontSize: 34,
            }}>
            {path === "/creator-store/edit-product"
              ? "SAVE CHANGES"
              : "PUBLISH"}
          </Text>
        </TouchableOpacity>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default AddProduct;
