import { Context, DiscriminatedItem, UUID } from '@graasp/sdk';

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';

import {
  BOOKMARKS_NAVIGATOR_BOOKMARKS,
  HOME_NAVIGATOR_HOME,
  ITEM_NAVIGATOR,
  ITEM_NAVIGATOR_ITEM,
  ITEM_NAVIGATOR_ITEM_CHAT,
  ITEM_NAVIGATOR_ITEM_DETAILS,
  ITEM_NAVIGATOR_MAP_VIEW,
  ITEM_NAVIGATOR_PLAYER_FOLDER,
  LIBRARY_NAVIGATOR_COLLECTION,
  LIBRARY_NAVIGATOR_LIBRARY,
  MAIN_NAVIGATOR_MAIN,
  MAIN_NAVIGATOR_QR_CAMERA,
  MY_ITEMS_NAVIGATOR_MY_ITEMS,
  PROFILE_NAVIGATOR_PROFILE,
  ROOT_NAVIGATOR_MAIN,
  ROOT_NAVIGATOR_SIGN_IN,
  SHARED_NAVIGATOR_SHARED,
  TAB_NAVIGATOR_BOOKMARKS,
  TAB_NAVIGATOR_HOME,
  TAB_NAVIGATOR_LIBRARY,
  TAB_NAVIGATOR_MAP,
  TAB_NAVIGATOR_MY_ITEMS,
  TAB_NAVIGATOR_PROFILE,
  TAB_NAVIGATOR_SHARED,
  TAB_NAVIGATOR_SIGN_IN,
} from './names';

export type RootStackParamList = {
  [ROOT_NAVIGATOR_SIGN_IN]?: { signUp?: boolean };
  [ROOT_NAVIGATOR_MAIN]: NavigatorScreenParams<MainStackParamList>;
};

export type MainStackParamList = {
  [MAIN_NAVIGATOR_MAIN]: NavigatorScreenParams<TabParamList>;
  [MAIN_NAVIGATOR_QR_CAMERA]: undefined;
  [ITEM_NAVIGATOR]: NavigatorScreenParams<ItemStackParamList>;
};

export type TabParamList = {
  [TAB_NAVIGATOR_HOME]: NavigatorScreenParams<HomeStackParamList>;
  [TAB_NAVIGATOR_MY_ITEMS]: NavigatorScreenParams<MyItemsStackParamList>;
  [TAB_NAVIGATOR_SHARED]: NavigatorScreenParams<SharedStackParamList>;
  [TAB_NAVIGATOR_SIGN_IN]: undefined;
  [TAB_NAVIGATOR_PROFILE]: NavigatorScreenParams<ProfileStackParamList>;
  [TAB_NAVIGATOR_BOOKMARKS]: NavigatorScreenParams<BookmarksStackParamList>;
  [TAB_NAVIGATOR_LIBRARY]: NavigatorScreenParams<LibraryStackParamList>;
  [TAB_NAVIGATOR_MAP]: NavigatorScreenParams<LibraryStackParamList>;
};

export type HomeStackParamList = {
  [HOME_NAVIGATOR_HOME]: undefined;
};

export type BookmarksStackParamList = {
  [BOOKMARKS_NAVIGATOR_BOOKMARKS]: undefined;
};

export type LibraryStackParamList = {
  [LIBRARY_NAVIGATOR_LIBRARY]: undefined;
  [LIBRARY_NAVIGATOR_COLLECTION]: { itemId: DiscriminatedItem['id'] };
};

export type LibraryScreenProp<T extends keyof LibraryStackParamList> =
  CompositeScreenProps<
    StackScreenProps<LibraryStackParamList, T>,
    TabScreenProps<keyof TabParamList>
  >;

export type ProfileStackParamList = {
  [PROFILE_NAVIGATOR_PROFILE]: undefined;
};

export type SharedStackParamList = {
  [SHARED_NAVIGATOR_SHARED]: undefined;
};

export type MyItemsStackParamList = {
  [MY_ITEMS_NAVIGATOR_MY_ITEMS]: undefined;
};

export type ItemStackParamList = {
  [ITEM_NAVIGATOR_PLAYER_FOLDER]: {
    headerTitle?: string;
    itemId: UUID;
    /**
     * root where the player view will exit
     * */
    origin: { rootId: DiscriminatedItem['id']; context: Context };
  };
  [ITEM_NAVIGATOR_ITEM]: { headerTitle?: string; itemId: UUID };
  [ITEM_NAVIGATOR_ITEM_DETAILS]: { itemId: UUID };
  [ITEM_NAVIGATOR_MAP_VIEW]: { itemId?: UUID; headerTitle: string };
  [ITEM_NAVIGATOR_ITEM_CHAT]: { itemId: UUID; headerTitle?: string };
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
