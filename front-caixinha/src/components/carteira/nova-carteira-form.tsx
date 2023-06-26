import { ArrowLeft, ArrowRight } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import CarteiraStep1 from './carteira-step1';
import { useCallback, useState } from 'react';
import CarteiraStep3 from './carteira-step3';
import { useRouter } from 'next/router';

export const NOvaCarteiraForm = (props: any) => {
    const { chapter, setActiveChapter } = props;
    const [carteira, setCarteira] = useState<any>({})
    const router = useRouter()

    const criarCarteira = useCallback(() => {
        alert('wopa criando')
        router.push('/sucesso')
    }, [carteira])

    const getComponent = () => {
        if (chapter.step == 1) {
            return <CarteiraStep1 carteira={carteira} setCarteira={setCarteira}/>
        }

        if (chapter.step == 3) {
            return <CarteiraStep3 carteira={carteira} setCarteira={setCarteira} criarCarteira={criarCarteira}/>
        }
    }

    const changeChapter = (up = false) => {
        if (up) {
            if (chapter.step == 3) {
                return criarCarteira()
            }

            setActiveChapter((chapter.step - 1) + 1)
        } else {
            if (chapter.step == 1) {
                return
            }

            setActiveChapter((chapter.step - 1) - 1)
        }
    }

    return (
        <Box
            sx={{
                position: 'relative',
                pb: 6
            }}
        >
            <Card>
                <CardHeader
                    title={chapter.title}
                    subheader={chapter.description}
                />
                <Tabs
                    value="lesson"
                    sx={{ px: 3 }}
                >
                    <Tab
                        label=""
                        value="lesson"
                    />
                </Tabs>
                <Divider />
                <CardContent>
                    {getComponent()}
                </CardContent>
            </Card>
            <Box
                sx={{
                    bottom: 20,
                    display: 'flex',
                    justifyContent: 'center',
                    left: 0,
                    position: 'absolute',
                    right: 0,
                    zIndex: 1
                }}
            >
                <Card elevation={16}>
                    <Stack
                        alignItems="center"
                        direction="row"
                        spacing={3}
                        sx={{ p: 1 }}
                    >
                        <Button
                            onClick={() => changeChapter()}
                            color="inherit"
                            size="small"
                            startIcon={(
                                <SvgIcon>
                                    <ArrowLeft />
                                </SvgIcon>
                            )}
                        >
                            Anterior
                        </Button>
                        <Typography
                            color="text.secondary"
                            variant="subtitle2"
                        >
                            {chapter.step}/3
                        </Typography>
                        <Button
                            onClick={() => changeChapter(true)}
                            color="inherit"
                            size="small"
                            startIcon={(
                                <SvgIcon>
                                    <ArrowRight />
                                </SvgIcon>
                            )}
                        >
                            Proximo
                        </Button>
                    </Stack>
                </Card>
            </Box>
        </Box>
    );
};
