import { CircularProgress } from '@mui/material';

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
      <img src='/assets/logos/azure.svg' />
      <CircularProgress />
    </div>
  );
};

export default CenteredCircularProgress;
