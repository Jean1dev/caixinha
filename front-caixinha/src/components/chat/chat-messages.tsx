import Stack from '@mui/material/Stack';
import { ChatMessage } from './chat-message';
import { useUserAuth } from '@/hooks/useUserAuth';

const getAuthor = (message: any, user: any) => {
  if (message.author.email === user.email) {
    return {
      name: 'Me',
      avatar: user.photoUrl,
      isUser: true
    };
  }

  return {
    avatar: message.author.photoUrl,
    name: message.author.name,
    isUser: false
  };
};

export const ChatMessages = (props: any) => {
  const { messages = [], ...other } = props;
  const { user } = useUserAuth();

  return (
    <Stack
      spacing={2}
      sx={{ p: 3 }}
      {...other}>
      {messages.map((message: any) => {
        const author = getAuthor(message, user);

        return (
          <ChatMessage
            authorAvatar={author.avatar}
            authorName={author.name}
            body={message.body}
            contentType={message.contentType}
            createdAt={message.createdAt}
            key={message.id}
            position={author.isUser ? 'right' : 'left'}
          />
        );
      })}
    </Stack>
  );
};
