import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export const ChatBlank = () => (
  <Box
    sx={{
      alignItems: 'center',
      display: 'flex',
      flexGrow: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      overflow: 'hidden'
    }}
  >
    <Box
      component="img"
      src="/assets/chat-not-found.png"
      sx={{
        height: 'auto',
        maxWidth: 120
      }}
    />
    <Typography
      color="text.secondary"
      sx={{ mt: 2 }}
      variant="subtitle1"
    >
      Start meaningful conversations!
    </Typography>
  </Box>
);
