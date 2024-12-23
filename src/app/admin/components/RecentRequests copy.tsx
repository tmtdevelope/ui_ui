'use client';
import { useState, useEffect } from 'react';
import {
    CircularProgress,
    Card,
    CardContent,
    CardHeader,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TableSortLabel,
    useMediaQuery,
} from '@mui/material';
import { Email, Visibility, VisibilityOff } from '@mui/icons-material';
import adminQuoteService from '@utils/adminQuoteService';
import RequestDetails from './RequestDetails';
import { useTheme, Theme } from '@mui/material/styles';
import ReplyDialog from './ReplyDialog';
// Define types for the item structure
interface RequestItem {
    id: number;
    requestNumber: string;
    patientName: string;
    requestType: string;
    patientPhone: string;
    serviceType: string;
    pickupAddress: string;
    dropoffAddress: string;
    roomNumber: string;
    requesterName: string;
    isRead?: boolean;
    isReplied?: boolean;
    replyMessage: String;
    reply_at: string;
    pickupDate: string;
    patientDob: string;
    appointmentTime: string;
    pickupTime: string;
    createdAt: string;
    updatedAt: string;
    organizationName?: string;
    requesterOrganization?: string;
    requesterEmail: string;
    cost: number;

}

export default function RecentRequests() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [items, setItems] = useState<RequestItem[]>([]);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [repDialogOpen, setRepDialogOpen] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<RequestItem | null>(null);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [orderBy, setOrderBy] = useState<keyof RequestItem>('requestNumber');


    const headers = [
        { title: 'Request Number', key: 'requestNumber' },
        { title: 'Patient Name', key: 'patientName' },
        { title: 'Request', key: 'requestType' },
        { title: 'Patient Phone', key: 'patientPhone' },
        { title: 'Service', key: 'serviceType' },
        { title: 'Pickup', key: 'pickupAddress' },
        { title: 'Drop-off', key: 'dropoffAddress' },
        { title: 'Room Number', key: 'roomNumber' },
        { title: 'Requester Name', key: 'requesterName' },
        { title: 'View', key: 'actions' },
        { title: 'Reply', key: 'reply' },
    ];
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Filter columns for mobile view
    const displayedHeaders = isMobile ? headers.slice(0, 4) : headers;
    useEffect(() => {
        const fetchQuotes = async () => {
            setIsLoading(true);
            try {
                const response = await adminQuoteService.getQuotes();
                const data = (response.data as { data: RequestItem[] }).data; // Casting response.data
                setItems(
                    data.map((item) => ({
                        ...item, // Spread the original item to include all existing properties
                        pickupDate: formatDate1(item.pickupDate),
                        patientDob: formatDate1(item.patientDob),
                        appointmentTime: formatTime(item.appointmentTime),
                        pickupTime: formatTime(item.pickupTime),
                        createdAt: formatDate2(item.createdAt),
                        updatedAt: formatDate2(item.updatedAt),
                        isRead: item.isRead || false,
                        requesterOrganization: item.organizationName || item.requesterOrganization,
                    }))
                );
            } catch (error) {
                console.error('Error fetching quotes:', error);
            }
            setIsLoading(false);
        };

        fetchQuotes();
    }, []);

    const formatDate1 = (dateString: string): string => {
        if (!dateString || !dateString.trim()) {
            return 'N/A';
        }
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            timeZone: 'UTC',
        });
    };

    const formatDate2 = (dateString: string): string => {
        if (!dateString || !dateString.trim()) {
            return 'N/A';
        }
        return new Date(dateString).toLocaleString('en-US');
    };

    const formatTime = (timeString: string): string => {
        if (!timeString) {
            return 'N/A';
        }
        const [hours, minutes] = timeString.split(':');
        const hours12 = parseInt(hours) % 12 || 12;
        const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
        return `${hours12}:${minutes} ${ampm}`;
    };

    const handleReplyDialog = async (item: RequestItem) => {
        setSelectedItem(item);
        /*  if (!item.isRead) {
             item.isRead = true;
             try {
                 await adminQuoteService.markAsRead(item.id, true);
             } catch (error) {
                 console.error('Error updating read status:', error);
             }
         } */
        setRepDialogOpen(true);
    };

    const handleCloseRepDialog = () => {
        setRepDialogOpen(false);
        setSelectedItem(null);
    };

    const handleOpenDialog = async (item: RequestItem) => {
        setSelectedItem(item);
        if (!item.isRead) {
            item.isRead = true;
            try {
                await adminQuoteService.markAsRead(item.id, true);
            } catch (error) {
                console.error('Error updating read status:', error);
            }
        }
        setDialogOpen(true);
    };




    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedItem(null);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - items.length) : 0;
    const dataSlice = items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleRequestSort = (property: keyof RequestItem) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };


    const sortedItems = items.sort((a, b) => {
        if (orderBy) {
            const valueA = a[orderBy] !== undefined ? a[orderBy] : '';
            const valueB = b[orderBy] !== undefined ? b[orderBy] : '';

            if (valueA < valueB) {
                return order === 'asc' ? -1 : 1;
            }
            if (valueA > valueB) {
                return order === 'asc' ? 1 : -1;
            }
        }
        return 0;
    });
    return (
        <div>
            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', height: '50vh' }}>
                    <CircularProgress size={50} color="primary" />
                </div>
            ) : (
                <Card>
                    <CardHeader title="Recent Requests" />
                    <CardContent /* sx={{ padding: 0, margin: 0 }} */>
                        <TableContainer>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        {headers.map((header) => (
                                            <TableCell key={header.key} align="center">
                                                {header.key !== 'actions' && (
                                                    <TableSortLabel
                                                        active={orderBy === header.key}
                                                        direction={orderBy === header.key ? order : 'asc'}
                                                        onClick={() => handleRequestSort(header.key as keyof RequestItem)}
                                                    >
                                                        {header.title}
                                                    </TableSortLabel>
                                                )}
                                                {header.key === 'actions' && header.title}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {dataSlice.map((item) => (
                                        <TableRow key={item.id}>
                                            {headers.map((header) => (
                                                <TableCell key={header.key} align="center">
                                                    {header.key === 'actions' ? (
                                                        <IconButton onClick={() => handleOpenDialog(item)}>
                                                            {item.isRead ? <Visibility /> : <VisibilityOff />}
                                                        </IconButton>

                                                    ) : header.key === 'reply' ? (
                                                        <IconButton onClick={() => handleReplyDialog(item)}>
                                                            <Email color={item.isReplied ? 'success' : 'error'} />
                                                        </IconButton>
                                                    ) : (
                                                        item[header.key as keyof RequestItem] ?? 'N/A'
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                    {emptyRows > 0 && (
                                        <TableRow style={{ height: 53 * emptyRows }}>
                                            <TableCell colSpan={headers.length} />
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 50, 100]}
                            component="div"
                            count={items.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                        {dialogOpen && selectedItem && (
                            <RequestDetails selectedItem={selectedItem} onClose={handleCloseDialog} />
                        )}

                        {repDialogOpen && selectedItem && (
                            <ReplyDialog open={repDialogOpen} onClose={handleCloseRepDialog} item={selectedItem} />
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

