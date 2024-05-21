import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatListScreen from "../screens/ChatListScreen";
import ChatScreen from "../screens/ChatScreen";
import GroupChatScreen from "../screens/GroupChatScreen";

const ChatStack = createNativeStackNavigator();

export default function ChatStackNavigator() {
  return (
    <ChatStack.Navigator>
      <ChatStack.Screen
        name="ChatList"
        component={ChatListScreen}
        options={{ title: "Chats" }}
      />
      <ChatStack.Screen
        name="Chat"
        component={ChatScreen}
        options={({ route }) => ({
          title: route.params?.chatName || "Chat",
        })}
      />
      {/* <ChatStack.Screen name="GroupChat" component={GroupChatScreen} /> */}
    </ChatStack.Navigator>
  );
}
