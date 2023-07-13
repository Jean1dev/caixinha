import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Input from '@mui/material/Input';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import { Search } from '@mui/icons-material';
import { MultiSelect } from './multi-select';
import { getTipoAtivos } from '@/pages/api/api.carteira';

const statusOptions: any = [];

const stockOptions: any = [];

export const MeusAtivosSearch = (props: any) => {
    const { onFiltersChange, ...other } = props;
    const queryRef: any = useRef(null);
    const [chips, setChips] = useState([]);
    const [categoryOptions, setOptions] = useState<any>([])

    useEffect(() => {
        getTipoAtivos().then(ativos => {
            setOptions(Object.values(ativos['TipoAtivo']).map((it: any) => ({
                //@ts-ignore
                label: it[Object.keys(it)],
                value: Object.keys(it)[0]
            })))
        })
    }, [])

    const handleChipsUpdate = useCallback(() => {
        const filters: any = {
            name: undefined,
            tipo: [],
            status: [],
            inStock: undefined
        };

        chips.forEach((chip: any) => {
            switch (chip.field) {
                case 'name':
                    // There will (or should) be only one chips with field "name"
                    // so we can set up it directly
                    filters.name = chip.value;
                    break;
                case 'tipo':
                    filters.tipo.push(chip.value);
                    break;
                case 'status':
                    filters.status.push(chip.value);
                    break;
                case 'inStock':
                    // The value can be "available" or "outOfStock" and we transform it to a boolean
                    filters.inStock = chip.value === 'available';
                    break;
                default:
                    break;
            }
        });

        onFiltersChange?.(filters);
    }, [chips, onFiltersChange]);

    useEffect(() => {
        handleChipsUpdate();
    }, [chips, handleChipsUpdate]);

    const handleChipDelete = useCallback((deletedChip: any) => {
        setChips((prevChips) => {
            return prevChips.filter((chip: any) => {
                // There can exist multiple chips for the same field.
                // Filter them by value.

                return !(deletedChip.field === chip.field && deletedChip.value === chip.value);
            });
        });
    }, []);

    const handleQueryChange = useCallback((event: any) => {
        event.preventDefault();

        const value = queryRef.current?.value || '';

        setChips((prevChips: any) => {
            const found = prevChips.find((chip: any) => chip.field === 'name');

            if (found && value) {
                return prevChips.map((chip: any) => {
                    if (chip.field === 'name') {
                        return {
                            ...chip,
                            value: queryRef.current?.value || ''
                        };
                    }

                    return chip;
                });
            }

            if (found && !value) {
                return prevChips.filter((chip: any) => chip.field !== 'name');
            }

            if (!found && value) {
                const chip = {
                    label: 'Name',
                    field: 'name',
                    value
                };

                return [...prevChips, chip];
            }

            return prevChips;
        });

        if (queryRef.current) {
            queryRef.current.value = '';
        }
    }, []);

    const handleCategoryChange = useCallback((values: any) => {
        setChips((prevChips: any) => {
            const valuesFound: any = [];

            // First cleanup the previous chips
            const newChips = prevChips.filter((chip: any) => {
                if (chip.field !== 'tipo') {
                    return true;
                }

                const found = values.includes(chip.value);

                if (found) {
                    valuesFound.push(chip.value);
                }

                return found;
            });

            // Nothing changed
            if (values.length === valuesFound.length) {
                return newChips;
            }

            values.forEach((value: any) => {
                if (!valuesFound.includes(value)) {
                    const option: any = categoryOptions.find((option: any) => option.value === value);

                    newChips.push({
                        label: 'Tipo',
                        field: 'tipo',
                        value,
                        displayValue: option.label
                    });
                }
            });

            return newChips;
        });
    }, [categoryOptions]);

    const handleStatusChange = useCallback((values: any) => {
        setChips((prevChips: any) => {
            const valuesFound: any = [];

            // First cleanup the previous chips
            const newChips = prevChips.filter((chip: any) => {
                if (chip.field !== 'status') {
                    return true;
                }

                const found = values.includes(chip.value);

                if (found) {
                    valuesFound.push(chip.value);
                }

                return found;
            });

            // Nothing changed
            if (values.length === valuesFound.length) {
                return newChips;
            }

            values.forEach((value: any) => {
                if (!valuesFound.includes(value)) {
                    const option: any = statusOptions.find((option: any) => option.value === value);

                    newChips.push({
                        label: 'Status',
                        field: 'status',
                        value,
                        displayValue: option.label
                    });
                }
            });

            return newChips;
        });
    }, []);

    const handleStockChange = useCallback((values: any) => {
        // Stock can only have one value, even if displayed as multi-select, so we select the first one.
        // This example allows you to select one value or "All", which is not included in the
        // rest of multi-selects.

        setChips((prevChips) => {
            // First cleanup the previous chips
            const newChips: any = prevChips.filter((chip: any) => chip.field !== 'inStock');
            const latestValue = values[values.length - 1];

            switch (latestValue) {
                case 'available':
                    newChips.push({
                        label: 'Stock',
                        field: 'inStock',
                        value: 'available',
                        displayValue: 'Available'
                    });
                    break;
                case 'outOfStock':
                    newChips.push({
                        label: 'Stock',
                        field: 'inStock',
                        value: 'outOfStock',
                        displayValue: 'Out of Stock'
                    });
                    break;
                default:
                    // Should be "all", so we do not add this filter
                    break;
            }

            return newChips;
        });
    }, []);

    // We memoize this part to prevent re-render issues
    const categoryValues = useMemo(() => chips
        .filter((chip: any) => chip.field === 'tipo')
        .map((chip: any) => chip.value), [chips]);

    const statusValues = useMemo(() => chips
        .filter((chip: any) => chip.field === 'status')
        .map((chip: any) => chip.value), [chips]);

    const stockValues = useMemo(() => {
        const values = chips
            .filter((chip: any) => chip.field === 'inStock')
            .map((chip: any) => chip.value);

        // Since we do not display the "all" as chip, we add it to the multi-select as a selected value
        if (values.length === 0) {
            values.unshift('all');
        }

        return values;
    }, [chips]);

    const showChips = chips.length > 0;

    return (
        <div {...other}>
            <Stack
                alignItems="center"
                component="form"
                direction="row"
                onSubmit={handleQueryChange}
                spacing={2}
                sx={{ p: 2 }}
            >
                <SvgIcon>
                    <Search />
                </SvgIcon>
                <Input
                    defaultValue=""
                    disableUnderline
                    fullWidth
                    inputProps={{ ref: queryRef }}
                    placeholder="Pesquisar"
                    sx={{ flexGrow: 1 }}
                />
            </Stack>
            <Divider />
            {showChips
                ? (
                    <Stack
                        alignItems="center"
                        direction="row"
                        flexWrap="wrap"
                        gap={1}
                        sx={{ p: 2 }}
                    >
                        {chips.map((chip: any, index) => (
                            <Chip
                                key={index}
                                label={(
                                    <Box
                                        sx={{
                                            alignItems: 'center',
                                            display: 'flex',
                                            '& span': {
                                                fontWeight: 600
                                            }
                                        }}
                                    >
                                        <>
                                            <span>
                                                {chip.label}
                                            </span>
                                            :
                                            {' '}
                                            {chip.displayValue || chip.value}
                                        </>
                                    </Box>
                                )}
                                onDelete={() => handleChipDelete(chip)}
                                variant="outlined"
                            />
                        ))}
                    </Stack>
                )
                : (
                    <Box sx={{ p: 2.5 }}>
                        <Typography
                            color="text.secondary"
                            variant="subtitle2"
                        >
                            No filters applied
                        </Typography>
                    </Box>
                )}
            <Divider />
            <Stack
                alignItems="center"
                direction="row"
                flexWrap="wrap"
                spacing={1}
                sx={{ p: 1 }}
            >
                <MultiSelect
                    label="Tipo"
                    onChange={handleCategoryChange}
                    options={categoryOptions}
                    value={categoryValues}
                />
                <MultiSelect
                    label="Status"
                    onChange={handleStatusChange}
                    options={statusOptions}
                    value={statusValues}
                />
                <MultiSelect
                    label="Stock"
                    onChange={handleStockChange}
                    options={stockOptions}
                    value={stockValues}
                />
            </Stack>
        </div>
    );
};
