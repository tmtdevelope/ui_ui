import { post } from "./axios";

/* export interface AuthData {
  name: string;
  email: string;
  roles: any;
  token: string;
  // Add other properties as required by each method
}

interface AuthService {
  login(data: AuthData): Promise<any>;
  logout(data: AuthData): Promise<any>;
  resetPassword(data: AuthData): Promise<any>;
  passwordForget(data: AuthData): Promise<any>;
}
 */
export const authService = {
  login(data: { email: string; password: string }) {
    return post('/login', data);  // Assuming the response contains the user object
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
}

//export default authService;
