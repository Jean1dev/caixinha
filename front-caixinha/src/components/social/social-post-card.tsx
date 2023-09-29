import { useCallback, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { Favorite, HeartBroken, Schedule, Share } from '@mui/icons-material';
import { SocialComment } from './social-comment';
import { SocialCommentAdd } from './social-comment-add';
import { likePost, unlikePost } from '@/pages/api/api.service';
import toast from 'react-hot-toast';

export const SocialPostCard = (props: any) => {
  const {
    postId,
    authorAvatar,
    authorName,
    comments,
    createdAt,
    isLiked: isLikedProp,
    likes: likesProp,
    media,
    message,
    ...other
  } = props;
  const [isLiked, setIsLiked] = useState(isLikedProp);
  const [likes, setLikes] = useState(likesProp);

  const handleLike = useCallback(() => {
    likePost(postId)
    setIsLiked(true);
    setLikes((prevLikes: any) => prevLikes + 1);
  }, [postId]);

  const handleUnlike = useCallback(() => {
    unlikePost(postId)
    setIsLiked(false);
    setLikes((prevLikes: any) => prevLikes - 1);
  }, [postId]);

  const copyToClipboard = useCallback(() => {
    const currentUrl = window.location.href
    navigator.clipboard.writeText(`${currentUrl}/${postId}`)
      .then(() => {
        toast.success('Link copiado para a área de transferência');
      })
      .catch(() => {
        toast.error('Erro ao copiar o Link para a área de transferência:');
      })
  }, [postId])

  return (
    <Card {...other}>
      <CardHeader
        avatar={(
          <Avatar
            component="a"
            href="#"
            src={authorAvatar}
          />
        )}
        disableTypography
        subheader={(
          <Stack
            alignItems="center"
            direction="row"
            spacing={1}
          >
            <SvgIcon color="action">
              <Schedule />
            </SvgIcon>
            <Typography
              color="text.secondary"
              variant="caption"
            >
              {createdAt}
              {' '}
              ago
            </Typography>
          </Stack>
        )}
        title={(
          <Stack
            alignItems="center"
            direction="row"
            spacing={0.5}
            sx={{ mb: 1 }}
          >
            <Link
              color="text.primary"
              href="#"
              variant="subtitle2"
            >
              {authorName}
            </Link>
            <Typography variant="body2">
              updated her status
            </Typography>
          </Stack>
        )}
      />
      <Box
        sx={{
          pb: 2,
          px: 3
        }}
      >
        <Typography variant="body1">
          {message}
        </Typography>
        {media && (
          <Box sx={{ mt: 3 }}>
            <CardActionArea>
              <CardMedia
                image={media}
                sx={{
                  backgroundPosition: 'top',
                  height: 500
                }}
              />
            </CardActionArea>
          </Box>
        )}
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          spacing={2}
          sx={{ mt: 2 }}
        >
          <div>
            <Stack
              alignItems="center"
              direction="row"
            >
              {isLiked
                ? (
                  <Tooltip title="Unlike">
                    <IconButton onClick={handleUnlike}>
                      <SvgIcon
                        sx={{
                          color: 'error.main',
                          '& path': {
                            fill: (theme) => theme.palette.error.main,
                            fillOpacity: 1
                          }
                        }}
                      >
                        <Favorite />
                      </SvgIcon>
                    </IconButton>
                  </Tooltip>
                )
                : (
                  <Tooltip title="Like">
                    <IconButton onClick={handleLike}>
                      <SvgIcon>
                        <HeartBroken />
                      </SvgIcon>
                    </IconButton>
                  </Tooltip>
                )}
              <Typography
                color="text.secondary"
                variant="subtitle2"
              >
                {likes}
              </Typography>
            </Stack>
          </div>
          <div>
            <IconButton onClick={copyToClipboard}>
              <SvgIcon>
                <Share />
              </SvgIcon>
            </IconButton>
          </div>
        </Stack>
        <Divider sx={{ my: 3 }} />
        <Stack spacing={3}>
          {comments.map((comment: any) => (
            <SocialComment
              authorAvatar={comment.author.avatar}
              authorName={comment.author.name}
              createdAt={comment.createdAt}
              key={comment.id}
              message={comment.message}
            />
          ))}
        </Stack>
        <Divider sx={{ my: 3 }} />
        <SocialCommentAdd parentPostId={postId} />
      </Box>
    </Card>
  );
};

