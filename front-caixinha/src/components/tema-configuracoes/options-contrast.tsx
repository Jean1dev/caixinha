import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const options = [
  {
    label: 'Normal',
    value: 'normal'
  },
  {
    label: 'High',
    value: 'high'
  }
];

export const OptionsContrast = (props: any) => {
  const { onChange, value } = props;

  return (
    <Stack spacing={1}>
      <Typography
        color="text.secondary"
        variant="overline"
      >
        Constraste
      </Typography>
      <Stack
        alignItems="center"
        direction="row"
        flexWrap="wrap"
        gap={2}
      >
        {options.map((option) => (
          <Chip
            key={option.label}
            label={option.label}
            onClick={() => onChange?.(option.value)}
            sx={{
              borderColor: 'transparent',
              borderRadius: 1.5,
              borderStyle: 'solid',
              borderWidth: 2,
              ...(option.value === value && {
                borderColor: 'primary.main'
              })
            }}
          />
        ))}
      </Stack>
    </Stack>
  );
};

