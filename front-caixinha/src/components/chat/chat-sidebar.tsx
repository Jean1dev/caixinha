import { use, useCallback, useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useRouter } from 'next/router';
import { Add, Close } from '@mui/icons-material';
import { Scrollbar } from '../scrollbar';
import { ChatSidebarSearch } from './chat-sidebar-search';
import { useUserAuth } from '@/hooks/useUserAuth';
import { ChatThreadItem } from './chat-thread-item';

interface Thread {
  id: string;
  type: 'GROUP' | 'DIRECT';
  participantIds: string[];
}

const getThreadKey = (thread: Thread, userId: string): string | undefined => {
  let threadKey: string | undefined;

  if (thread.type === 'GROUP') {
    threadKey = thread.id;
  } else {
    threadKey = thread.participantIds.find((participantId) => participantId !== userId);
  }

  return threadKey;
};

const useThreads = () => {
  return {
    byId: {},
    allIds: []
  }
  //return useSelector((state) => state.chat.threads);
};

const useCurrentThreadId = () => {
  return null
  //return useSelector((state) => state.chat.currentThreadId);
};

interface DefaultProps {
  open: boolean
  onClose: () => void
  container: any
}

export const ChatSidebar = (props: DefaultProps) => {
  const { container, onClose, open, ...other } = props;
  const { user } = useUserAuth();

  const router = useRouter();
  const threads = useThreads();
  const currentThreadId = useCurrentThreadId();
  const [searchFocused, setSearchFocused] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>([]);
  const mdUp = useMediaQuery((theme: any) => theme.breakpoints.up('md'));

  const handleCompose = useCallback(() => {
    router.push('/chat?compose=true');
  }, [router]);

  const fetchAllContatos = useCallback(async () => {
    try {
      const fetchRresult = await fetch('/api/trpc/meus-contatos',
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'email': user.email,
            'user': user.name,
          },
        })
      const contacts = await fetchRresult.json();
      setSearchResults(contacts);
    } catch (err) {
      console.error(err);
    }
  }, [user])

  const handleSearchChange = useCallback(async (event: any) => {
    const { value } = event.target;
    setSearchQuery(value);

    if (!value) {
      setSearchResults([]);
      return;
    }

    fetchAllContatos()
  }, [fetchAllContatos]);

  const handleSearchClickAway = useCallback(() => {
    if (searchFocused) {
      //setSearchFocused(false);
      setSearchQuery('');
    }
  }, [searchFocused]);

  const handleSearchFocus = useCallback(() => {
    setSearchFocused(true);
  }, []);

  const handleSearchSelect = useCallback((contact: any) => {
    // We use the contact ID as a thread key
    const threadKey = contact.email;

    //setSearchFocused(false);
    setSearchQuery('');

    router.push(`/chat?threadKey=${threadKey}`);
  }, [router]);

  const handleThreadSelect = useCallback((threadId: string) => {
    //@ts-ignore
    const thread = threads.byId[threadId];
    const threadKey = getThreadKey(thread, user.email);

    if (!threadKey) {
      router.push('/chat');
    } else {
      router.push(`/chat?threadKey=${threadKey}`);
    }
  }, [router, threads, user]);

  useEffect(() => {
    if (user.email) {
      fetchAllContatos()
    }
  }, [user])

  const content = (
    <div>
      <Stack
        alignItems="center"
        direction="row"
        spacing={2}
        sx={{ p: 2 }}
      >
        <Typography
          variant="h5"
          sx={{ flexGrow: 1 }}
        >
          Chats
        </Typography>
        <Button
          onClick={handleCompose}
          startIcon={(
            <SvgIcon>
              <Add />
            </SvgIcon>
          )}
          variant="contained"
        >
          Group
        </Button>
        {!mdUp && (
          <IconButton onClick={onClose}>
            <SvgIcon>
              <Close />
            </SvgIcon>
          </IconButton>
        )}
      </Stack>
      <ChatSidebarSearch
        isFocused={searchFocused}
        onChange={handleSearchChange}
        onClickAway={handleSearchClickAway}
        onFocus={handleSearchFocus}
        onSelect={handleSearchSelect}
        query={searchQuery}
        results={searchResults.contatos}
      />
      <Box sx={{ display: searchFocused ? 'none' : 'block' }}>
        <Scrollbar>
          <Stack
            component="ul"
            spacing={0.5}
            sx={{
              listStyle: 'none',
              m: 0,
              p: 2
            }}
          >
            {threads.allIds.map((threadId) => (
              <ChatThreadItem
                active={currentThreadId === threadId}
                key={threadId}
                onSelect={() => handleThreadSelect(threadId)}
                thread={threads.byId[threadId]}
              />
            ))}
          </Stack>
        </Scrollbar>
      </Box>
    </div>
  );

  if (mdUp) {
    return (
      <Drawer
        anchor="left"
        open={open}
        PaperProps={{
          sx: {
            position: 'relative',
            width: 380
          }
        }}
        SlideProps={{ container }}
        variant="persistent"
        {...other}>
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      hideBackdrop
      ModalProps={{
        container,
        sx: {
          pointerEvents: 'none',
          position: 'absolute'
        }
      }}
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          maxWidth: '100%',
          width: 380,
          pointerEvents: 'auto',
          position: 'absolute'
        }
      }}
      SlideProps={{ container }}
      variant="temporary"
      {...other}>
      {content}
    </Drawer>
  );
};
