import { CircularProgress } from '@mui/material';
import Image from 'next/image';

const images = [
  '/assets/crypto/images/capicoin.png',
  '/assets/crypto/images/capicoin2.png',
  '/assets/crypto/images/capicoin3.png',
]

const CenteredCircularProgress = () => {
  const image = images[Math.floor(Math.random() * images.length)];
  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image
          src={image}
          alt="Picture of the author"
          width={500}
          height={500}
        />
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </div>
    </>
  );
};

export default CenteredCircularProgress;
