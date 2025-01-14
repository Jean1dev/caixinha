import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { RouterLink } from './RouterLink';

const sections = [
  {
    title: 'Menu',
    items: [
      {
        title: 'HOME',
        path: '/'
      },
      {
        title: 'Documentation',
        external: true,
        path: '/'
      }
    ]
  },
  {
    title: 'Legal',
    items: [
      {
        title: 'Terms & Conditions',
        path: 'https://termo-de-uso-quem-me-segue.netlify.app'
      },
      {
        title: 'License',
        path: 'https://termo-de-uso-quem-me-segue.netlify.app'
      },
      {
        title: 'Contact',
        path: 'mailto:jeanlucafp@gmail.com'
      }
    ]
  },
  {
    title: 'Social',
    items: [
      {
        title: 'LinkedIn',
        path: 'https://www.linkedin.com/in/jeanluca-fernandes-969266126/'
      }
    ]
  }
];

export const Footer = (props: any) => (
  <Box
    sx={{
      backgroundColor: (theme) => theme.palette.mode === 'dark'
        ? 'neutral.800'
        : 'neutral.50',
      borderTopColor: 'divider',
      borderTopStyle: 'solid',
      borderTopWidth: 1,
      pb: 6,
      pt: {
        md: 15,
        xs: 6
      }
    }}
    {...props}>
    <Container maxWidth="lg">
      <Grid
        container
        spacing={3}
      >
        <Grid
          xs={12}
          sm={4}
          md={3}
          sx={{
            order: {
              xs: 4,
              md: 1
            }
          }}
        >
          <Stack spacing={1}>
            <Stack
              alignItems="center"
              direction="row"
              display="inline-flex"
              spacing={1}
              sx={{ textDecoration: 'none' }}
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  height: 24,
                  width: 24
                }}
              >
              </Box>
              <Box
                sx={{
                  color: 'text.primary',
                  fontFamily: '\'Plus Jakarta Sans\', sans-serif',
                  fontSize: 14,
                  fontWeight: 800,
                  letterSpacing: '0.3px',
                  lineHeight: 2.5,
                  '& span': {
                    color: 'primary.main'
                  }
                }}
              >
                Caixinha <span>APP</span>
              </Box>
            </Stack>
            <Typography
              color="text.secondary"
              variant="caption"
            >
              © {new Date().getFullYear()} Jeanluca FP Consultoria de TI
            </Typography>
          </Stack>
        </Grid>
        {sections.map((section, index) => (
          <Grid
            key={section.title}
            xs={12}
            sm={4}
            md={3}
            sx={{
              order: {
                md: index + 2,
                xs: index + 1
              }
            }}
          >
            <Typography
              color="text.secondary"
              variant="overline"
            >
              {section.title}
            </Typography>
            <Stack
              component="ul"
              spacing={1}
              sx={{
                listStyle: 'none',
                m: 0,
                p: 0
              }}
            >
              {section.items.map((item) => {
                const linkProps = item.path
                  ? item.external
                    ? {
                      component: 'a',
                      href: item.path,
                      target: '_blank'
                    }
                    : {
                      component: RouterLink,
                      href: item.path
                    }
                  : {};

                return (
                  <Stack
                    alignItems="center"
                    direction="row"
                    key={item.title}
                    spacing={2}
                  >
                    <Box
                      sx={{
                        backgroundColor: 'primary.main',
                        height: 2,
                        width: 12
                      }}
                    />
                    <Link
                      color="text.primary"
                      variant="subtitle2"
                      {...linkProps}>
                      {item.title}
                    </Link>
                  </Stack>
                );
              })}
            </Stack>
          </Grid>
        ))}
      </Grid>
      <Divider sx={{ my: 6 }} />
      <Typography
        color="text.secondary"
        variant="caption"
      >
        All Rights Reserved.
      </Typography>
    </Container>
  </Box>
);
