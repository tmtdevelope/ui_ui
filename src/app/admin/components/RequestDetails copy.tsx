import React, { useState } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Card,
    CardContent,
    CardActions,
    Button,
    Typography,
    Grid,
    Snackbar,
    useTheme,
    useMediaQuery,
} from '@mui/material'
import {
    ContentCopy,
    Close,
    Visibility,
    VisibilityOff,
} from '@mui/icons-material'
import adminQuoteService from '@utils/adminQuoteService';

interface RequestDetailsProps {
    selectedItem: Record<string, any> | null;
    onClose: () => void;
}

const excludedFields = [
    'userId',
    'id',
    'cancelledAt',
    'cancelledBy',
    'isRead',
    'isReplied',
    'replyMessage',
    'replyAt',
]

const excludedFieldsForCustomers = [
    ...excludedFields,

]

const includeForCustomers = [
    "appointmentTime",
    "dropoffAddress",
    "numberOfSteps",
    "oxygenFlowRate",
    "oxygenO2",
    "patientName",
    "patientPhone",
    "patientWeight",
    "pickupAddress",
    "pickupDate",
    "pickupTime",
    "rentalWheelchair",
    "requestNumber",
    "requestType",
    "requesterEmail",
    "requesterName",
    "requesterOrganization",
    "requesterPhone",
    "requesterTimezone",
    "requesterUtcOffset",
    "roomNumber",
    "serviceType",
    "stairsAssistance",
    "tripType",
    "wheelchairSize"
];

const includeForDrivers = [
    "stairsAssistance",
    "pickupAddress",
    "dropoffAddress",
    "roomNumber",
    "patientName",
    "pickupTime",
    "serviceType",
    "wheelchairSize",
    'rentalWheelchair', //"needWheelchair",
    "oxygenO2",
    "appointmentTime",
    "tripType",
    "remarks"
];
const capitalizeWords = ['ID', 'IP', 'UTC', 'ZIP', 'DOB', 'NPI']

const formatKey = (key: string): string => {
    return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase())
        .split(' ')
        .map((word) =>
            capitalizeWords.includes(word.toUpperCase()) ? word.toUpperCase() : word
        )
        .join(' ')
        .replace('Rental Wheelchair', 'Need Wheelchair')
}

const formatValue = (value: string, key: string): string => {
    const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z?$/
    if (key.toLowerCase() === 'patientdob') {
        const date = new Date(value)
        return date.toLocaleDateString('en-US')
    }
    if (typeof value === 'string' && isoDatePattern.test(value)) {
        const date = new Date(value)
        return date.toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true,
        })
    }
    return value
}




const RequestDetails: React.FC<RequestDetailsProps> = ({ selectedItem, onClose }) => {
    const [isRead, setIsRead] = useState<boolean>(selectedItem?.isRead || false)
    const [open, setOpen] = useState<boolean>(false)
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    // Correctly typed onClose handler
    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const copyToClipboard = (selectedItem: Record<string, any>) => {
        const formattedData = Object.entries(selectedItem)
            .filter(([key]) => !excludedFields.includes(key))
            .map(([key, value]) => `${formatKey(key)}: ${value}`)
            .join('\n')

        navigator.clipboard.writeText(formattedData).then(() => {
            setOpen(true)
        })
    }

    const copyToClipboardFor = (includeFields: any, selectedItem: Record<string, any>) => {
        const formattedData = Object.entries(selectedItem)
            .filter(([key]) => includeFields.includes(key))
            .map(([key, value]) => `${formatKey(key)}: ${value}`)
            .join('\n')

        navigator.clipboard.writeText(formattedData).then(() => {
            setOpen(true)
        })
    }

    const toggleReadStatus = async (item: Record<string, any>) => {
        setIsRead(!isRead)
        item.isRead = !item.isRead

        try {
            await adminQuoteService.markAsRead(item.id, item.isRead)
        } catch (error) {
            console.error('Error updating read status:', error)
            item.isRead = !item.isRead
            setIsRead(!isRead)
        }
    }

    return (
        <Dialog fullScreen={isMobile} open={!!selectedItem} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Request Details</DialogTitle>
            <DialogContent>
                {selectedItem && (
                    <Card>
                        <CardContent>
                            <Grid container spacing={2}>
                                {Object.entries(selectedItem)
                                    .filter(([key]) => !excludedFields.includes(key))
                                    .map(([key, value]) => (
                                        <Grid item xs={12} md={6} key={key}>
                                            <Typography variant="subtitle1">
                                                {formatKey(key)}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'gray' }}>
                                                {formatValue(value, key)}
                                            </Typography>
                                        </Grid>
                                    ))}
                            </Grid>
                        </CardContent>
                        <CardActions
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', md: 'row' },
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                            }}
                        >
                            <Button
                                color="primary"
                                onClick={() => selectedItem && copyToClipboardFor(includeForDrivers, selectedItem)}
                                startIcon={<ContentCopy />}
                            >
                                Copy for drivers
                            </Button>
                            <Button
                                color="primary"
                                onClick={() => selectedItem && copyToClipboardFor(includeForCustomers, selectedItem)}
                                startIcon={<ContentCopy />}
                            >
                                Copy for customers
                            </Button>
                            <Button
                                color="primary"
                                onClick={() => selectedItem && copyToClipboard(selectedItem)}
                                startIcon={<ContentCopy />}
                            >
                                Copy All
                            </Button>

                            <Snackbar
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center',
                                }}
                                open={open}
                                autoHideDuration={3000}
                                onClose={handleClose}
                                message="Copied to clipboard"
                            />

                            <Button
                                color="primary"
                                onClick={() => selectedItem && toggleReadStatus(selectedItem)}
                                startIcon={isRead ? <Visibility /> : <VisibilityOff />}
                            >
                                {isRead ? 'Viewed' : 'Unviewed'}
                            </Button>
                            <Button color="primary" onClick={onClose} startIcon={<Close />}>
                                Close
                            </Button>
                        </CardActions>
                    </Card>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default RequestDetails
