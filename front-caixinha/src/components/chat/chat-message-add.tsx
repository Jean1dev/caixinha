import { useCallback, useRef, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Tooltip from '@mui/material/Tooltip';
import { AttachEmailOutlined, CameraAlt, Send } from '@mui/icons-material';
import { useUserAuth } from '@/hooks/useUserAuth';

interface ChatMessageAddProps {
  disabled?: boolean;
  onSend?: (body: string) => void;
}

export const ChatMessageAdd = (props: ChatMessageAddProps) => {
  const { disabled = false, onSend, ...other } = props;
  const { user } = useUserAuth()
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [body, setBody] = useState('');

  const handleAttach = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setBody(event.target.value);
  }, []);

  const handleSend = useCallback(() => {
    if (!body) {
      return;
    }

    onSend?.(body);
    setBody('');
  }, [body, onSend]);

  const handleKeyUp = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Enter') {
      handleSend();
    }
  }, [handleSend]);

  return (
    <Stack
      alignItems="center"
      direction="row"
      spacing={2}
      sx={{
        px: 3,
        py: 1
      }}
      {...other}>
      <Avatar
        sx={{
          display: {
            xs: 'none',
            sm: 'inline'
          }
        }}
        src={user.photoUrl}
      />
      <OutlinedInput
        disabled={disabled}
        fullWidth
        onChange={handleChange}
        onKeyUp={handleKeyUp}
        placeholder="Leave a message"
        size="small"
        value={body}
      />
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          m: -2,
          ml: 2
        }}
      >
        <Tooltip title="Send">
          <Box sx={{ m: 1 }}>
            <IconButton
              color="primary"
              disabled={!body || disabled}
              sx={{
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': {
                  backgroundColor: 'primary.dark'
                }
              }}
              onClick={handleSend}
            >
              <SvgIcon>
                <Send />
              </SvgIcon>
            </IconButton>
          </Box>
        </Tooltip>
        <Tooltip title="Attach photo">
          <Box
            sx={{
              display: {
                xs: 'none',
                sm: 'inline-flex'
              },
              m: 1
            }}
          >
            <IconButton
              disabled={disabled}
              edge="end"
              onClick={handleAttach}
            >
              <SvgIcon>
                <CameraAlt />
              </SvgIcon>
            </IconButton>
          </Box>
        </Tooltip>
        <Tooltip title="Attach file">
          <Box
            sx={{
              display: {
                xs: 'none',
                sm: 'inline-flex'
              },
              m: 1
            }}
          >
            <IconButton
              disabled={disabled}
              edge="end"
              onClick={handleAttach}
            >
              <SvgIcon>
                <AttachEmailOutlined />
              </SvgIcon>
            </IconButton>
          </Box>
        </Tooltip>
      </Box>
      <input
        hidden
        ref={fileInputRef}
        type="file"
      />
    </Stack>
  );
};
