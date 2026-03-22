import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Input from '@mui/material/Input'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import { Search } from '@mui/icons-material'
import { useTipoAtivos } from '../../hooks/useTipoAtivos'
import type { Carteira, AtivosFilter } from '../../api/carteira.types'

interface Props {
  carteiras: Carteira[]
  onFiltersChange: (filter: Partial<AtivosFilter>) => void
}

export function AtivosFilters({ carteiras, onFiltersChange }: Props) {
  const { tipoAtivos } = useTipoAtivos()
  const [search, setSearch] = useState('')
  const [tiposSelecionados, setTiposSelecionados] = useState<string[]>([])
  const [carteirasSelecionadas, setCarteirasSelecionadas] = useState<string[]>(
    carteiras.length > 0 ? [carteiras[0].id] : []
  )

  useEffect(() => {
    if (carteiras.length > 0 && carteirasSelecionadas.length === 0) {
      setCarteirasSelecionadas([carteiras[0].id])
    }
  }, [carteiras])

  const triggerChange = useCallback((
    carteirasIds: string[],
    tipos: string[],
    terms: string
  ) => {
    onFiltersChange({
      carteiras: carteirasIds,
      tipos: tipos.length > 0 ? tipos : null,
      terms: terms || null,
      page: 0,
    })
  }, [onFiltersChange])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)
    triggerChange(carteirasSelecionadas, tiposSelecionados, value)
  }, [carteirasSelecionadas, tiposSelecionados, triggerChange])

  const handleTiposChange = useCallback((values: string[]) => {
    setTiposSelecionados(values)
    triggerChange(carteirasSelecionadas, values, search)
  }, [carteirasSelecionadas, search, triggerChange])

  const handleCarteirasChange = useCallback((values: string[]) => {
    setCarteirasSelecionadas(values)
    triggerChange(values, tiposSelecionados, search)
  }, [tiposSelecionados, search, triggerChange])

  const removeTipo = (value: string) => {
    const next = tiposSelecionados.filter((t) => t !== value)
    handleTiposChange(next)
  }

  const removeCarteira = (id: string) => {
    const next = carteirasSelecionadas.filter((c) => c !== id)
    handleCarteirasChange(next)
  }

  const tipoLabel = (value: string) =>
    tipoAtivos.find((t) => t.value === value)?.label ?? value

  const carteiraLabel = (id: string) =>
    carteiras.find((c) => c.id === id)?.nome ?? id

  const hasChips = tiposSelecionados.length > 0 || carteirasSelecionadas.length > 0

  return (
    <Box>
      {/* Search bar */}
      <Stack
        alignItems="center"
        direction="row"
        spacing={2}
        sx={{ px: 2, py: 1.5 }}
      >
        <SvgIcon color="action" fontSize="small">
          <Search />
        </SvgIcon>
        <Input
          disableUnderline
          fullWidth
          value={search}
          onChange={handleSearchChange}
          placeholder="Buscar por ticker ou nome..."
          sx={{ flexGrow: 1 }}
        />
      </Stack>
      <Divider />

      {/* Chips ativos */}
      {hasChips && (
        <>
          <Stack
            direction="row"
            flexWrap="wrap"
            gap={1}
            sx={{ px: 2, py: 1.5 }}
          >
            {carteirasSelecionadas.map((id) => (
              <Chip
                key={id}
                size="small"
                label={<><strong>Carteira:</strong> {carteiraLabel(id)}</>}
                onDelete={() => removeCarteira(id)}
                variant="outlined"
                color="primary"
              />
            ))}
            {tiposSelecionados.map((value) => (
              <Chip
                key={value}
                size="small"
                label={<><strong>Tipo:</strong> {tipoLabel(value)}</>}
                onDelete={() => removeTipo(value)}
                variant="outlined"
              />
            ))}
          </Stack>
          <Divider />
        </>
      )}

      {/* Selects */}
      <Stack
        direction="row"
        flexWrap="wrap"
        gap={1}
        sx={{ px: 2, py: 1 }}
      >
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Tipo de ativo</InputLabel>
          <Select
            multiple
            value={tiposSelecionados}
            onChange={(e) => handleTiposChange(e.target.value as string[])}
            input={<OutlinedInput label="Tipo de ativo" />}
            renderValue={(selected) => `${selected.length} selecionado${selected.length !== 1 ? 's' : ''}`}
          >
            {tipoAtivos.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Carteira</InputLabel>
          <Select
            multiple
            value={carteirasSelecionadas}
            onChange={(e) => handleCarteirasChange(e.target.value as string[])}
            input={<OutlinedInput label="Carteira" />}
            renderValue={(selected) => `${selected.length} selecionada${selected.length !== 1 ? 's' : ''}`}
          >
            {carteiras.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Box>
  )
}
