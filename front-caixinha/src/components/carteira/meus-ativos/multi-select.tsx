import { useCallback } from 'react';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SvgIcon from '@mui/material/SvgIcon';
import { usePopover } from '@/hooks/usePopover';
import { FilterAlt } from '@mui/icons-material';

export const MultiSelect = (props: any) => {
  const { label, onChange, options, value = [], ...other } = props;
  const popover = usePopover();

  const handleValueChange = useCallback((event: any) => {
    let newValue = [...value];

    if (event.target.checked) {
      newValue.push(event.target.value);
    } else {
      newValue = newValue.filter((item) => item !== event.target.value);
    }

    onChange?.(newValue);
  }, [onChange, value]);

  return (
    <>
      <Button
        color="inherit"
        endIcon={(
          <SvgIcon>
            <FilterAlt />
          </SvgIcon>
        )}
        onClick={popover.handleOpen}
        ref={popover.anchorRef}
        {...other}>
        {label}
      </Button>
      <Menu
        anchorEl={popover.anchorRef.current}
        onClose={popover.handleClose}
        open={popover.open}
        PaperProps={{ style: { width: 250 } }}
      >
        {options.map((option: any) => (
          <MenuItem key={option.label}>
            <FormControlLabel
              control={(
                <Checkbox
                  checked={value.includes(option.value)}
                  onChange={handleValueChange}
                  value={option.value}
                />
              )}
              label={option.label}
              sx={{
                flexGrow: 1,
                mr: 0
              }}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
