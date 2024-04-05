export type UserData = {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  firstLast: string;
  signUpDate: string;
  about?: string;
  profilePicture?: string;
  pushTokens?: {
    [id: string]: string;
  };
};

export type Users = {
  [K in UserData["userId"]]: UserData;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  authorId: string;
  likesIds: string[];
  commentsIds: string[];
};

export type Comment = {
  id: string;
  postId: string;
  text: string;
  authorId: string;
  authorName: string;
  authorImageUrl?: string;
  createdAt: string;
  repliesIds: string[];
  likesIds: string[];
};

export type CommentReply = {
  id: string;
  commentId: string;
  text: string;
  authorId: string;
  authorName: string;
  authorImageUrl?: string;
  createdAt: string;
  likesIds: string[];
};

export type ChatData = {
  users: string[];
  isGroupChat: boolean;
  chatName: ChatData["isGroupChat"] extends true ? string : undefined;
  chatImage?: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  latestMessageText?: string;
  chatId: string;
  key: string; // chatId
};

export type Seen = {
  seenBy: string;
  seenAt: string;
};

export type Message = {
  messageId: string;
  sentBy: string;
  text: string;
  sentAt: string;
  imageUrl?: string;
  replyTo?: string; // other message Id
  type?: string;
  seen?: {
    [key: string]: Seen;
  };
  // updatedAt: string;
};

export type Messages = {
  [messageId: string]: Omit<Message, "messageId">;
};

export type Status = {
  statusId: string;
  imageUrl: string;
  createdAt: string;
  views: {
    [key: string]: {
      viewerId: string;
      viewedAt: string;
    };
  };
};
