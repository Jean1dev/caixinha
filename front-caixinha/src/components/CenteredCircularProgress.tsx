import { CircularProgress } from '@mui/material';
import Image from 'next/image';

const CenteredCircularProgress = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <p> Powered by</p>
      <Image width={100} height={50} alt='azure' src='/assets/logos/azure.svg' />
      <CircularProgress />
    </div>
  );
};

export default CenteredCircularProgress;
