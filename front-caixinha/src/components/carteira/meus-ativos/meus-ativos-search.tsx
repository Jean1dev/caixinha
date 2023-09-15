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

interface ChipType {
    label: string,
    field: string,
    value: string,
    displayValue: string,
}

export const MeusAtivosSearch = (props: any) => {
    const { onFiltersChange, carteiras, ...other } = props;
    const queryRef: any = useRef(null);
    const [chips, setChips] = useState<ChipType[]>([]);
    const [categoryOptions, setOptions] = useState<any>([])
    const [carteiraOptions, setCarteiraOptions] = useState<any>([])
    const [searchText, setSearchText] = useState('')

    useEffect(() => {
        getTipoAtivos().then(ativos => {
            setOptions(Object.values(ativos['TipoAtivo']).map((it: any) => ({
                //@ts-ignore
                label: it[Object.keys(it)],
                value: Object.keys(it)[0]
            })))
        })
    }, [])

    const handleFiltersInputsChange = useCallback((search: any = undefined) => {
        const filters: any = {
            search,
            tipo: [],
            carteira: [],
        };

        setSearchText(search || '')

        chips.forEach((chip: ChipType) => {
            switch (chip.field) {
                case 'tipo':
                    filters.tipo.push(chip.value);
                    break;
                case 'carteira':
                    filters.carteira.push(chip.value);
                    break;
                default:
                    break;
            }
        });

        onFiltersChange?.(filters);
    }, [chips, onFiltersChange]);

    useEffect(() => {
        handleFiltersInputsChange();
    }, [chips, handleFiltersInputsChange]);

    const handleChipDelete = useCallback((deletedChip: ChipType) => {
        setChips((prevChips) => {
            return prevChips.filter((chip: ChipType) => {
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
            const found = prevChips.find((chip: ChipType) => chip.field === 'name');

            if (found && value) {
                return prevChips.map((chip: ChipType) => {
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
                return prevChips.filter((chip: ChipType) => chip.field !== 'name');
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
            const newChips = prevChips.filter((chip: ChipType) => {
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

            values.forEach((value: ChipType) => {
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

    const handleCarteiraChange = useCallback((values: any) => {
        setChips((prevChips: any) => {
            const valuesFound: any = [];
            const newChips = prevChips.filter((chip: ChipType) => {
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

            values.forEach((value: ChipType) => {
                if (!valuesFound.includes(value)) {
                    const option: any = carteiraOptions.find((option: any) => option.value === value);

                    newChips.push({
                        label: 'Carteira',
                        field: 'carteira',
                        value,
                        displayValue: option?.label
                    });
                }
            });

            return newChips;
        });
    }, [carteiraOptions]);

    useEffect(() => {
        setCarteiraOptions(carteiras.map((carteira: any) => ({
            label: carteira.nome,
            value: carteira.id
        })))

        if (carteiras.length > 0) {
            setChips([
                {
                    label: 'Carteira',
                    field: 'carteira',
                    value: carteiras[0]['id'],
                    displayValue: carteiras[0]['nome']
                }
            ])

        }
    }, [carteiras])

    // We memoize this part to prevent re-render issues
    const categoryValues = useMemo(() => chips
        .filter((chip: ChipType) => chip.field === 'tipo')
        .map((chip: ChipType) => chip.value), [chips]);

    const carteiraValues = useMemo(() => chips
        .filter((chip: ChipType) => chip.field === 'carteira')
        .map((chip: ChipType) => chip.value), [chips]);

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
                    disableUnderline
                    value={searchText}
                    fullWidth
                    onChange={(e) => handleFiltersInputsChange(e.target.value)}
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
                    label="Carteira"
                    onChange={handleCarteiraChange}
                    options={carteiraOptions}
                    value={carteiraValues}
                />
            </Stack>
        </div>
    );
};
