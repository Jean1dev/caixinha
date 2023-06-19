import React, { useCallback, useRef } from 'react';
import Drawer from '@mui/material/Drawer';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { CloseOutlined, Search } from '@mui/icons-material';

export const EmprestimosFiltros = (props: any) => {
    const {
        container,
        filters = {},
        group,
        onClose,
        onFiltersChange,
        onGroupChange,
        open,
        ...other
    } = props;
    const queryRef = useRef<any>(null);
    const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up('lg'));

    const handleQueryChange = useCallback((event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        onFiltersChange?.({
            ...filters,
            query: queryRef.current?.value || ''
        });
    }, [filters, onFiltersChange]);


    const content = (
        <div>
            <Stack
                alignItems="center"
                justifyContent="space-between"
                direction="row"
                sx={{ p: 3 }}
            >
                <Typography variant="h5">
                    Filtros
                </Typography>
                {!lgUp && (
                    <IconButton onClick={onClose}>
                        <SvgIcon>
                            <CloseOutlined />
                        </SvgIcon>
                    </IconButton>
                )}
            </Stack>
            <Stack
                spacing={3}
                sx={{ p: 3 }}
            >
                <form onSubmit={handleQueryChange}>
                    <OutlinedInput
                        defaultValue=""
                        fullWidth
                        inputProps={{ ref: queryRef }}
                        placeholder="Numero do emprestimo"
                        startAdornment={(
                            <InputAdornment position="start">
                                <SvgIcon>
                                    <Search />
                                </SvgIcon>
                            </InputAdornment>
                        )}
                    />
                </form>
                {/* <div>
                    <FormLabel
                        sx={{
                            display: 'block',
                            mb: 2
                        }}
                    >
                        Issue date
                    </FormLabel>
                    <Stack spacing={2}>
                        <DatePicker
                            format="dd/MM/yyyy"
                            label="From"
                            onChange={handleStartDateChange}
                            value={filters.startDate || null}
                        />
                        <DatePicker
                            format="dd/MM/yyyy"
                            label="To"
                            onChange={handleEndDateChange}
                            value={filters.endDate || null}
                        />
                    </Stack>
                </div> */}


                {/* <div>
                    <FormLabel
                        sx={{
                            display: 'block',
                            mb: 2
                        }}
                    >
                        From customer
                    </FormLabel>
                    <Box
                        sx={{
                            backgroundColor: (theme) => theme.palette.mode === 'dark'
                                ? 'neutral.800'
                                : 'neutral.50',
                            borderColor: 'divider',
                            borderRadius: 1,
                            borderStyle: 'solid',
                            borderWidth: 1
                        }}
                    >
                        <Scrollbar sx={{ maxHeight: 200 }}>
                            <FormGroup
                                sx={{
                                    py: 1,
                                    px: 1.5
                                }}
                            >
                                {customers.map((customer) => {
                                    const isChecked = filters.customers?.includes(customer);

                                    return (
                                        <FormControlLabel
                                            control={(
                                                <Checkbox
                                                    checked={isChecked}
                                                    onChange={handleCustomerToggle}
                                                />
                                            )}
                                            key={customer}
                                            label={customer}
                                            value={customer}
                                        />
                                    );
                                })}
                            </FormGroup>
                        </Scrollbar>
                    </Box>
                </div> */}

                <FormControlLabel
                    control={(
                        <Switch
                            checked={group}
                            onChange={onGroupChange}
                        />
                    )}
                    label="Agrupado por status"
                />
            </Stack>
        </div>
    );

    if (lgUp) {
        return (
            <Drawer
                anchor="rigth"
                open={open}
                PaperProps={{
                    elevation: 16,
                    sx: {
                        border: 'none',
                        borderRadius: 2.5,
                        overflow: 'hidden',
                        position: 'relative',
                        width: 380
                    }
                }}
                SlideProps={{ container }}
                variant="persistent"
                sx={{ p: 3 }}
                {...other}>
                {content}
            </Drawer>
        );
    }

    return (
        <Drawer
            anchor="rigth"
            hideBackdrop
            ModalProps={{
                container,
                sx: {
                    pointerEvents: 'none',
                    position: 'absolute'
                }
            }}
            onClose={onClose}
            open={open}
            PaperProps={{
                sx: {
                    maxWidth: '100%',
                    width: 380,
                    pointerEvents: 'auto',
                    position: 'absolute'
                }
            }}
            SlideProps={{ container }}
            variant="temporary"
            {...other}>
            {content}
        </Drawer>
    );
};
