import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

const options = [
  {
    label: 'Light',
    value: 'light',
    icon: (
      <SvgIcon fontSize="small">
        <Brightness4Icon />
      </SvgIcon>
    )
  },
  {
    label: 'Dark',
    value: 'dark',
    icon: (
      <SvgIcon fontSize="small">
        <Brightness7Icon />
      </SvgIcon>
    )
  }
];

export const OptionsColorScheme = (props: any) => {
  const { onChange, value } = props;

  return (
    <Stack spacing={1}>
      <Typography
        color="text.secondary"
        variant="overline"
      >
        Schema de cores
      </Typography>
      <Stack
        alignItems="center"
        direction="row"
        flexWrap="wrap"
        gap={2}
      >
        {options.map((option) => (
          <Chip
            icon={option.icon}
            key={option.value}
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