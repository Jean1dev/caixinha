import { Seo } from "@/components/Seo";
import { SocialPostCard } from "@/components/social/social-post-card";
import { Box, Breadcrumbs, Container, Link, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import { getPostInfo } from "../api/api.service";
import CenteredCircularProgress from "@/components/CenteredCircularProgress";
import Layout from "@/components/Layout";
import { RouterLink } from "@/components/RouterLink";

export default function PostId() {
    const router = useRouter()
    const { id } = router.query;
    const [post, setPost] = useState<any>(null)

    useEffect(() => {
        getPostInfo(id as string)
            .then((data: any) => setPost(data))
    }, [id])

    if (!post) {
        return <CenteredCircularProgress />
    }

    return (
        <Layout>
            <Seo title="Post compartilhado" />
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
                            Confira esse post
                        </Typography>
                        <Typography variant="h4">
                            WIP
                        </Typography>
                        <Breadcrumbs separator={<Box
                            sx={{
                                backgroundColor: 'neutral.500',
                                borderRadius: '50%',
                                height: 4,
                                width: 4
                            }}
                        />}>
                            <Link
                                color="text.primary"
                                component={RouterLink}
                                href={'/'}
                                variant="subtitle2"
                            >
                                Dashboard
                            </Link>
                            <Link
                                color="text.primary"
                                component={RouterLink}
                                href={'/feed'}
                                variant="subtitle2"
                            >
                                Feed
                            </Link>
                            <Typography
                                color="text.secondary"
                                variant="subtitle2"
                            >
                                Post
                            </Typography>
                        </Breadcrumbs>
                    </Stack>
                    <Stack
                        spacing={3}
                        sx={{ mt: 3 }}
                    >
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

                    </Stack>
                </Container>
            </Box>
        </Layout>
    )
}