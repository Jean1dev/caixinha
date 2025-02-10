//@ts-nocheck
import { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { ChatMessageAdd } from './chat-message-add';
import { useRouter } from 'next/router';
import { ChatComposerRecipients } from './chat-composer-recipients';

const useRecipients = () => {
  const [recipients, setRecipients] = useState([]);

  const handleRecipientAdd = useCallback((recipient) => {
    setRecipients((prevState) => {
      const found = prevState.find((_recipient) => _recipient.id === recipient.id);

      if (found) {
        return prevState;
      }

      return [...prevState, recipient];
    });
  }, []);

  const handleRecipientRemove = useCallback((recipientId) => {
    setRecipients((prevState) => {
      return prevState.filter((recipient) => recipient.id !== recipientId);
    });
  }, []);

  return {
    handleRecipientAdd,
    handleRecipientRemove,
    recipients
  };
};

export const ChatComposer = (props: any) => {
  const router = useRouter();
  const { handleRecipientAdd, handleRecipientRemove, recipients } = useRecipients();

  const handleSend = useCallback(async (body) => {
    alert('local 1')
    debugger
    console.log(body)
    const recipientIds = recipients.map((recipient) => recipient.id);

    let threadId;

    try {
      // Handle send message and redirect to the new thread
    //   threadId = await dispatch(thunks.addMessage({
    //     recipientIds,
    //     body
    //   }));
    } catch (err) {
      console.error(err);
      return;
    }

    router.push(`/chat?threadKey=${threadId}`);
  }, [router, recipients]);

  const canAddMessage = recipients.length > 0;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1
      }}
      {...props}>
      <ChatComposerRecipients
        onRecipientAdd={handleRecipientAdd}
        onRecipientRemove={handleRecipientRemove}
        recipients={recipients}
      />
      <Divider />
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <ChatMessageAdd
        disabled={!canAddMessage}
        onSend={handleSend}
      />
    </Box>
  );
};
