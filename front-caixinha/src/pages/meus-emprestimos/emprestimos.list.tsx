import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CommentIcon from '@mui/icons-material/Comment';
import IconButton from '@mui/material/IconButton';
import { CircularProgress } from '@mui/material';
import { LoansForApprove } from '@/types/types';

export default function EmprestimoList({ loading, data = [] }: any) {

    if (loading)
        return <CircularProgress disableShrink />

  return (
    <List sx={{ width: '100%', maxWidth: '100%', bgcolor: 'background.paper' }}>
      {data.map((value: LoansForApprove, index: any) => (
        <ListItem
          key={index}
          disableGutters
          secondaryAction={
            <IconButton aria-label="comment">
              <CommentIcon />
            </IconButton>
          }
        >
          <ListItemText primary={`Emprestimo do  ${value.memberName}- ${value.description}`} />
        </ListItem>
      ))}
    </List>
  );
}