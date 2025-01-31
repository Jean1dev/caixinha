import { usePopover } from '@/hooks/usePopover';
import { useUserAuth } from '@/hooks/useUserAuth';
import { 
  Archive, 
  Camera, 
  Delete, 
  FlashAutoOutlined, 
  MoreHoriz, 
  NotificationAddOutlined, 
  Phone 
} from '@mui/icons-material';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

const getRecipients = (participants: any, userId: string) => {
  return participants.filter((participant: any) => participant.id !== userId);
};

const getDisplayName = (recipients: any) => {
  return recipients
    .map((participant: any) => participant.name)
    .join(', ');
};

const getLastActive = (recipients: any) => {
  const hasLastActive = recipients.length === 1 && recipients[0].lastActivity;
  return hasLastActive ? 'Active ' : 'Offline ha 3 dias';
};

export const ChatThreadToolbar = (props: any) => {
  const { participants = [], ...other } = props;
  const { user } = useUserAuth()
  const popover = usePopover();

  // Maybe use memo for these values

  const recipients = getRecipients(participants, user.email);
  const displayName = getDisplayName(recipients);
  const lastActive = getLastActive(recipients);

  return (
    <>
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={2}
        sx={{
          flexShrink: 0,
          minHeight: 64,
          px: 2,
          py: 1
        }}
        {...other}>
        <Stack
          alignItems="center"
          direction="row"
          spacing={2}
        >
          <AvatarGroup
            max={2}
            sx={{
              ...(recipients.length > 1 && {
                '& .MuiAvatar-root': {
                  height: 30,
                  width: 30,
                  '&:nth-of-type(2)': {
                    mt: '10px'
                  }
                }
              })
            }}
          >
            {recipients.map((recipient: any) => (
              <Avatar
                key={recipient.id}
                src={recipient.avatar || undefined}
              />
            ))}
          </AvatarGroup>
          <div>
            <Typography variant="subtitle2">
              {displayName}
            </Typography>
            {lastActive && (
              <Typography
                color="text.secondary"
                variant="caption"
              >
                Last active
                {' '}
                {lastActive}
              </Typography>
            )}
          </div>
        </Stack>
        <Stack
          alignItems="center"
          direction="row"
          spacing={1}
        >
          <IconButton>
            <SvgIcon>
              <Phone />
            </SvgIcon>
          </IconButton>
          <IconButton>
            <SvgIcon>
              <Camera />
            </SvgIcon>
          </IconButton>
          <Tooltip title="More options">
            <IconButton
              onClick={popover.handleOpen}
              ref={popover.anchorRef}
            >
              <SvgIcon>
                <MoreHoriz />
              </SvgIcon>
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
      <Menu
        anchorEl={popover.anchorRef.current}
        keepMounted
        onClose={popover.handleClose}
        open={popover.open}
      >
        <MenuItem>
          <ListItemIcon>
            <SvgIcon>
              <FlashAutoOutlined />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText primary="Block" />
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <SvgIcon>
              <Delete />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText primary="Delete" />
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <SvgIcon>
              <Archive />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText primary="Archive" />
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <SvgIcon>
              <NotificationAddOutlined />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText primary="Mute" />
        </MenuItem>
      </Menu>
    </>
  );
};
