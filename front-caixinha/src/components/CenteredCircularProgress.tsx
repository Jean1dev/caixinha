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
      <CircularProgress />
    </div>
  );
};

export default CenteredCircularProgress;
