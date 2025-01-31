import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import Layout from "@/components/Layout";
import { getSession } from "next-auth/react";
import { Seo } from "@/components/Seo";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
    Box,
    Divider,
    IconButton,
    SvgIcon,
    useMediaQuery
} from "@mui/material";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { ChatContainer } from "@/components/chat/chat-container";
import { ChatThread } from "@/components/chat/chat-thread";
import { ChatComposer } from "@/components/chat/chat-composer";
import { ChatBlank } from "@/components/chat/chat-blank";
import { Menu } from "@mui/icons-material";

interface PageProps {
    userEmailLogged: string | null;
    userLogged: string | null
}

const initialState = {
    contacts: {
        byId: {},
        allIds: []
    },
    currentThreadId: undefined,
    threads: {
        byId: {},
        allIds: []
    }
};

// para buscar os chats
const useThreads = () => {
    //const dispatch = useDispatch();

    const handleThreadsGet = useCallback(() => {
        //dispatch(thunks.getThreads());
        console.log('get threads');
    }, []);

    useEffect(() => {
        handleThreadsGet();
    },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []);
};

const useSidebar = () => {
    const searchParams = useSearchParams();
    const mdUp = useMediaQuery((theme: any) => theme.breakpoints.up('md'));
    const [open, setOpen] = useState(mdUp);

    const handleScreenResize = useCallback(() => {
        if (!mdUp) {
            setOpen(false);
        } else {
            setOpen(true);
        }
    }, [mdUp]);

    useEffect(() => {
        handleScreenResize();
    },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [mdUp]);

    const handeParamsUpdate = useCallback(() => {
        if (!mdUp) {
            setOpen(false);
        }
    }, [mdUp]);

    useEffect(() => {
        handeParamsUpdate();
    },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [searchParams]);

    const handleToggle = useCallback(() => {
        setOpen((prevState) => !prevState);
    }, []);

    const handleClose = useCallback(() => {
        setOpen(false);
    }, []);

    return {
        handleToggle,
        handleClose,
        open
    };
};

const ChatPage = () => {
    const rootRef = useRef(null);
    const searchParams = useSearchParams();
    const compose = searchParams.get('compose') === 'true';
    const threadKey = searchParams.get('threadKey') || undefined;
    const sidebar = useSidebar();

    //TODO: utilizar futuramente
    //usePageView()
    useThreads();

    const view = threadKey
        ? 'thread'
        : compose
            ? 'compose'
            : 'blank';

    return (
        <>
            <Seo title="Dashboard: Chat" />
            <Divider />
            <Box
                component="main"
                sx={{
                    backgroundColor: 'background.paper',
                    flex: '1 1 auto',
                    overflow: 'hidden',
                    position: 'relative'
                }}
            >
                <Box
                    ref={rootRef}
                    sx={{
                        bottom: 0,
                        display: 'flex',
                        left: 0,
                        position: 'absolute',
                        right: 0,
                        top: 0
                    }}
                >
                    <ChatSidebar
                        container={rootRef.current}
                        onClose={sidebar.handleClose}
                        open={sidebar.open}
                    />
                    <ChatContainer open={sidebar.open}>
                        <Box sx={{ p: 2 }}>
                            <IconButton onClick={sidebar.handleToggle}>
                                <SvgIcon>
                                    <Menu />
                                </SvgIcon>
                            </IconButton>
                        </Box>
                        <Divider />
                        {view === 'thread' && <ChatThread threadKey={threadKey} />}
                        {view === 'compose' && <ChatComposer />}
                        {view === 'blank' && <ChatBlank />}
                    </ChatContainer>
                </Box>
            </Box>
        </>
    )
}

export default function Page(props: PageProps) {
    if (!props.userLogged) {
        return (
            <Layout>
                <p>Usuário não logado</p>
            </Layout>
        );
    }

    return (
        <Layout>
            <ChatPage />
        </Layout>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<PageProps>> {
    const session = await getSession(context);
    return {
        props: {
            userLogged: session?.user?.name || null,
            userEmailLogged: session?.user?.email || null,
        },
    };
}
