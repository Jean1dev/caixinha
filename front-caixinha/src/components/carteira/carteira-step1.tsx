import { Grid, FormControl, TextField } from "@mui/material";

export default function CarteiraStep1(props: any) {
    const { carteira, setCarteira } = props

    return (
        <form onSubmit={() => { }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <TextField
                            required
                            name="carteira"
                            label="nome"
                            value={carteira?.nome}
                            defaultValue={''}
                            onChange={(e) => { setCarteira({ ...carteira, nome: e.target.value }) }}
                            inputProps={{ "data-testid": "name" }}
                        />
                    </FormControl>
                </Grid>
            </Grid>
        </form>
    )
}