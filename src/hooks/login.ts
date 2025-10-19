import { useNavigate } from 'react-router-dom';
import { LOGIN_USER } from '../graphql/Mutation/user';
import { LoginInput, AuthResponse } from '../types';
import { useMutation } from '@apollo/client';
import { useAuth } from '../contexts/AuthContext';
import { setRefreshToken, UserData } from '../utils/storage';
import { useMessage } from '../components/ShowMessage';

export function useLogin() {
    const [loginUser, { loading, error }] = useMutation<AuthResponse>(LOGIN_USER);
    const { showInfo, showSuccess } = useMessage();
    const { setAccessToken } = useAuth();
    const navigate = useNavigate();

    const login = async (input: LoginInput) => {
        try {
            const res = await loginUser({ variables: { input } });
            const { accessToken, refreshToken } = res?.data?.login ?? {};

            if (!accessToken || !refreshToken) throw new Error('Token not received');

            setRefreshToken(refreshToken);
            UserData.setEmail(input.email);
            setAccessToken(accessToken);
            showSuccess('Login successful');
            navigate('/projects');
        } catch (err: any) {
            console.error('Login error:', err);
            if (err.message === 'EMAIL_NOT_VERIFIED') {
                showInfo('Please verify your email first. Check your inbox.');
            }
        }
    };

    return { login, loading, error };
}
