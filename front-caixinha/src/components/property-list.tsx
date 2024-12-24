import List from '@mui/material/List';

import { ReactNode } from 'react';

interface PropertyListProps {
    children: ReactNode;
}

export const PropertyList = (props: PropertyListProps) => {
    const { children } = props;

    return (
        <List disablePadding>
            {children}
        </List>
    );
};
