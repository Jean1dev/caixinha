import { CircularProgress, Typography } from '@mui/material';
import Image from 'next/image';

const images = [
  '/assets/crypto/images/capicoin.png',
  '/assets/crypto/images/capicoin2.png',
  '/assets/crypto/images/capicoin3.png',
]

const CenteredCircularProgress = () => {
  const image = images[Math.floor(Math.random() * images.length)];
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.08)',
        zIndex: 1300
      }}
    >
      <Image
        src={image}
        alt="Logo carregando"
        width={120}
        height={120}
        style={{ marginBottom: 24, borderRadius: 16 }}
      />
      <CircularProgress size={48} thickness={4} />
      <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 2 }}>
        Carregando...
      </Typography>
    </div>
  );
};

export default CenteredCircularProgress;
