import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export const SocialComment = (props: any) => {
  const { authorAvatar, authorName, createdAt, message, ...other } = props;

  const ago = createdAt;

  return (
    <Stack
      alignItems="flex-start"
      direction="row"
      spacing={2}
      {...other}>
      <Avatar
        component="a"
        href="#"
        src={authorAvatar}
      />
      <Stack
        spacing={1}
        sx={{
          backgroundColor: (theme) => theme.palette.mode === 'dark'
            ? 'neutral.800'
            : 'neutral.50',
          borderRadius: 1,
          flexGrow: 1,
          p: 2
        }}
      >
        <Stack
          alignItems="center"
          direction="row"
          spacing={1}
        >
          <Link
            color="text.primary"
            href="#"
            variant="subtitle2"
          >
            {authorName}
          </Link>
          <Box sx={{ flexGrow: 1 }} />
          <Typography
            color="text.secondary"
            variant="caption"
          >
            {ago}
            {' '}
            ago
          </Typography>
        </Stack>
        <Typography variant="body2">
          {message}
        </Typography>
      </Stack>
    </Stack>
  );
};
