import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Typography from '@mui/material/Typography'

interface Props {
  open: boolean
  nomeAtivo: string
  onConfirm: () => void
  onCancel: () => void
}

export function AtivoDeleteConfirm({ open, nomeAtivo, onConfirm, onCancel }: Props) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>Remover ativo</DialogTitle>
      <DialogContent>
        <Typography variant="body2">
          Tem certeza que deseja remover o ativo{' '}
          <strong>{nomeAtivo}</strong>? Esta ação não pode ser desfeita.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="inherit">Cancelar</Button>
        <Button onClick={onConfirm} color="error" variant="contained">Remover</Button>
      </DialogActions>
    </Dialog>
  )
}
