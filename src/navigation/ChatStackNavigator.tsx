import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatListScreen from "../screens/ChatListScreen";
import PrivateChatScreen from "../screens/PrivateChatScreen";
import GroupChatScreen from "../screens/GroupChatScreen";

const ChatStack = createNativeStackNavigator();

export default function ChatStackNavigator() {
  return (
    <ChatStack.Navigator>
      <ChatStack.Screen name="ChatList" component={ChatListScreen} />
      <ChatStack.Screen name="PrivateChat" component={PrivateChatScreen} />
      <ChatStack.Screen name="GroupChat" component={GroupChatScreen} />
    </ChatStack.Navigator>
  );
}
