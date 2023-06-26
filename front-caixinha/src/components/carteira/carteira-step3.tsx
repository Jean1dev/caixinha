import { Grid, FormControl, TextField, Divider, Box, Button } from "@mui/material";

export default function CarteiraStep1(props: any) {
    const { carteira, setCarteira, criarCarteira } = props

    return (
        <form onSubmit={() => { }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <TextField
                            required
                            name="ativo"
                            label="Ativo"
                            value={carteira?.ativo}
                            defaultValue={''}
                            onChange={(e) => { setCarteira({ ...carteira, ativo: e.target.value }) }}
                            inputProps={{ "data-testid": "name" }}
                        />

                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <FormControl>
                        <TextField
                            required
                            name="quantidade"
                            label="quantidade"
                            value={carteira?.quantidade}
                            defaultValue={1}
                            type="number"
                            onChange={(e) => { setCarteira({ ...carteira, quantidade: e.target.value }) }}
                            inputProps={{ "data-testid": "name" }}
                        />
                    </FormControl>
                    <FormControl>
                        <TextField
                            required
                            name="nota"
                            label="nota"
                            value={carteira?.nota}
                            defaultValue={0}
                            type="number"
                            onChange={(e) => { setCarteira({ ...carteira, nota: e.target.value }) }}
                            inputProps={{ "data-testid": "name" }}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <Box display="flex" gap={2}>

                        <Button
                            onClick={criarCarteira}
                            variant="contained"
                            color="primary"
                        >
                            Criar carteira
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </form>
    )
}