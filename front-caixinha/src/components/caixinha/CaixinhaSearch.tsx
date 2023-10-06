import SearchIcon from '@mui/icons-material/Search';
import { Card, InputAdornment, OutlinedInput, SvgIcon } from '@mui/material';
import React, { useState } from 'react';

export const CaixinhaSearch = (props: any) => {
  const { search } = props
  const [text, setText] = useState('')
  return (
    <Card sx={{ p: 2 }}>
      <OutlinedInput
        value={text}
        onChange={(e) => {
          const val = e.target.value
          setText(val)
          search(val)
        }}
        fullWidth
        placeholder="Buscar caixinhas"
        startAdornment={(
          <InputAdornment position="start">
            <SvgIcon
              color="action"
              fontSize="small"
            >
              <SearchIcon />
            </SvgIcon>
          </InputAdornment>
        )}
        sx={{ maxWidth: 500 }}
      />
    </Card>
  );
}
