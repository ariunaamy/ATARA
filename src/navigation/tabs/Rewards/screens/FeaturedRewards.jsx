import {
  FlatList,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import RewardCard from "./RewardCard"

import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../../../../utils/constants";


export default function FeaturedRewards({ navigation }) {
  const [rewards, setRewards] = useState([]);
  const [currentReward, setCurrentReward] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const getRewards = () => {
    setIsLoading(true);
    axios.get(`${API}/rewards/not-featured`).then((res) => {
      setRewards([...rewards, ...res.data]);
    });
  };

  const loadMoreItem = () => {
    setCurrentReward(currentReward + 1);
  };

  useEffect(() => {
    getRewards();
  }, [currentReward]);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        className="flex-row px-1 py-3 "
        // onPress={() =>
        //   navigation.navigate("RewardShow", {
        //     name: item.name,
        //     tokensAmount: item.tokensAmount,
        //     imageUrl: item.imageUrl,
        //     description: item.description,
        //   })
        // }
        key={item.id}
      >
        <RewardCard item={item} />
      </TouchableOpacity>
    );
  };

  const renderLoader = () => {
    return isLoading ? (
      <View className="text-black items-center justify-center">
        <ActivityIndicator size="large" color="#aaa" />
      </View>
    ) : null;
  };

  return (
    <FlatList
      data={rewards}
      renderItem={renderItem}
      keyExtractor={(item, i) => i}
      onEndReached={loadMoreItem}
      ListFooterComponent={renderLoader}
      onEndReachedThreshold={0}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
    />
  );
}
