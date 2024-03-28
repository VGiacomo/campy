import { Button, Text, View } from "react-native";

function HomeScreen({ navigation }: any) {
  return (
    // add tab nav system
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => {
          navigation.navigate("Details");
        }}
      />
    </View>
  );
}
export default HomeScreen;
