import Stack from '@mui/material/Stack';
import { ChatMessage } from './chat-message';

const getAuthor = (message, participants, user) => {
  const participant = participants.find((participant) => participant.id === message.authorId);

  // This should never happen
  if (!participant) {
    return {
      name: 'Unknown',
      avatar: '',
      isUser: false
    };
  }

  // Since chat mock db is not synced with external auth providers
  // we set the user details from user auth state instead of thread participants
  if (message.authorId === user.id) {
    return {
      name: 'Me',
      avatar: user.avatar,
      isUser: true
    };
  }

  return {
    avatar: participant.avatar,
    name: participant.name,
    isUser: false
  };
};

export const ChatMessages = (props: any) => {
  const { messages = [], participants = [], ...other } = props;
  const user = {
    id: '5e86809283e28b96d2d38537',
    avatar: '/assets/avatars/avatar-anika-visser.png',
    name: 'Anika Visser',
    email: 'anika.visser@devias.io'
  };

  return (
    <Stack
      spacing={2}
      sx={{ p: 3 }}
      {...other}>
      {messages.map((message) => {
        const author = getAuthor(message, participants, user);

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
