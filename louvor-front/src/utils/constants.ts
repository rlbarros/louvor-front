import { AuthService } from '@/services/auth/auth.service';
import { createContext } from 'react';

const authService = new AuthService();
const currentUser = authService.user();
const AuthContext = createContext(currentUser);

export default AuthContext;