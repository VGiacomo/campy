import { useCallback, useReducer, useState } from "react";
import {
  View,
  ScrollView,
  Image,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import PageContainer from "../components/PageContainer";
import { useAppDispatch, useAppSelector } from "../utils/store";
import { reducer } from "../utils/reducers/formReducer";
import { validateInput } from "../utils/actions/formActions";
import {
  updateSignedInUserData,
  userLogout,
} from "../utils/actions/authActions";
import { updateLoggedInUserData } from "../utils/store/authSlice";
import ProfileImage from "../components/ProfileImage";
import Input from "../components/Input";
import { Feather, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import {
  Badge,
  BadgeIcon,
  BadgeText,
  CheckIcon,
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
  FormControl,
  HStack,
  Heading,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import { colors } from "../constants";
import SubmitButton from "../components/SubmitButton";
import { languageOptions } from "../utils/store/types";
const UserProfileScreen = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const userData = useAppSelector((state) => state.auth.userData)!;

  const firstName = userData?.firstName || "";
  const lastName = userData?.lastName || "";
  const email = userData?.email || "";
  const about = userData?.about || "";
  const spokenLanguages = userData?.spokenLanguages || [];

  const initialState = {
    inputValues: {
      firstName,
      lastName,
      email,
      about,
      spokenLanguages,
    },
    inputValidities: {
      firstName: undefined,
      lastName: undefined,
      email: undefined,
      about: undefined,
      spokenLanguages: undefined,
    },
    formIsValid: false,
  };
  const [formState, dispatchFormState] = useReducer(reducer, initialState);

  const dispatch = useAppDispatch();

  const inputChangedHandler = useCallback(
    (inputId: string, inputValue: string) => {
      const result = validateInput(inputId, inputValue);
      // TODO
      // dispatchFormState({ inputId, validationResult: result, inputValue });
    },
    [dispatchFormState]
  );
  const saveHandler = useCallback(async () => {
    const updatedValues = formState.inputValues;

    try {
      if (userData) {
        setLoading(true);
        await updateSignedInUserData(userData.userId, updatedValues);
        dispatch(updateLoggedInUserData({ newData: updatedValues }));

        setShowSuccessMessage(true);

        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [formState, dispatch]);

  const hasChanges = () => {
    const currentValues = formState.inputValues;

    return (
      currentValues.firstName != firstName ||
      currentValues.lastName != lastName ||
      currentValues.email != email ||
      currentValues.about != about
    );
  };

  const handleSelectLanguages = (selectedLanguage: string) => {
    // TODO check if the selectedLanguage is already in the list
  };

  return (
    <PageContainer>
      {/* <PageTitle text="Settings" /> */}

      <ScrollView contentContainerStyle={styles.formContainer}>
        {userData && (
          <ProfileImage
            size={80}
            userId={userData.userId}
            uri={userData.profilePicture}
          />
        )}

        <Input
          id="firstName"
          label="First name"
          icon="user-o"
          iconPack={FontAwesome}
          onInputChanged={inputChangedHandler}
          autoCapitalize="none"
          errorText={formState.inputValidities["firstName"]}
          initialValue={userData?.firstName}
        />

        <Input
          id="lastName"
          label="Last name"
          icon="user-o"
          iconPack={FontAwesome}
          onInputChanged={inputChangedHandler}
          autoCapitalize="none"
          errorText={formState.inputValidities["lastName"]}
          initialValue={userData?.lastName}
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
          initialValue={userData?.email}
        />

        <Input
          id="about"
          label="About"
          icon="user-o"
          iconPack={FontAwesome}
          onInputChanged={inputChangedHandler}
          autoCapitalize="none"
          errorText={formState.inputValidities["about"]}
          initialValue={userData?.about}
        />

        {/* <View style={{ marginTop: 20, width: "100%" }}>
          <Text style={{ fontSize: 18, fontWeight: "700" }}>I travel with</Text>
        </View>
        <HStack space={"md"} style={{ marginTop: 10 }}>
          <Badge size="md" variant="solid" borderRadius="$full" action="muted">
            <BadgeText>Family</BadgeText>
            <MaterialIcons name="family-restroom" size={12} color="black" />
          </Badge>
          <Badge size="md" variant="solid" borderRadius="$full" action="muted">
            <BadgeText>Friends</BadgeText>
          </Badge>
          <Badge size="md" variant="solid" borderRadius="$full" action="muted">
            <BadgeText>School</BadgeText>
          </Badge>
          <Badge size="md" variant="solid" borderRadius="$full" action="muted">
            <BadgeText>Alone</BadgeText>
          </Badge>
        </HStack> */}

        <FormControl>
          <HStack space="sm" style={{ flexWrap: "wrap" }}>
            <Heading size="sm">I speak</Heading>
            {languageOptions.map((option) => (
              <Checkbox
                value={option}
                key={option}
                aria-label={`Select ${option}`} // Adding accessibility label
                onPress={() => {
                  handleSelectLanguages(option);
                }}
              >
                <CheckboxIndicator mr="$2">
                  <CheckboxIcon as={CheckIcon} />
                </CheckboxIndicator>
                <CheckboxLabel>{option}</CheckboxLabel>
              </Checkbox>
            ))}
          </HStack>
        </FormControl>

        <View style={{ marginTop: 20, width: "100%" }}>
          {showSuccessMessage && <Text>Saved!</Text>}

          {loading ? (
            <ActivityIndicator
              size={"small"}
              color={colors.primary}
              style={{ marginTop: 10 }}
            />
          ) : (
            hasChanges() && (
              <SubmitButton
                title="Save"
                onPress={saveHandler}
                style={styles.button}
                disabled={!formState.formIsValid}
              />
            )
          )}
        </View>

        <SubmitButton
          title="Logout"
          onPress={() => dispatch(userLogout(userData.userId))}
          style={styles.button}
          color={colors.red}
        />
      </ScrollView>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    alignItems: "center",
    padding: 10,
  },
  button: {
    marginTop: 20,
    width: "100%",
  },
});

export default UserProfileScreen;
