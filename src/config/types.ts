import { IMessage } from 'react-native-gifted-chat';

export interface ChatMessage extends Omit<IMessage, '_id'> {
  _id: string;
}
