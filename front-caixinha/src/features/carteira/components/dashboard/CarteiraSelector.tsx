import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import { AddCircleOutline, LowPriority, TrendingUp } from '@mui/icons-material'
import NextLink from 'next/link'
import type { Carteira } from '../../api/carteira.types'

interface Props {
  carteiras: Carteira[]
  selectedId: string | null
  onSelect: (id: string) => void
  onConsolidar: () => void
}

export function CarteiraSelector({ carteiras, selectedId, onSelect, onConsolidar }: Props) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title="Minhas Carteiras"
        titleTypographyProps={{ variant: 'subtitle1', fontWeight: 700 }}
        action={
          <Tooltip title="Consolidar todas">
            <IconButton size="small" onClick={onConsolidar}>
              <SvgIcon fontSize="small"><LowPriority /></SvgIcon>
            </IconButton>
          </Tooltip>
        }
      />
      <Divider />
      <List disablePadding sx={{ maxHeight: 320, overflowY: 'auto' }}>
        {carteiras.map((carteira) => {
          const isSelected = carteira.id === selectedId
          return (
            <ListItemButton
              key={carteira.id}
              selected={isSelected}
              onClick={() => onSelect(carteira.id)}
              divider
              sx={{
                '&.Mui-selected': {
                  borderLeft: '3px solid',
                  borderColor: 'primary.main',
                  backgroundColor: 'action.selected',
                },
              }}
            >
              <ListItemAvatar>
                <Badge
                  badgeContent={carteira.quantidadeAtivos}
                  color="primary"
                  max={99}
                  sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem' } }}
                >
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      backgroundColor: isSelected ? 'primary.main' : 'action.hover',
                      color: isSelected ? 'primary.contrastText' : 'text.secondary',
                    }}
                  >
                    <SvgIcon fontSize="small"><TrendingUp /></SvgIcon>
                  </Avatar>
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="subtitle2" noWrap>
                    {carteira.nome}
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    {carteira.quantidadeAtivos} ativo{carteira.quantidadeAtivos !== 1 ? 's' : ''}
                  </Typography>
                }
              />
            </ListItemButton>
          )
        })}
      </List>
      <Divider />
      <CardContent sx={{ py: 1.5 }}>
        <Button
          component={NextLink}
          href="/carteira/nova-carteira"
          variant="outlined"
          size="small"
          fullWidth
          startIcon={<SvgIcon fontSize="small"><AddCircleOutline /></SvgIcon>}
        >
          Nova carteira
        </Button>
      </CardContent>
    </Card>
  )
}
