import { IMessage } from 'react-native-gifted-chat';

export interface GiftedChatMessage extends Omit<IMessage, '_id'> {
  _id: string;
}
