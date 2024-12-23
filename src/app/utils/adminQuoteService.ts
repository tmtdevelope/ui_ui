import { get, put, patch } from './axios';
/* 
interface Quote {
    id: number;
    patientName: string;
    requestType: string;
    patientPhone: string;
    serviceType: string;
    pickupAddress: string;
    dropoffAddress: string;
    roomNumber: string;
    requesterName: string;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
} */

const adminQuoteService = {
    // Get private quotes by request type
    getPrivateQuote(requestType: string) {
        return get(`/admin/quote/private?requestType=${requestType}`);
    },

    // Get facility quotes
    getFacilityQuote() {
        return get('/admin/quote/facility');
    },

    // Get insurance quotes
    getInsuranceQuote() {
        return get('/admin/quote/insurance');
    },

    // Get all quotes
    getQuotes() {
        return get('/admin/quote/fetch_guotes');
        // return get2();
        // Example Axios request with token


    },




    // Mark a quote as read (using PUT request)
    markAsRead1(requestNumber: string) {
        return put(`/admin/quote/${requestNumber}/mark-as-read`, {});
    },



    // Mark a quote as read (using PATCH request)
    markAsRead(id: number, isRead: boolean) {
        return patch(`/admin/quote/read/${id}`, {
            is_read: isRead,
        });
    },

    reply1(id: number, data: any) {
        alert(data.requesterName);
        return patch(`/admin/quote/reply/${id}`, {
            data: data,

        });
    },
    reply(id: number, data: any) {
        // alert(data.requesterName);
        return put(`admin/quote/reply/${id}`, data);
    },



    // Mark a quote as read (alternative using fetch)
    async markAsRead4(id: number, isRead: boolean) {
        return await fetch(`/api/v1/admin/quotes/read/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ isRead }),
        });
    },

    // Get list of users
    getUsers() {
        return get('/admin/user');
    },
};

export default adminQuoteService;
