import { CloseIcon, Pressable, ThreeDotsIcon } from "@gluestack-ui/themed";
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
import { Comment, Post } from "../utils/store/types";
import { useNavigation } from "@react-navigation/native";
// import { Button } from "react-native";
import type { CompositeNavigationProp } from "@react-navigation/native";
import { useAppDispatch } from "../utils/store";
import { setStatePost } from "../utils/store/postSlice";
import { deleteComment } from "../utils/actions/commentActions";

type MenuItemProps = {
  item: Post | Comment;
  loggedInUserId: string;
  // text: string;
  // icon: string;
  // iconPack?: any;
  // onSelect: () => void;
};

function MenuButton({ item, loggedInUserId }: MenuItemProps) {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();

  function isPost(item: any): item is Post {
    return (item as Post).title !== undefined;
  }

  function goToEditPost() {
    dispatch(setStatePost(item));
    navigation.navigate("CreatePost");
  }

  function handleEdit() {
    if (isPost(item)) {
      console.log(item, "item *********");
      goToEditPost();
    } else {
      console.log(item.postId, "postId");
    }
  }

  function handleDelete() {
    if (isPost(item)) {
      deletePost(item.id, item.commentsIds);
    } else {
      deleteComment(item.id, item.repliesIds, item.postId);
    }
  }

  return (
    <Menu
      style={{ backgroundColor: "white", width: 100 }}
      placement="bottom right"
      trigger={({ ...triggerProps }) => {
        return (
          <Pressable {...triggerProps} style={{ backgroundColor: "white" }}>
            <Icon
              style={{ transform: [{ rotate: "90deg" }] }}
              as={ThreeDotsIcon}
              size="sm"
              mr="$2"
            />
          </Pressable>
        );
      }}
    >
      {isPost(item) && (
        <MenuItem
          key="Edit"
          textValue="Edit"
          onPress={() => {
            handleEdit();
          }}
        >
          <Icon as={EditIcon} size="sm" mr="$2" />
          <MenuItemLabel size="sm">Edit</MenuItemLabel>
        </MenuItem>
      )}
      {item.authorId === loggedInUserId && (
        <MenuItem
          key="Delete"
          textValue="Delete"
          disabled={item.authorId !== loggedInUserId}
          onPress={() => handleDelete()}
        >
          <Icon as={CloseIcon} size="sm" mr="$2" />
          <MenuItemLabel size="sm">Delete</MenuItemLabel>
        </MenuItem>
      )}
    </Menu>
  );
}

export default MenuButton;
