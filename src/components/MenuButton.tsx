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
// import { Button } from "react-native";

type MenuItemProps = {
  postId: string;
  postCommentsIds: string[];
  authorId: string;
  loggedInUserId: string;
  // text: string;
  // icon: string;
  // iconPack?: any;
  // onSelect: () => void;
};

function MenuButton({
  postId,
  postCommentsIds,
  authorId,
  loggedInUserId,
}: MenuItemProps) {
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
      <MenuItem key="Edit" textValue="Edit">
        <Icon as={EditIcon} size="sm" mr="$2" />
        <MenuItemLabel size="sm">Edit</MenuItemLabel>
      </MenuItem>
      {authorId === loggedInUserId && (
        <MenuItem
          key="Delete"
          textValue="Delete"
          disabled={authorId !== loggedInUserId}
          onPress={() => deletePost(postId, postCommentsIds)}
        >
          <Icon as={CloseIcon} size="sm" mr="$2" />
          <MenuItemLabel size="sm">Delete</MenuItemLabel>
        </MenuItem>
      )}
    </Menu>
  );
}

export default MenuButton;
