import React, { useCallback, useEffect, useReducer, useState } from "react";
import { Feather, FontAwesome } from "@expo/vector-icons";
import SubmitButton from "../components/SubmitButton";
import Input from "../components/Input";
import { reducer } from "../utils/reducers/formReducer";
import { validateInput } from "../utils/actions/formActions";
import { signUp } from "../utils/actions/authActions";
import { ActivityIndicator, Alert, ScrollView } from "react-native";
import { colors } from "../constants/colors";
import { useAppDispatch } from "../utils/store";
import PageContainer from "../components/PageContainer";

import {
  Button,
  FormControl,
  Toast,
  ToastDescription,
  ToastTitle,
  VStack,
  useToast,
} from "@gluestack-ui/themed";

const initialState = {
  inputValues: {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  },
  inputValidities: {
    firstName: undefined,
    lastName: undefined,
    email: undefined,
    password: undefined,
  },
  formIsValid: false,
};

const SignUpScreen = () => {
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();

  const dispatch = useAppDispatch();

  const inputChangedHandler = useCallback(
    (inputId: string, inputValue: string) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({ inputId, validationResult: result, inputValue });
    },
    [dispatchFormState]
  );

  const showToast = (variant: "success" | "error") => {
    const duration = "2000";
    const messageToDisplay =
      variant === "success"
        ? {
            title: "Great, you are signed-up! Welcome",
            description: "Live the outdoor life",
          }
        : { title: "Sign-up failed", description: "Please try again" };

    toast.show({
      placement: "top",
      duration: parseInt(duration),
      render: ({ id }) => {
        const toastId = "toast-" + id;
        return (
          <Toast nativeID={toastId} action={variant} variant="accent">
            <VStack space="xs" flex={1}>
              <ToastTitle>{messageToDisplay.title}</ToastTitle>
              <ToastDescription>
                {messageToDisplay.description}
              </ToastDescription>
            </VStack>
          </Toast>
        );
      },
    });
  };

  const authHandler = async () => {
    try {
      setError(undefined);
      setLoading(true);

      const action = signUp({
        firstName: formState.inputValues.firstName,
        lastName: formState.inputValues.lastName,
        email: formState.inputValues.email,
        password: formState.inputValues.password,
      });
      await dispatch(action);
      setLoading(false);
      showToast("success");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      showToast("error");
    }
  };

  useEffect(() => {
    if (error) {
      Alert.alert("An error occurred!", error, [
        { text: "Okay", onPress: () => setError(undefined) },
      ]);
    }
  }, [error]);

  return (
    <PageContainer>
      <ScrollView>
        <Input
          id="firstName"
          label="First name"
          icon="user-o"
          iconPack={FontAwesome}
          onInputChanged={inputChangedHandler}
          autoCapitalize="none"
          errorText={formState.inputValidities["firstName"]}
        />

        <Input
          id="lastName"
          label="Last name"
          icon="user-o"
          iconPack={FontAwesome}
          onInputChanged={inputChangedHandler}
          autoCapitalize="none"
          errorText={formState.inputValidities["lastName"]}
        />

        <Input
          id="email"
          label="Email"
          icon="mail"
          iconPack={Feather}
          onInputChanged={inputChangedHandler}
          inputMode="email"
          autoCapitalize="none"
          errorText={formState.inputValidities["email"]}
        />

        <Input
          id="password"
          label="Password"
          icon="lock"
          autoCapitalize="none"
          secureTextEntry
          iconPack={Feather}
          onInputChanged={inputChangedHandler}
          errorText={formState.inputValidities["password"]}
        />

        {loading ? (
          <ActivityIndicator
            size="small"
            color={colors.primary}
            style={{ marginTop: 20 }}
          />
        ) : (
          <SubmitButton
            title="Sign Up"
            onPress={authHandler}
            style={{ marginTop: 20 }}
            disabled={!formState.formIsValid}
          />
        )}
      </ScrollView>
    </PageContainer>
  );
};

export default SignUpScreen;
