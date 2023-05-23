import {
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Divider,
    Typography
  } from '@mui/material';
  
  export const DetalhesUser = ({ user }: any) => (
    <Card>
      <CardContent>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Avatar
            src='https://pbs.twimg.com/profile_images/1294819965632163840/zL35EMhv_400x400.jpg'
            sx={{
              height: 80,
              mb: 2,
              width: 80
            }}
          />
          <Typography
            gutterBottom
            variant="h5"
          >
            {user.name}
          </Typography>
          <Typography
            color="text.secondary"
            variant="body2"
          >
            América do Sul
          </Typography>
          <Typography
            color="text.secondary"
            variant="body2"
          >
            GMT -3
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <Button
          fullWidth
          variant="text"
        >
          Acessar historico de pagador
        </Button>
      </CardActions>
    </Card>
  );
  