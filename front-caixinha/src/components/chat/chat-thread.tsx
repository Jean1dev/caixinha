import { useCallback, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { useRouter } from 'next/router';
import { ChatThreadToolbar } from './chat-thread-toolbar';
import { Scrollbar } from '../scrollbar';
import { ChatMessages } from './chat-messages';
import { ChatMessageAdd } from './chat-message-add';
import { useUserAuth } from '@/hooks/useUserAuth';

const useParticipants = (threadKey: string, userEmail: string) => {
  const router = useRouter();
  const [participants, setParticipants] = useState([]);

  const handleParticipantsGet = useCallback(async () => {
    try {
      const participants: any = [
        {
          email: threadKey
        }, {
          email: userEmail
        }
      ]
      setParticipants(participants);

    } catch (err) {
      console.error(err);
      router.push('/chat');
    }
  }, [router, threadKey]);

  useEffect(() => {
    handleParticipantsGet();
  },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [threadKey]);

  return participants;
};

const useThread = (threadKey: string) => {
  const router = useRouter();
  const [thread, setThreads] = useState<any>({
    messages: [],
    threadKey
  })

  const handleThreadGet = useCallback(async () => {
    // If thread key is not a valid key (thread id or contact id)
    // the server throws an error, this means that the user tried a shady route
    // and we redirect them on the home view

    let threadId;

    try {
      //   threadId = await dispatch(thunks.getThread({
      //     threadKey
      //   }));
      threadId = 1
    } catch (err) {
      console.error(err);
      router.push('/chat');
      return;
    }

    // Set the active thread
    // If the thread exists, then is sets it as active, otherwise it sets is as undefined

    // dispatch(thunks.setCurrentThread({
    //   threadId
    // }));

    // Mark the thread as seen only if it exists

    if (threadId) {
      //   dispatch(thunks.markThreadAsSeen({
      //     threadId
      //   }));
    }

  }, [router, threadKey]);

  const addMessage = useCallback((message: string, author: any) => {
    setThreads((prevState: any) => {
      return {
        ...prevState,
        messages: [
          ...prevState.messages,
          {
            id: prevState.messages.length + 1,
            body: message,
            contentType: 'text',
            author: {
              name: author.name,
              email: author.email,
              photoUrl: author.photoUrl
            },
            createdAt: new Date()
          }
        ]
      };
    })

  }, [])

  useEffect(() => {
    handleThreadGet();
  },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [threadKey]);

  return { thread, addMessage };
};

const useMessagesScroll = (thread: any) => {
  const messagesRef = useRef(null);

  const handleUpdate = useCallback(() => {
    try {
      // Thread does not exist
      if (!thread) {
        return;
      }

      // Ref is not used
      if (!messagesRef.current) {
        return;
      }

      const container: any = messagesRef.current;
      const scrollElement = container.getScrollElement();

      if (scrollElement && container.el && typeof scrollElement.scrollTop !== 'undefined') {
        scrollElement.scrollTop = container.el.scrollHeight;
      }
    } catch (error) {
      console.warn('Error updating scroll position:', error);
    }
  }, [thread]);

  useEffect(() => {
    handleUpdate();
  },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [thread]);

  return {
    messagesRef
  };
};

export const ChatThread = (props: any) => {
  const { threadKey, ...other } = props;
  const { user } = useUserAuth()
  const { thread, addMessage } = useThread(threadKey);
  const participants = useParticipants(threadKey, user.email);
  const { messagesRef } = useMessagesScroll(thread);

  const handleSend = useCallback(async (body: string) => {
    // If we have the thread, we use its ID to add a new message

    if (thread) {
      try {
        addMessage(body, user)
      } catch (err) {
        console.error(err);
      }

      return;
    }

    // Otherwise we use the recipients IDs. When using participant IDs, it means that we have to
    // get the thread.

    // Filter the current user to get only the other participants

    const recipientIds = participants
      .filter((participant: any) => participant.email !== user.email)
      .map((participant: any) => participant.email);

    // Add the new message

    let threadId;

    try {
      //   threadId = await dispatch(thunks.addMessage({
      //     recipientIds,
      //     body
      //   }));
    } catch (err) {
      console.error(err);
      return;
    }

    // Load the thread because we did not have it

    try {
      //   await dispatch(thunks.getThread({
      //     threadKey: threadId
      //   }));
    } catch (err) {
      console.error(err);
      return;
    }

    // Set the new thread as active

    // dispatch(thunks.setCurrentThread({ threadId }));
  }, [participants, thread, user]);

  // Maybe implement a loading state

  return (
    <Stack
      sx={{
        flexGrow: 1,
        overflow: 'hidden'
      }}
      {...other}>
      <ChatThreadToolbar participants={participants} />
      <Divider />
      <Box
        sx={{
          flexGrow: 1,
          overflow: 'hidden'
        }}
      >
        <Scrollbar
          ref={messagesRef}
          sx={{ maxHeight: '100%' }}
        >
          <ChatMessages
            messages={thread?.messages || []}
          />
        </Scrollbar>
      </Box>
      <Divider />
      <ChatMessageAdd onSend={handleSend} />
    </Stack>
  );
};
