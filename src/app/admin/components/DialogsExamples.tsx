'use client';

import React, { useState } from 'react';
import { Button } from '@mui/material';
import CustomDialog from './CustomDialog';

const ParentComponent: React.FC = () => {
    const [dialogOpen, setDialogOpen] = useState<{ [key: string]: boolean }>({
        firstDialog: false,
        secondDialog: false,
    });

    const handleOpen = (dialog: string) => setDialogOpen((prev) => ({ ...prev, [dialog]: true }));
    const handleClose = (dialog: string) => setDialogOpen((prev) => ({ ...prev, [dialog]: false }));

    return (
        <>
            <Button onClick={() => handleOpen('firstDialog')}>Open First Dialog</Button>
            <Button onClick={() => handleOpen('secondDialog')}>Open Second Dialog</Button>

            <CustomDialog
                open={dialogOpen.firstDialog}
                title="First Dialog"
                onClose={() => handleClose('firstDialog')}
            >
                Content for the first dialog.
            </CustomDialog>

            <CustomDialog
                open={dialogOpen.secondDialog}
                title="Second Dialog"
                onClose={() => handleClose('secondDialog')}
                onConfirm={() => {
                    alert('Confirmed!');
                    handleClose('secondDialog');
                }}
                confirmLabel="OK"
            >
                Content for the second dialog.
            </CustomDialog>
        </>
    );
};

export default ParentComponent;
