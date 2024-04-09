import { CloseIcon, ThreeDotsIcon } from "@gluestack-ui/themed";
import {
  Menu,
  MenuItem,
  Button,
  ButtonText,
  Icon,
  GlobeIcon,
  MenuItemLabel,
  SettingsIcon,
  AddIcon,
  EditIcon,
  MenuIcon,
  RemoveIcon,
} from "@gluestack-ui/themed";
import React from "react";
import { deletePost } from "../utils/actions/postActions";
import { Post } from "../utils/store/types";
import { useNavigation } from "@react-navigation/native";
// import { Button } from "react-native";
import type { CompositeNavigationProp } from "@react-navigation/native";
import { useAppDispatch } from "../utils/store";
import { setStatePost } from "../utils/store/postSlice";

type MenuItemProps = {
  post: Post;
  loggedInUserId: string;
  // text: string;
  // icon: string;
  // iconPack?: any;
  // onSelect: () => void;
};

function MenuButton({ post, loggedInUserId }: MenuItemProps) {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();

  function goToEditPost() {
    dispatch(setStatePost(post));
    navigation.navigate("CreatePost");
  }

  return (
    <Menu
      style={{ backgroundColor: "white", width: 100 }}
      placement="bottom right"
      trigger={({ ...triggerProps }) => {
        return (
          <Button {...triggerProps} style={{ backgroundColor: "white" }}>
            <Icon
              style={{ transform: [{ rotate: "90deg" }] }}
              as={ThreeDotsIcon}
              size="sm"
              mr="$2"
            />
          </Button>
        );
      }}
    >
      <MenuItem
        key="Edit"
        textValue="Edit"
        onPress={() => {
          goToEditPost();
        }}
      >
        <Icon as={EditIcon} size="sm" mr="$2" />
        <MenuItemLabel size="sm">Edit</MenuItemLabel>
      </MenuItem>
      {post.authorId === loggedInUserId && (
        <MenuItem
          key="Delete"
          textValue="Delete"
          disabled={post.authorId !== loggedInUserId}
          onPress={() => deletePost(post.id, post.commentsIds)}
        >
          <Icon as={CloseIcon} size="sm" mr="$2" />
          <MenuItemLabel size="sm">Delete</MenuItemLabel>
        </MenuItem>
      )}
    </Menu>
  );
}

export default MenuButton;
