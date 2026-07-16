import Layout from "@/components/Layout";
import { Onboarding } from "@/components/bem-vindo/onboarding";
import CenteredCircularProgress from "@/components/CenteredCircularProgress";
import { useSession } from "next-auth/react";
import { BannerNovidades } from "@/components/bem-vindo/banner-novidades";
import { Dicas } from "@/components/bem-vindo/dicas";
import { AtalhoEmprestimo } from "@/components/bem-vindo/atalho-emprestimo";
import { useSettings } from "@/hooks/useSettings";
import { Box, Container, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { Seo } from "@/components/Seo";
import { getAleatorio } from "@/utils/utils";
import { useUltimoEmprestimoPendente } from "@/features/caixinha/hooks/useUltimoEmprestimoPendente";
import { useUserAuth } from "@/hooks/useUserAuth";
import { Footer } from "@/components/footer";
import { useTranslation } from "react-i18next";
import SavingsIcon from '@mui/icons-material/Savings';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useCaixinhaSelect } from '@/hooks/useCaixinhaSelect';
import { SvgIconComponent } from '@mui/icons-material';

const GRADIENTS = [
  'linear-gradient(135deg,#5475B8,#7691C6)',
  'linear-gradient(135deg,#9176C6,#C7B9E1)',
  'linear-gradient(135deg,#7A86B2,#A2A9CD)',
  'linear-gradient(135deg,#6B82A3,#B3B1D4)',
  'linear-gradient(135deg,#868DB6,#C8C4E5)',
  'linear-gradient(135deg,#8988B8,#AFAEE1)',
]

const corAleatoriaCombinada = () => getAleatorio(GRADIENTS)

interface GradientCardProps {
  title: string
  description: string
  action: () => void
  Icon: SvgIconComponent
}

const GradientCard = ({ title, description, action, Icon }: GradientCardProps) => {
  const grad = corAleatoriaCombinada()
  return (
    <Box
      onClick={action}
      sx={{
        background: grad,
        borderRadius: 4,
        boxShadow: '0 6px 30px rgba(0,0,0,.12)',
        px: 3,
        py: 3.5,
        minHeight: 140,
        color: '#fff',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        transition: 'transform 0.2s, box-shadow 0.2s, opacity 0.2s',
        '&:hover': {
          transform: 'translateY(-4px) scale(1.03)',
          boxShadow: '0 12px 40px rgba(0,0,0,.18)',
          opacity: 0.96,
        },
      }}
    >
      <Icon sx={{ color: '#fff', fontSize: 36 }} />
      <Typography
        variant="h5"
        fontWeight={700}
        color="white"
        sx={{ mt: 1.5 }}
      >
        {title}
      </Typography>
      <Typography variant="body2" color="white" sx={{ mt: 0.5, opacity: 0.92 }}>
        {description}
      </Typography>
    </Box>
  )
}

const Page = () => {
  const router = useRouter()
  const settings = useSettings()
  const { t } = useTranslation()

  const { user } = useUserAuth()
  const { resultado: ultimoEmprestimoAtalho } = useUltimoEmprestimoPendente()
  const { caixinha } = useCaixinhaSelect()

  const quickCards: GradientCardProps[] = [
    ...(caixinha?.id ? [{
      title: 'Minha caixinha',
      description: 'Resumo, extrato e atalhos',
      action: () => router.push(`/caixinha/${caixinha.id}`),
      Icon: DashboardIcon,
    }] : []),
    {
      title: 'Caixinhas',
      description: t('listar_caixinha_disponiveis'),
      action: () => router.push('/caixinhas-disponiveis'),
      Icon: SavingsIcon,
    },
    {
      title: 'Depositar',
      description: t('depositar'),
      action: () => router.push('/deposito'),
      Icon: AccountBalanceWalletIcon,
    },
    {
      title: 'Pedir empréstimo',
      description: t('emprestimo.solicitar_emprestimo'),
      action: () => router.push('/emprestimo'),
      Icon: AddCircleOutlineIcon,
    },
  ]

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, minHeight: '100vh', py: 8 }}
    >
      <Container maxWidth={settings.stretch ? false : 'xl'}>
        <Typography
          variant="h3"
          fontWeight={700}
          align="center"
          sx={{ mb: 4 }}
        >
          Bem-vindo à Caixinha!
        </Typography>

        {/* Banner + Dicas — proporção 1.4fr / 1fr
            minmax(0,Xfr) é necessário para evitar overflow do react-slick */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.4fr) minmax(0, 1fr)' },
            gap: 3,
            alignItems: 'stretch',
            mb: 3,
            '& > *': { minWidth: 0 },
          }}
        >
          <BannerNovidades />
          {ultimoEmprestimoAtalho?.exists ? (
            <AtalhoEmprestimo emprestimo={ultimoEmprestimoAtalho.data} />
          ) : (
            <Dicas
              sx={{ height: '100%' }}
              tips={[
                {
                  title: t('dicas.0.title'),
                  content: t('dicas.0.content'),
                  link: { href: '/token-market', label: t('dicas.0.link_label') },
                },
                {
                  title: t('dicas.1.title'),
                  content: t('dicas.1.content'),
                },
              ]}
            />
          )}
        </Box>

        {/* Atalhos rápidos — grid auto-fit */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 3,
          }}
        >
          {quickCards.map((c) => (
            <GradientCard key={c.title} {...c} />
          ))}
        </Box>
      </Container>
    </Box>
  )
}

export default function Home() {
  const { status } = useSession()

  if (status === 'loading') {
    return <CenteredCircularProgress />
  }

  if (status === 'unauthenticated') {
    return <Onboarding />
  }

  return (
    <Layout>
      <>
        <Seo title="Home" />
        <Page />
        <Footer />
      </>
    </Layout>
  )
}