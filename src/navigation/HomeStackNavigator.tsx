import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FeedScreen from "../screens/FeedScreen";
import PostDetailsScreen from "../screens/PostDetailsScreen";
import CreatePostScreen from "../screens/CreatePostScreen";

const HomeStack = createNativeStackNavigator();

export default function HomeStackNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Feed" component={FeedScreen} />
      <HomeStack.Screen name="CreatePost" component={CreatePostScreen} />
      <HomeStack.Screen name="PostDetails" component={PostDetailsScreen} />
    </HomeStack.Navigator>
  );
}
