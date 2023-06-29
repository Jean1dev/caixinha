import { useSettings } from "@/hooks/useSettings";
import Typography from "@mui/material/Typography";

export default function DisplayValorMonetario(props: any) {
    const { children, ...rest }: { children: React.ReactNode, rest: any } = props
    const { showValoresMonetarios } = useSettings()

    return (
        <Typography {...rest}>
            {showValoresMonetarios && (
                <>
                    R${children}
                </>
            )}
            {
                !showValoresMonetarios && (
                    <>
                        R$**,**
                    </>
                )
            }
        </Typography>
    )
}