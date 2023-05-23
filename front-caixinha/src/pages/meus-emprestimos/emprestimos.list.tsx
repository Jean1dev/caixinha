import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import { Collapse, ListItemButton, ListItemIcon } from '@mui/material';
import { LoansForApprove } from '@/types/types';
import { ExpandLess, ExpandMore, DetailsOutlined, StarBorder } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import CenteredCircularProgress from '@/components/CenteredCircularProgress';
import { useRouter } from 'next/router';

export default function EmprestimoList({ loading, data = [] }: any) {
  const [listItems, setListItems] = useState([]);
  const router = useRouter()

  const handleClick = (item: any) => {
    const remap = listItems.map((it: any) => {
      if (it.uid === item.uid) {
        return {
          ...it,
          open: !it.open
        }
      }

      return it
    })
    //@ts-ignore
    setListItems(remap)
  };

  const goToDetalhesEmprestimo = (item: any) => {
    router.push({
      pathname: 'detalhes-emprestimo',
      query: item
    })
  }

  useEffect(() => {
    if (loading)
      return

    setListItems(data.map((it: any) => ({
      ...it,
      open: false
    })))
  }, [data])

  if (loading)
    return <CenteredCircularProgress />

  return (
    <List sx={{ width: '100%', maxWidth: '100%', bgcolor: 'background.paper' }}>
      {listItems.map((value: LoansForApprove, index: any) => (
        <>
          <ListItemButton onClick={() => handleClick(value)}>
            <ListItemIcon>
            </ListItemIcon>
            <ListItemText> Emprestimo do {value.memberName} - {value.description}</ListItemText>
            {value.open ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={value.open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <StarBorder />
                </ListItemIcon>
                <ListItemText>Valor R${value.valueRequested}</ListItemText>
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <StarBorder />
                </ListItemIcon>
                <ListItemText>Juros %{value.interest}</ListItemText>
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <StarBorder />
                </ListItemIcon>
                <ListItemText>Aprovações até o momento {value.approvals}</ListItemText>
              </ListItemButton>
              {
                value.totalValue && (
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <StarBorder />
                    </ListItemIcon>
                    <ListItemText>Valor que falta pagar R${value.remainingAmount}</ListItemText>
                  </ListItemButton>
                )
              }
              <ListItemButton sx={{ pl: 4 }} onClick={() => goToDetalhesEmprestimo(value)}>
                <ListItemIcon>
                  <DetailsOutlined />
                </ListItemIcon>
                <ListItemText>Clique para fazer a gestão e conferir os detalhes</ListItemText>
              </ListItemButton>
            </List>
          </Collapse>
        </>
      ))}
    </List>
  );
}