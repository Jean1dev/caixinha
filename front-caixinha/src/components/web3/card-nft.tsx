import { LinkRounded, VerifiedUser } from "@mui/icons-material"
import {
    Link,
    Card,
    Box,
    Tooltip,
    IconButton,
    SvgIcon,
    Typography,
    Rating,
    Divider,
    CardMedia,
    Chip,
    Avatar
} from "@mui/material"
import { useRouter } from "next/router"

const CardNFt = ({ nft }: { nft: any }) => {
    const router = useRouter()
    return (
        <Card
            sx={{
                height: '100%',
                p: 2
            }}
            onClick={() => router.push(`/web3/nft-market/${nft.id}`)}
        >

            <Box
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    pl: 2,
                    pr: 3,
                    py: 2
                }}
            >
                <Box
                    sx={{
                        alignItems: 'center',
                        display: 'flex'
                    }}
                >
                    <Tooltip title="Unlike">
                        <IconButton>
                            <SvgIcon
                                sx={{
                                    color: 'error.main',
                                    '& path': {
                                        fill: (theme) => theme.palette.error.main,
                                        fillOpacity: 1
                                    }
                                }}
                            >
                                <LinkRounded />
                            </SvgIcon>
                        </IconButton>
                    </Tooltip>
                    <Typography
                        color="text.secondary"
                        variant="subtitle2"
                    >
                        2
                    </Typography>
                </Box>
                <Box
                    sx={{
                        alignItems: 'center',
                        display: 'flex',
                        ml: 2
                    }}
                >
                    <SvgIcon>
                        <VerifiedUser />
                    </SvgIcon>
                    <Typography
                        color="text.secondary"
                        sx={{ ml: 1 }}
                        variant="subtitle2"
                    >
                        12
                    </Typography>
                </Box>
                <Box sx={{ flexGrow: 1 }} />
                <Rating
                    readOnly
                    size="small"
                    value={4}
                />
            </Box>

            <Divider />
            <Box
                sx={{
                    pt: 'calc(100% * 4 / 4)',
                    position: 'relative'
                }}
            >
                <CardMedia
                    image={nft.img}
                    sx={{
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        width: '100%'
                    }}
                />
            </Box>
            <Box sx={{ mt: 2 }}>
                <div>
                    <Chip
                        label="Categoria"
                        variant="outlined"
                    />
                </div>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        my: 2
                    }}
                >
                    <Avatar src={nft?.author?.avatar} />
                    <Box sx={{ ml: 2 }}>
                        <Typography variant="subtitle2">
                            {nft.creator}
                        </Typography>
                        <Typography
                            color="text.secondary"
                            variant="caption"
                        >
                            {`$data`}
                        </Typography>
                    </Box>
                </Box>
                <Link
                    color="text.primary"
                    variant="h6"
                >
                    Preco {nft.price}
                </Link>
                <Typography
                    color="text.secondary"
                    sx={{
                        height: 72,
                        mt: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 2
                    }}
                    variant="body1"
                >
                    {nft.shortDescription || 'Sem descricao adicionada'}
                </Typography>
            </Box>
        </Card>
    )
}

export default CardNFt