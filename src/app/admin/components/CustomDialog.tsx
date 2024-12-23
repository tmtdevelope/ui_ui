import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

interface CustomDialogProps {
    open: boolean;
    title: string;
    children: React.ReactNode;
    onClose: () => void;
    onConfirm?: () => void;
    disableBackdropClose?: boolean;
    confirmLabel?: string,
}

const CustomDialog: React.FC<CustomDialogProps> = ({
    open,
    title,
    children,
    onClose,
    onConfirm,
    disableBackdropClose = true,
    confirmLabel = "confirm",
}) => {

    const handleClose = (_: unknown, reason: 'backdropClick' | 'escapeKeyDown') => {
        if (disableBackdropClose && (reason === 'backdropClick' || reason === 'escapeKeyDown')) return;
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>{children}</DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                {onConfirm && <Button onClick={onConfirm} variant="contained">{confirmLabel}</Button>}
            </DialogActions>
        </Dialog>
    );
};

export default CustomDialog;
