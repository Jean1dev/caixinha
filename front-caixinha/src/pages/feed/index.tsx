import Layout from "@/components/Layout";
import { Seo } from "@/components/Seo";
import { SocialPostAdd } from "@/components/social/social-post-add";
import { SocialPostCard } from "@/components/social/social-post-card";
import {
    Box,
    Container,
    Stack,
    Typography,
    Button
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { getMeuFeed } from "../api/feed";
import { useUserAuth } from "@/hooks/useUserAuth";
import { useTranslation } from "react-i18next";

export default function Feed() {
    const [posts, setPosts] = useState<any[]>([])
    const [page, setPage] = useState(0)
    const [hasMore, setHasMore] = useState(false)
    const { user } = useUserAuth()
    const { t } = useTranslation()

    useEffect(() => {
        const username = user?.name
        if (!username)
            return

        getMeuFeed(username)
            .then((data: any) => {
                if (!data?.data) {
                    setHasMore(false)
                    return
                }
                
                if (data.data.length === 0) {
                    setHasMore(false)
                    return
                }

                setPosts(data.data)
                setHasMore(data.hasMore)
            })
    }, [user])

    const loadMore = useCallback(() => {
        setPage(page + 1)
        getMeuFeed(user.name, page + 1)
            .then((data: any) => {
                setPosts((prevValues: any) => {
                    return [...prevValues, ...data.data]
                })
                setHasMore(data.hasMore)
            })
    }, [page, user])

    const addCommentView = useCallback((comment: string, postId: string) => {
        setPosts((prevValues: any) => {
            const newPosts = prevValues.map((p: any) => {
                if (p.id === postId) {
                    p.comments.push({
                        id: new Date().toISOString(),
                        author: {
                            id: user?.email,
                            avatar: user?.photoUrl,
                            name: user?.name
                        },
                        createdAt: new Date().getTime(),
                        message: comment
                    })
                }

                return p
            })

            return newPosts
        })
    }, [user])

    return (
        <Layout>
            <Seo title={t('feed.seo')} />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Container maxWidth="lg">
                    <Stack spacing={1}>
                        <Typography
                            color="text.secondary"
                            variant="overline"
                        >
                            {t('feed.title')}
                        </Typography>
                        <Typography variant="h4">
                            {t('feed.headlines')}
                        </Typography>
                    </Stack>
                    <Stack
                        spacing={3}
                        sx={{ mt: 3 }}
                    >
                        <SocialPostAdd />
                        {posts.map((post: any) => (
                            <SocialPostCard
                                key={post.id}
                                postId={post.id}
                                authorAvatar={post.author.avatar}
                                authorName={post.author.name}
                                comments={post.comments}
                                createdAt={post.createdAt}
                                isLiked={post.isLiked}
                                likes={post.likes}
                                media={post.media}
                                message={post.message}

                                addCommentView={addCommentView}
                            />
                        ))}
                    </Stack>
                    {hasMore && (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                mt: 3
                            }}
                        >
                            <Button variant="outlined" onClick={loadMore}>
                                {t('loadmore')} ...
                            </Button>
                        </Box>
                    )}
                </Container>
            </Box>
        </Layout>
    )
}