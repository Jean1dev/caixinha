import { ArrowRight } from '@mui/icons-material';
import { 
    Box, 
    Button, 
    Card, 
    CardActions, 
    CardHeader, 
    Divider,
    SvgIcon, 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableRow 
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Scrollbar } from '../scrollbar';

interface IHistory {
    id: number;
    type: number;
    time: string;
    weight: number;
    amount: string;
    currency: string;
}

const dataArray: IHistory[] = [
    {
        id: 1,
        amount: '146,70',
        currency: 'TRY',
        weight: 10,
        time: '06:22:15',
        type: 1,
    },
    {
        id: 2,
        amount: '146,70',
        currency: 'TRY',
        weight: 10,
        time: '07:30:30',
        type: 1,
    },
    {
        id: 3,
        amount: '146,70',
        currency: 'TRY',
        weight: 10,
        time: '09:15:42',
        type: 2,
    },
    {
        id: 4,
        amount: '146,70',
        currency: 'TRY',
        weight: 10,
        time: '11:12:50',
        type: 2,
    },
    {
        id: 5,
        amount: '146,70',
        currency: 'TRY',
        weight: 10,
        time: '13:30:01',
        type: 1,
    },
    {
        id: 6,
        amount: '146,70',
        currency: 'TRY',
        weight: 10,
        time: '14:20:36',
        type: 1,
    },
    {
        id: 7,
        amount: '146,70',
        currency: 'TRY',
        weight: 10,
        time: '17:45:58',
        type: 1,
    },
    {
        id: 8,
        amount: '146,70',
        currency: 'TRY',
        weight: 10,
        time: '20:05:54',
        type: 1,
    },
    {
        id: 9,
        amount: '146,70',
        currency: 'TRY',
        weight: 10,
        time: '22:30:45',
        type: 2,
    },
];

interface IProps {
    item: any;
}

const TradeHistoryRow = ({ item }: IProps) => (
    <TableRow key={item.id}>
        <TableCell sx={{ color: item.type === 1 ? 'green' : 'red' }}>{item.amount} {item.currency}</TableCell>
        <TableCell sx={{ color: item.type === 1 ? 'green' : 'red' }}>{item.weight}</TableCell>
        <TableCell sx={{ color: item.type === 1 ? 'green' : 'red' }}>{item.type === 1 ? 'BUY' : 'SELL'}</TableCell>
        <TableCell sx={{ color: item.type === 1 ? 'green' : 'red' }}>{item.time}</TableCell>
    </TableRow>
);

const TradeHistory = () => {
    const [data, setData] = useState<IHistory[]>([]);

    useEffect(() => {
        setData(dataArray);
    }, []);

    return (
        <Card>
            <CardHeader title="Trade History" />
            <Scrollbar sx={{ flexGrow: 1 }}>
                <Box sx={{ minWidth: 800 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Price</TableCell>
                                <TableCell>Volume</TableCell>
                                <TableCell>Transaction</TableCell>
                                <TableCell>Time</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((item: IHistory) => (
                                <TradeHistoryRow key={item.id} item={item} />
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </Scrollbar>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button
                    color="inherit"
                    href='/market'
                    endIcon={(
                        <SvgIcon fontSize="small">
                            <ArrowRight />
                        </SvgIcon>
                    )}
                    size="small"
                    variant="text"
                >
                    See more
                </Button>
            </CardActions>
        </Card>
    );
};

export default TradeHistory;
