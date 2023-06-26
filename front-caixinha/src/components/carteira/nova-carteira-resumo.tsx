import { Check, LockClock } from '@mui/icons-material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

const StepIcon = (props: any) => {
    const { active, completed, icon } = props;

    const highlight = active || completed;

    return (
        <Avatar
            sx={{
                height: 24,
                width: 24,
                ...(highlight
                    ? {
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText'
                    }
                    : {
                        backgroundColor: (theme) => theme.palette.mode === 'dark'
                            ? 'neutral.700'
                            : 'neutral.400',
                        color: 'common.white'
                    })
            }}
            variant="circular"
        >
            {completed
                ? (
                    <SvgIcon fontSize="small">
                        <Check />
                    </SvgIcon>
                )
                : icon}
        </Avatar>
    );
};


export const NovaCarteiraResumo = (props: any) => {
    const { course, activeChapter = 0 } = props;

    const chapters = course.chapters || [];

    return (
        <div>
            <Stack
                alignItems="center"
                direction="row"
                spacing={2}
            >
                <LinearProgress
                    value={course.progress}
                    sx={{
                        flexGrow: 1,
                        height: 8
                    }}
                    variant="determinate"
                />
                <Typography
                    color="text.secondary"
                    variant="body2"
                >
                    {course.progress}%
                </Typography>
            </Stack>
            <Stack
                alignItems="center"
                direction="row"
                spacing={1}
                sx={{ mt: 1 }}
            >
                <SvgIcon
                    color="action"
                    fontSize="small"
                >
                    <LockClock />
                </SvgIcon>
                <Typography
                    color="text.secondary"
                    variant="caption"
                >
                    {course.duration}
                </Typography>
            </Stack>
            <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1">
                    {course.title}
                </Typography>
                <Typography
                    color="text.secondary"
                    variant="body2"
                >
                    {course.description}
                </Typography>
            </Box>
            <Stepper
                activeStep={activeChapter}
                orientation="vertical"
                sx={{
                    mt: 3,
                    '& .MuiStepLabel-iconContainer': {
                        pr: 3
                    },
                    '& .MuiStepConnector-line': {
                        borderLeftColor: 'divider',
                        borderLeftWidth: 2
                    }
                }}
            >
                {chapters.map((chapter: any, index: any) => {
                    const isCompleted = index < activeChapter;

                    return (
                        <Step key={chapter.title}>
                            <StepLabel StepIconComponent={StepIcon}>
                                <Typography
                                    color={isCompleted ? 'primary.main' : 'text.primary'}
                                    variant="subtitle2"
                                >
                                    {chapter.title}
                                </Typography>
                                <Typography
                                    color="text.secondary"
                                    variant="body2"
                                >
                                    {chapter.description}
                                </Typography>
                            </StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
        </div>
    );
};