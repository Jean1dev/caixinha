import { forwardRef, useCallback } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import OutlinedInput from '@mui/material/OutlinedInput';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import { Search } from '@mui/icons-material';
import { Tip } from '../tip';

interface TipProps {
    isFocused: boolean
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    onClickAway: (event: MouseEvent | TouchEvent) => void
    onFocus: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>
    onSelect: Function
    query: string
    results: Array<any>
}

export const ChatSidebarSearch = forwardRef(function ChatSidebarSearch(props: TipProps, ref) {
    const {
        isFocused,
        onChange,
        onClickAway = () => { },
        onFocus,
        onSelect,
        query = '',
        results = [],
        ...other
    } = props;

    const handleSelect = useCallback((result: any) => {
        onSelect?.(result);
    }, [onSelect]);

    const showTip = isFocused && !query;
    const showResults = isFocused// && query;
    const hasResults = results.length > 0;

    return (
        <ClickAwayListener onClickAway={onClickAway}>
            <Box
                ref={ref}
                sx={{ p: 2 }}
                {...other}>
                <OutlinedInput
                    fullWidth
                    onChange={onChange}
                    onFocus={onFocus}
                    placeholder="Search contacts"
                    startAdornment={(
                        <InputAdornment position="start">
                            <SvgIcon>
                                <Search />
                            </SvgIcon>
                        </InputAdornment>
                    )}
                    value={query}
                />
                {showTip && (
                    <Box sx={{ py: 2 }}>
                        <Tip message="Enter a contact name" />
                    </Box>
                )}
                {showResults && (
                    <>
                        {hasResults
                            ? (
                                <Box sx={{ py: 2 }}>
                                    <Typography
                                        color="text.secondary"
                                        variant="subtitle2"
                                    >
                                        Contacts
                                    </Typography>
                                    <List>
                                        {results.map((contact) => (
                                            <ListItemButton
                                                key={contact.id}
                                                onClick={() => handleSelect(contact)}
                                            >
                                                <ListItemAvatar>
                                                    <Avatar
                                                        src={contact.avatar}
                                                        sx={{
                                                            height: 32,
                                                            width: 32
                                                        }}
                                                    />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={contact.name}
                                                    primaryTypographyProps={{
                                                        noWrap: true,
                                                        variant: 'subtitle2'
                                                    }}
                                                />
                                            </ListItemButton>
                                        ))}
                                    </List>
                                </Box>
                            )
                            : (
                                <Box sx={{ py: 2 }}>
                                    <Typography
                                        color="text.secondary"
                                        variant="body2"
                                    >
                                        We couldn&apos;t find any matches for &quot;{query}&quot;. Try checking
                                        for typos or using complete words.
                                    </Typography>
                                </Box>
                            )}
                    </>
                )}
            </Box>
        </ClickAwayListener>
    );
});

