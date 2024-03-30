import React, { useCallback, useEffect, useReducer, useState } from "react";
import { Feather } from "@expo/vector-icons";
import Input from "../components/Input";
import SubmitButton from "../components/SubmitButton";
import { validateInput } from "../utils/actions/formActions";
import { reducer } from "../utils/reducers/formReducer";
import { signIn } from "../utils/actions/authActions";
import { useAppDispatch } from "../utils/store";
import { ActivityIndicator, Alert, Button, ScrollView } from "react-native";
import { colors } from "../constants/colors";
import { NavigationProp } from "@react-navigation/native";
import { auth } from "../../firebaseConfig";
import PageContainer from "../components/PageContainer";

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const initialState = {
  inputValues: {
    email: "",
    password: "",
  },
  inputValidities: {
    email: undefined,
    password: undefined,
  },
  formIsValid: false,
};

const SignInForm = ({ navigation }: RouterProps) => {
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const inputChangedHandler = useCallback(
    (inputId: string, inputValue: string) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({ inputId, validationResult: result, inputValue });
    },
    [dispatchFormState]
  );

  useEffect(() => {
    if (error) {
      Alert.alert("An error occurred!", error, [
        { text: "Okay", onPress: () => setError(undefined) },
      ]);
    }
  }, [error]);

  const authHandler = useCallback(async () => {
    try {
      setLoading(true);

      const action = signIn({
        email: formState.inputValues["email"],
        password: formState.inputValues["password"],
      });
      setError(undefined);

      await dispatch(action);
      setLoading(false);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  }, [dispatch, formState]);

  return (
    <PageContainer>
      <ScrollView>
        <Input
          id="email"
          label="Email"
          icon="mail"
          iconPack={Feather}
          autoCapitalize="none"
          keyboardType="email-address"
          onInputChanged={inputChangedHandler}
          errorText={formState.inputValidities["email"]}
        />

        <Input
          id="password"
          label="Password"
          icon="lock"
          iconPack={Feather}
          autoCapitalize="none"
          secureTextEntry
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
          <>
            <SubmitButton
              title="Sign In"
              onPress={authHandler}
              style={{ marginTop: 20 }}
              disabled={!formState.formIsValid}
            />
            <Button
              onPress={() => navigation.navigate("Signup")}
              title="Sign up"
            />
          </>
        )}
      </ScrollView>
    </PageContainer>
  );
};

export default SignInForm;
