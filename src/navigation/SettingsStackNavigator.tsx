import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FeedScreen from "../screens/FeedScreen";
import PostDetailsScreen from "../screens/PostDetailsScreen";
import UserProfileScreen from "../screens/UserProfileScreen";
import CampingProfileScreen from "../screens/CampingProfileScreen";

const SettingsStack = createNativeStackNavigator();

export default function SettingsStackNavigator() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="UserProfile" component={UserProfileScreen} />
      <SettingsStack.Screen
        name="CampingProfile"
        component={CampingProfileScreen}
      />
    </SettingsStack.Navigator>
  );
}
