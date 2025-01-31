import Layout from "@/components/Layout";
import { Seo } from "@/components/Seo";
import { SocialPostAdd } from "@/components/social/social-post-add";
import { SocialPostCard } from "@/components/social/social-post-card";
import { Box, Container, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getMeuFeed } from "../api/feed";
import { useUserAuth } from "@/hooks/useUserAuth";
import { useTranslation } from "react-i18next";

export default function Feed() {
    const [posts, setPosts] = useState([])
    const { user } = useUserAuth()
    const { t } = useTranslation()

    useEffect(() => {
        const username = user?.name
        if (!username)
            return

        getMeuFeed(username)
            .then((data: any) => setPosts(data))
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
                            WIP
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
                            />
                        ))}
                    </Stack>
                </Container>
            </Box>
        </Layout>
    )
}