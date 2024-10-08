import React from "react";
import { StyleSheet, Text, ViewStyle } from "react-native";
import { colors } from "../constants/colors";
import { Pressable } from "@gluestack-ui/themed";

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  color?: string;
  style?: ViewStyle;
};

const SubmitButton = (props: Props) => {
  const enabledBgColor = props.color || colors.primary;
  const disabledBgColor = colors.lightGray;
  const bgColor = props.disabled ? disabledBgColor : enabledBgColor;

  return (
    <Pressable
      onPress={props.disabled ? () => {} : props.onPress}
      style={{
        ...styles.button,
        ...props.style,
        ...{ backgroundColor: bgColor },
      }}
    >
      <Text style={{ color: props.disabled ? colors.gray : "white" }}>
        {props.title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SubmitButton;
