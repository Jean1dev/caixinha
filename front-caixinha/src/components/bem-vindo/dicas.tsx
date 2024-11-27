import Slider from 'react-slick';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

const sliderSettings = {
  arrows: false,
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1
};

export const Dicas = (props: any) => {
  const { sx, tips } = props;

  return (
    <Slider {...sliderSettings}>
      {tips.map((tip: any, index: number) => (
        <Card key={index} sx={sx}>
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}
          >
            <Box sx={{ mb: 6 }}>
              <img src="/assets/next-tip.svg" />
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                '& .slick-slider': {
                  cursor: 'grab'
                },
                '& .slick-slider, & .slick-list, & .slick-track': {
                  height: '100%'
                },
                '& .slick-dots': {
                  top: -50,
                  bottom: 'unset',
                  left: -10,
                  textAlign: 'left'
                }
              }}
            >
              <div>
                <Typography variant="h6">
                  {tip.title}
                </Typography>
                <Typography
                  color="text.secondary"
                  sx={{ mt: 1 }}
                  variant="body1"
                >
                  {tip.content}
                </Typography>
                {
                  tip.link && (
                    <Typography
                      color="primary"
                      sx={{ mt: 2 }}
                      variant="body2"
                    >
                      <Link href={tip.link.href} target='_blank'>
                        {tip.link.label}
                      </Link>
                    </Typography>
                  )
                }
              </div>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Slider>
  );
};