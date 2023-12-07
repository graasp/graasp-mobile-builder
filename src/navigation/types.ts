import { DiscriminatedItem, UUID } from '@graasp/sdk';

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';

export type RootStackParamList = {
  SignIn?: { signUp?: boolean };
  Main: undefined;
};

export type MainStackParamList = {
  MainStack: NavigatorScreenParams<TabParamList>;
  QrCamera: undefined;
  ItemStack: NavigatorScreenParams<ItemStackParamList>;
};

export type TabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  MyItemsTab: NavigatorScreenParams<MyItemsStackParamList>;
  SharedTab: NavigatorScreenParams<SharedStackParamList>;
  SignInTab: undefined;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
  BookmarksTab: NavigatorScreenParams<BookmarksStackParamList>;
  LibraryTab: NavigatorScreenParams<LibraryStackParamList>;
};

export type HomeStackParamList = {
  HomeStack: undefined;
};

export type BookmarksStackParamList = {
  BookmarksStack: undefined;
};

export type LibraryStackParamList = {
  LibraryStack: undefined;
  CollectionStack: { itemId: DiscriminatedItem['id'] };
};

export type LibraryScreenProp<T extends keyof LibraryStackParamList> =
  CompositeScreenProps<
    StackScreenProps<LibraryStackParamList, T>,
    TabScreenProps<keyof TabParamList>
  >;

export type ProfileStackParamList = {
  ProfileStackProfile: undefined;
};

export type SharedStackParamList = {
  SharedStackShared: undefined;
};

export type MyItemsStackParamList = {
  MyItemsStack: undefined;
};

export type ItemStackParamList = {
  ItemStackPlayerFolder: {
    headerTitle?: string;
    itemId: UUID;
  };
  ItemStackItem: { headerTitle?: string; itemId: UUID };
  ItemStackDetail: { itemId: UUID };
};

export type ItemStackNavigationProp = StackNavigationProp<ItemStackParamList>;

export type ItemScreenProps<T extends keyof ItemStackParamList> =
  CompositeScreenProps<
    StackScreenProps<ItemStackParamList, T>,
    TabScreenProps<keyof TabParamList>
  >;

export type TabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, T>,
  MainStackScreenProps<keyof MainStackParamList>
>;

export type MainStackScreenProps<T extends keyof MainStackParamList> =
  CompositeScreenProps<
    StackScreenProps<MainStackParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
