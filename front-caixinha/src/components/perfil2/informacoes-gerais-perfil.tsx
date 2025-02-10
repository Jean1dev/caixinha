import { alpha } from '@mui/system/colorManipulator';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { CameraAltOutlined, VerifiedUserSharp } from '@mui/icons-material';
import { useState, useEffect, useCallback } from 'react';
import { updatePerfil, uploadResource } from '@/pages/api/api.service';
import toast from 'react-hot-toast';
import { useUserAuth } from '@/hooks/useUserAuth';
import CenteredCircularProgress from '../CenteredCircularProgress';
import { useTranslation } from 'react-i18next';

export const InformacoesGeraisPerfil = () => {
    const { user, updateUser } = useUserAuth()
    const [loadingPhoto, setLoadingPhoto] = useState(false)
    const { t } = useTranslation();
    const [values, setValues] = useState<any | null>(null);

    const updateProfile = () => {
        updatePerfil({
            memberName: user?.name,
            email: user?.email,
            user: {
                phone: values.phone,
                photoUrl: user?.photoUrl,
                accounts: {
                    keyPix: values.pix
                }
            }
        }).then(() => {
            updateUser({
                name: values.firstName,
                email: values.email,
                phone: values.phone,
                pix: values.pix,
                photoUrl: values?.photoUrl
            })
            toast.success(t('perfil.atualizado'))
        }).catch(e => {
            toast.error(e.message)
        })
    }

    useEffect(() => {
        setValues({
            firstName: user?.name,
            email: user?.email,
            phone: user?.phone,
            pix: user?.pix,
            photoUrl: user?.photoUrl
        })
    }, [user])

    const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setValues((prevState: any) => ({
                ...prevState,
                [event.target.name]: event.target.value
            }));
        },
        []
    );

    const updatePhoto = () => {
        setLoadingPhoto(true)
        let input = document.createElement('input');
        input.type = 'file';

        input.addEventListener('change', function (event: any) {
            let arquivo = event.target.files[0];

            console.log('Arquivo selecionado:', arquivo);
            uploadResource(arquivo)
                .then((fileUrl: string) => {
                    //@ts-ignore
                    updateUser({
                        ...user,
                        photoUrl: fileUrl
                    })
                    toast.success(t('upload_sucesso'))
                })
                .catch(e => toast.error(e.message))
                .finally(() => setLoadingPhoto(false))
        });

        input.click()
    }

    return (
        <Stack
            spacing={4}>
            <Card>
                <CardContent>
                    <Grid
                        container
                        spacing={3}
                    >
                        <Grid
                            xs={12}
                            md={4}
                        >
                            <Typography variant="h6">
                                {t('perfil.detalhes_basicos')}
                            </Typography>
                        </Grid>
                        <Grid
                            xs={12}
                            md={8}
                        >
                            <Stack spacing={3}>
                                <Stack
                                    alignItems="center"
                                    direction="row"
                                    spacing={2}
                                >
                                    <Box
                                        sx={{
                                            borderColor: 'neutral.300',
                                            borderRadius: '50%',
                                            borderStyle: 'dashed',
                                            borderWidth: 1,
                                            p: '4px'
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                borderRadius: '50%',
                                                height: '100%',
                                                width: '100%',
                                                position: 'relative'
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    alignItems: 'center',
                                                    backgroundColor: (theme: any) => alpha(theme.palette.neutral[700], 0.5),
                                                    borderRadius: '50%',
                                                    color: 'common.white',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    height: '100%',
                                                    justifyContent: 'center',
                                                    left: 0,
                                                    opacity: 0,
                                                    position: 'absolute',
                                                    top: 0,
                                                    width: '100%',
                                                    zIndex: 1,
                                                    '&:hover': {
                                                        opacity: 1
                                                    }
                                                }}
                                            >
                                                {
                                                    loadingPhoto && <CenteredCircularProgress />
                                                }
                                                {
                                                    !loadingPhoto && (
                                                        <Stack
                                                            alignItems="center"
                                                            direction="row"
                                                            spacing={1}
                                                        >
                                                            <SvgIcon onClick={updatePhoto} color="inherit">
                                                                <CameraAltOutlined />
                                                            </SvgIcon>
                                                            <Typography
                                                                color="inherit"
                                                                variant="subtitle2"
                                                                sx={{ fontWeight: 700 }}
                                                            >
                                                                {t('selecionar')}
                                                            </Typography>
                                                        </Stack>
                                                    )
                                                }
                                            </Box>
                                            <Avatar
                                                src={user?.photoUrl}
                                                sx={{
                                                    height: 100,
                                                    width: 100
                                                }}
                                            >
                                                <SvgIcon>
                                                    <VerifiedUserSharp />
                                                </SvgIcon>
                                            </Avatar>
                                        </Box>
                                    </Box>
                                    <Button
                                        onClick={updatePhoto}
                                        color="inherit"
                                        size="small"
                                    >
                                        {t('alterar')}
                                    </Button>
                                </Stack>
                                <Stack
                                    alignItems="center"
                                    direction="row"
                                    spacing={2}
                                >
                                    <TextField
                                        label={t('nome')}
                                        name="firstName"
                                        disabled={true}
                                        onChange={handleChange}
                                        required
                                        value={values?.firstName}
                                        sx={{ flexGrow: 1 }}
                                    />
                                </Stack>

                                {/* <Stack
                                    alignItems="center"
                                    direction="row"
                                    spacing={2}
                                >
                                    <TextField
                                        fullWidth
                                        label="Ultimo nome"
                                        name="lastName"
                                        onChange={handleChange}
                                        required
                                        value={values.lastName}
                                        sx={{ flexGrow: 1 }}
                                    />
                                </Stack> */}

                                <Stack
                                    alignItems="center"
                                    direction="row"
                                    spacing={2}
                                >
                                    <TextField
                                        fullWidth
                                        label={t('email')}
                                        name="email"
                                        disabled
                                        onChange={handleChange}
                                        required
                                        value={values?.email}
                                        sx={{
                                            flexGrow: 1,
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderStyle: 'dashed'
                                            }
                                        }}
                                    />
                                </Stack>

                                <Stack
                                    alignItems="center"
                                    direction="row"
                                    spacing={2}
                                >
                                    <TextField
                                        fullWidth
                                        label={t('telefone')}
                                        name="phone"
                                        onChange={handleChange}
                                        type="number"
                                        value={values?.phone}
                                        sx={{ flexGrow: 1 }}
                                    />
                                </Stack>

                                <Stack
                                    alignItems="center"
                                    direction="row"
                                    spacing={2}
                                >
                                    <TextField
                                        fullWidth
                                        label="pix"
                                        name="pix"
                                        onChange={handleChange}
                                        required
                                        value={values?.pix}
                                        sx={{ flexGrow: 1 }}
                                    />
                                </Stack>

                            </Stack>
                            <Grid
                                xs={12}
                                md={8}
                            >
                                <Stack
                                    alignItems="flex-start"
                                    spacing={3}
                                >
                                    <Typography variant="subtitle1">

                                    </Typography>
                                    <Button
                                        onClick={updateProfile}
                                        color="primary"
                                        variant="outlined"
                                    >
                                        {t('salvar')}
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <Grid
                        container
                        spacing={3}
                    >
                        <Grid
                            xs={12}
                            md={4}
                        >
                            <Typography variant="h6">
                                {t('perfil.configuracoes')}
                            </Typography>
                        </Grid>
                        <Grid
                            xs={12}
                            sm={12}
                            md={8}
                        >
                            <Stack
                                divider={<Divider />}
                                spacing={3}
                            >
                                <Stack
                                    alignItems="flex-start"
                                    direction="row"
                                    justifyContent="space-between"
                                    spacing={3}
                                >
                                    <Stack spacing={1}>
                                        <Typography variant="subtitle1">
                                            {t('perfil.publicar')}
                                        </Typography>
                                        <Typography
                                            color="text.secondary"
                                            variant="body2"
                                        >
                                            {t('perfil.publicar_descricao')}
                                        </Typography>
                                    </Stack>
                                    <Switch />
                                </Stack>
                                <Stack
                                    alignItems="flex-start"
                                    direction="row"
                                    justifyContent="space-between"
                                    spacing={3}
                                >
                                    <Stack spacing={1}>
                                        <Typography variant="subtitle1">
                                            {t('perfil.permitir_amigos')}
                                        </Typography>
                                        <Typography
                                            color="text.secondary"
                                            variant="body2"
                                        >
                                            {t('perfil.permitir_amigos_descricao')}
                                        </Typography>
                                    </Stack>
                                    <Switch defaultChecked />
                                </Stack>
                            </Stack>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <Grid
                        container
                        spacing={3}
                    >
                        <Grid
                            xs={12}
                            md={4}
                        >
                            <Typography variant="h6">
                                {t('perfil.deletar_conta')}
                            </Typography>
                        </Grid>
                        <Grid
                            xs={12}
                            md={8}
                        >
                            <Stack
                                alignItems="flex-start"
                                spacing={3}
                            >
                                <Typography variant="subtitle1">
                                    {t('perfil.deletar_conta_descricao')}
                                </Typography>
                                <Button
                                    color="error"
                                    variant="outlined"
                                >
                                    {t('perfil.deletar_conta')}
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Stack>
    );
};
