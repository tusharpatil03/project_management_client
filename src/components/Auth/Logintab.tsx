import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LOGIN_USER } from '../../graphql/Mutation/mutations';
import { LoginInput, AuthResponce } from '../../types/types';
import { useMutation } from '@apollo/client';
import AuthInputField from './AuthinputFields';

export function Login() {
    const [formData, setFormData] = useState<LoginInput>({
        email: '',
        password: '',
    });

    const navigate = useNavigate();

    const [signUser, { loading, error }] =
        useMutation<AuthResponce>(LOGIN_USER);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await signUser({ variables: { input: formData } });
            console.log(res.data?.login.refreshToken);
            if (!res) {
                throw new Error('Data not Recieved');
            }
            const accessToken = res.data?.login.accessToken;
            const refreshToken = res.data?.login.refreshToken;

            if (!accessToken || !refreshToken) {
                throw new Error('Token not Recieved');
            }
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('accessToken', accessToken);
            navigate('/dashboard');
        } catch (err) {
            console.error(`Login error:`, err);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="space-y-5">
                <AuthInputField
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="abc@gmail.com"
                />
                <AuthInputField
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    rightElement={
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="text-sm text-gray-600 focus:outline-none"
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    }
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
                >
                    {loading ? 'Loging in...' : 'Login'}
                </button>

                {error && (
                    <p className="text-red-500 text-sm text-center">
                        {error.message}
                    </p>
                )}
            </form>
        </div>
    );
}
