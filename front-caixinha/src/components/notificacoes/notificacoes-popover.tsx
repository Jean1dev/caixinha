import { CloseOutlined, MarkEmailRead, MessageOutlined, VerifiedUser } from '@mui/icons-material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { Scrollbar } from '../scrollbar';

const renderContent = (notification: any) => {
    switch (notification.type) {
        case 'job_add': {
            const createdAt = new Date().toISOString();

            return (
                <>
                    <ListItemAvatar sx={{ mt: 0.5 }}>
                        <Avatar src={notification.avatar}>
                            <SvgIcon>
                                <VerifiedUser />
                            </SvgIcon>
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={(
                            <Box
                                sx={{
                                    alignItems: 'center',
                                    display: 'flex',
                                    flexWrap: 'wrap'
                                }}
                            >
                                <Typography
                                    sx={{ mr: 0.5 }}
                                    variant="subtitle2"
                                >
                                    {notification.author}
                                </Typography>
                                <Typography
                                    sx={{ mr: 0.5 }}
                                    variant="body2"
                                >
                                    added a new job
                                </Typography>
                                <Link
                                    href="#"
                                    underline="always"
                                    variant="body2"
                                >
                                    {notification.job}
                                </Link>
                            </Box>
                        )}
                        secondary={(
                            <Typography
                                color="text.secondary"
                                variant="caption"
                            >
                                {createdAt}
                            </Typography>
                        )}
                        sx={{ my: 0 }}
                    />
                </>
            );
        }
        case 'new_feature': {
            const createdAt = new Date().toISOString();

            return (
                <>
                    <ListItemAvatar sx={{ mt: 0.5 }}>
                        <Avatar>
                            <SvgIcon>
                                <MessageOutlined />
                            </SvgIcon>
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={(
                            <Box
                                sx={{
                                    alignItems: 'center',
                                    display: 'flex',
                                    flexWrap: 'wrap'
                                }}
                            >
                                <Typography
                                    variant="subtitle2"
                                    sx={{ mr: 0.5 }}
                                >
                                    New feature!
                                </Typography>
                                <Typography variant="body2">
                                    {notification.description}
                                </Typography>
                            </Box>
                        )}
                        secondary={(
                            <Typography
                                color="text.secondary"
                                variant="caption"
                            >
                                {createdAt}
                            </Typography>
                        )}
                        sx={{ my: 0 }}
                    />
                </>
            );
        }
        default:
            return null;
    }
};

export const NotificationsPopover = (props: any) => {
    const {
        anchorEl,
        notifications,
        onClose,
        onMarkAllAsRead,
        onRemoveOne,
        open = false,
        ...other
    } = props;

    const isEmpty = notifications.length === 0;

    return (
        <Popover
            anchorEl={anchorEl}
            anchorOrigin={{
                horizontal: 'left',
                vertical: 'bottom'
            }}
            disableScrollLock
            onClose={onClose}
            open={open}
            PaperProps={{ sx: { width: 380 } }}
            {...other}>
            <Stack
                alignItems="center"
                direction="row"
                justifyContent="space-between"
                spacing={2}
                sx={{
                    px: 3,
                    py: 2
                }}
            >
                <Typography
                    color="inherit"
                    variant="h6"
                >
                    Notifications
                </Typography>
                <Tooltip title="Mark all as read">
                    <IconButton
                        onClick={onMarkAllAsRead}
                        size="small"
                        color="inherit"
                    >
                        <SvgIcon>
                            <MarkEmailRead />
                        </SvgIcon>
                    </IconButton>
                </Tooltip>
            </Stack>
            {isEmpty
                ? (
                    <Box sx={{ p: 2 }}>
                        <Typography variant="subtitle2">
                            There are no notifications
                        </Typography>
                    </Box>
                )
                : (
                    <Scrollbar sx={{ maxHeight: 400 }}>
                        <List disablePadding>
                            {notifications.map((notification: any) => (
                                <ListItem
                                    divider
                                    key={notification.id}
                                    sx={{
                                        alignItems: 'flex-start',
                                        '&:hover': {
                                            backgroundColor: 'action.hover'
                                        },
                                        '& .MuiListItemSecondaryAction-root': {
                                            top: '24%'
                                        }
                                    }}
                                    secondaryAction={(
                                        <Tooltip title="Remove">
                                            <IconButton
                                                edge="end"
                                                onClick={() => onRemoveOne?.(notification.id)}
                                                size="small"
                                            >
                                                <SvgIcon>
                                                    <CloseOutlined />
                                                </SvgIcon>
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                >
                                    {renderContent(notification)}
                                </ListItem>
                            ))}
                        </List>
                    </Scrollbar>
                )}
        </Popover>
    );
};
