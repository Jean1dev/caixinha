import { Box, Divider, MenuItem, MenuList, Popover, Typography } from '@mui/material';
import { signOut, useSession } from 'next-auth/react';

export const AccountPopover = (props: any) => {
  const { anchorEl, onClose, open } = props;
  const handleSignOut = async () => await signOut()
  const { data } = useSession()
    
  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'left',
        vertical: 'bottom'
      }}
      onClose={onClose}
      open={open}
      PaperProps={{ sx: { width: 200 } }}
    >
      <Box
        sx={{
          py: 1.5,
          px: 2
        }}
      >
        <Typography variant="overline">
          Logado como
        </Typography>
        <Typography
          color="text.secondary"
          variant="body2"
        >
          {data?.user?.name}
        </Typography>
      </Box>
      <Divider />
      <MenuList
        disablePadding
        dense
        sx={{
          p: '8px',
          '& > *': {
            borderRadius: 1
          }
        }}
      >
        <MenuItem onClick={handleSignOut}>
          Sign out
        </MenuItem>
      </MenuList>
    </Popover>
  );
};

