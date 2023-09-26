import {
  View,
  Image,
  Text,
  TextInput,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
// import useProducts from "../../../../utils/hooks/queries/useProducts";
// import useCategories from "../../../../utils/hooks/queries/useCategories";
import useHomeData from "../../../../utils/hooks/queries/useHomeData";
import ProductCard from "./ProductCard";
import ProductShow from "./ProductShow";

const articleBox = [1, 2, 3, 4];

export default function HomeScreen({ navigation }) {
  // const { isLoading, isError, data, error } = useProducts();
  // const categoriesData = useCategories();
  const { isLoading, isError, products, categories } = useHomeData();

  

  return (
    <SafeAreaView className="flex  bg-slate-100">
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {isLoading ? <></> : <></>}
          {/* Search bar and User Circle */}
          <View className="flex flex-row items-center">
            <TextInput
              placeholder="Search products"
              className="flex-1 h-12 lg m-5 rounded-lg px-3 bg-white"
            ></TextInput>
            <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
              <View className="rounded-full m-5 bg-white drop-shadow-lg">
                <Image
                  source={{
                    uri: "https://media.licdn.com/dms/image/D4E03AQHG9HMxAQd-Rg/profile-displayphoto-shrink_400_400/0/1663609290324?e=1700697600&v=beta&t=29-An9v16nHW_EUNVAwCizVQ7DAhai-Mv8yBndT5C6U",
                  }}
                  className="w-20 h-20 rounded-full"
                />
              </View>
            </TouchableOpacity>
          </View>
          {/* categories */}
          <Text className="text-2xl font-semibold mx-3">Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories?.map((item) => {
              return (
                <View key={item.id} className="columns-1 mb-3">
                  <View
                    key={item.id}
                    className=" rounded-full m-3 drop-shadow-lg bg-white mb-1"
                  >
                    <Image
                      source={{ uri: item.imageUrl }}
                      className="h-32 w-32 rounded-full"
                    />
                  </View>
                  <Text className="text-slate-500 h-5 mx-auto font-semibold text-base">
                    {item.name}
                  </Text>
                </View>
              );
            })}
          </ScrollView>

          {/* Rectangle boxes- articles? */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {articleBox.map((num) => (
              <View
                key={num}
                className=" flex box-content h-56 w-80 m-2 rounded-3xl bg-green-200"
              >
                <Text>{num}</Text>
              </View>
            ))}
          </ScrollView>

        {/* featured products- New Arrivals */}
        <Text className="text-2xl font-semibold mx-3 mt-3"> New Arrivals</Text>
        <View className="flex-row w-screen px-auto flex-wrap m-1">
          {isLoading ? <ActivityIndicator /> : null}
          {data?.map((item, i) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("ProductShow", {
                  id: item.id,
                  image: item.imageUrl,
                  name: item.name,
                  spec: item.spec,
                  category: item.category,
                  business: item.business,
                  description: item.description, 
                  price: item.price,
                  tokenValue: item.tokenValue,
                })
              }
              key={item.id}
            >
              <ProductCard item={item}/>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

{/* <View
  key={i}
  className="flex box-content h-48 w-48 m-2 rounded-3xl bg-blue-100"
>
  <Image
    source={{
      uri: item.imageUrl,
    }}
    className="h-full rounded-3xl"
  />
</View> */}
