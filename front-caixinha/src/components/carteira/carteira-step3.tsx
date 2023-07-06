import { TextField, Box, Button } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';

export default function CarteiraStep1(props: any) {
    const { carteira, setCarteira, criarCarteira } = props

    return (
        <Box sx={{ p: 3 }}>
            <form onSubmit={(event) => {
                event.preventDefault()
                criarCarteira()
            }}>
                <Grid
                    container
                    spacing={3}
                >
                    <Grid xs={12} md={6}>
                        <TextField
                            fullWidth
                            name="ativo"
                            label="Ativo"
                            value={carteira?.ativo}
                            defaultValue={''}
                            onChange={(e) => { setCarteira({ ...carteira, ativo: e.target.value }) }}
                        />
                    </Grid>
                    <Grid xs={12} md={6}/>
                    
                    <Grid
                        xs={12}
                        md={6}
                    >
                        <TextField
                            fullWidth
                            name="quantidade"
                            label="quantidade"
                            value={carteira?.quantidade}
                            defaultValue={1}
                            type="number"
                            onChange={(e) => { setCarteira({ ...carteira, quantidade: e.target.value }) }}
                        />
                    </Grid>
                    <Grid
                        xs={12}
                        md={6}
                    >
                        <TextField
                            fullWidth
                            name="nota"
                            label="nota"
                            value={carteira?.nota}
                            defaultValue={0}
                            type="number"
                            onChange={(e) => { setCarteira({ ...carteira, nota: e.target.value }) }}
                        />
                    </Grid>


                </Grid>
                <Box sx={{ mt: 2 }}>
                    <Button
                        type="submit"
                        variant="contained"
                    >
                        Criar carteira
                    </Button>
                </Box>
            </form>
        </Box>
    )
}