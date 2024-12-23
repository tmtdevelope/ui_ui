/** @format */

// src/services/authService.ts
import axios, { AxiosError } from 'axios';

const api = axios.create({
	baseURL: 'https://erp.trustmtrans.com/api/v1',
	// baseURL: 'http://127.0.0.1:8000/api/v1',
	//baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // Set your API base URL in .env file
});

// Helper function to make POST requests
const post = async (url: string, data: object) => {
	try {
		const response = await api.post(url, data);

		return response.data;
	} catch (error: unknown) {
		// Type narrowing: check if the error is an AxiosError
		if (error instanceof AxiosError) {
			// Now TypeScript knows that error is an AxiosError
			console.error('Login failed:', error.response?.data || error.message);
			// Handle error, e.g., display error message to the user
		} else {
			// For unknown error types, handle or throw a new error
			console.error('An unexpected error occurred:', error);
		}
	}
};

export const authService = {
	login(data: { email: string; password: string }) {
		return post('/login', data); // Assuming the response contains the user object
	},
	logout(data: { token: string }) {
		return post('/logout', data);
	},
	resetPassword(data: { email: string }) {
		return post('/password/reset', data);
	},
	passwordForget(data: { email: string }) {
		return post('/password/forget', data);
	},
};
