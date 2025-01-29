import { useCallback, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { useRouter } from 'next/router';
import { ChatThreadToolbar } from './chat-thread-toolbar';
import { Scrollbar } from '../scrollbar';
import { ChatMessages } from './chat-messages';
import { ChatMessageAdd } from './chat-message-add';

const useParticipants = (threadKey: string) => {
  const router = useRouter();
  const [participants, setParticipants] = useState([]);

  const handleParticipantsGet = useCallback(async () => {
    try {
      //const participants = await chatApi.getParticipants({ threadKey });
      const participants = []
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
  const thread = null;
//   const thread = useSelector((state) => {
//     const { threads, currentThreadId } = state.chat;

//     return threads.byId[currentThreadId];
//   });

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

  useEffect(() => {
      handleThreadGet();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [threadKey]);

  return thread;
};

const useMessagesScroll = (thread) => {
  const messagesRef = useRef(null);

  const handleUpdate = useCallback(() => {
    // Thread does not exist
    if (!thread) {
      return;
    }

    // Ref is not used
    if (!messagesRef.current) {
      return;
    }

    const container = messagesRef.current;
    const scrollElement = container.getScrollElement();

    if (scrollElement) {
      scrollElement.scrollTop = container.el.scrollHeight;
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

export const ChatThread = (props) => {
  const { threadKey, ...other } = props;
  const user = {
    id: '5e86809283e28b96d2d38537',
    avatar: '/assets/avatars/avatar-anika-visser.png',
    name: 'Anika Visser',
    email: 'anika.visser@devias.io'
  };
  const thread = useThread(threadKey);
  const participants = useParticipants(threadKey);
  const { messagesRef } = useMessagesScroll(thread);

  const handleSend = useCallback(async (body: string) => {
    // If we have the thread, we use its ID to add a new message
    alert('local 2')
    debugger
    console.log(body)
    if (thread) {
      try {
        // await dispatch(thunks.addMessage({
        //   threadId: thread.id,
        //   body
        // }));
      } catch (err) {
        console.error(err);
      }

      return;
    }

    // Otherwise we use the recipients IDs. When using participant IDs, it means that we have to
    // get the thread.

    // Filter the current user to get only the other participants

    const recipientIds = participants
      .filter((participant) => participant.id !== user.id)
      .map((participant) => participant.id);

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
            participants={thread?.participants || []}
          />
        </Scrollbar>
      </Box>
      <Divider />
      <ChatMessageAdd onSend={handleSend} />
    </Stack>
  );
};
