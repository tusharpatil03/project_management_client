import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LOGIN_USER, SIGNUP_USER } from '../../graphql/Mutation/mutations';
import { AuthInput, AuthResponce } from '../../types/types';
import { useMutation } from '@apollo/client';
import AuthInputField from './AuthinputFields';
import AuthFormWrapper from './FormWrapper';

export function Auth() {
    const [formData, setFormData] = useState<AuthInput>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'Admin',
    });

    const [tab, setTab] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');

    const navigate = useNavigate();

    const mutation = tab === 'LOGIN' ? LOGIN_USER : SIGNUP_USER;
    const [signUser, { loading, error }] = useMutation<AuthResponce>(mutation);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await signUser({ variables: { input: formData } });
            if (!res) {
                throw new Error('Data not Recieved');
            }
            console.log(res);
            const token =
                tab == 'LOGIN'
                    ? res.data?.login.accessToken
                    : res.data?.signup.accessToken;

            if (!token) {
                throw new Error('Token not Recieved');
            }
            localStorage.setItem('token', token);
            navigate('/projects');
        } catch (err) {
            console.error(`${tab} error:`, err);
        }
    };

    const isLogin = tab === 'LOGIN';

    return (
        <div>
            <AuthFormWrapper title={isLogin ? 'Task Flow' : 'Task Flow'}>
                <form onSubmit={handleSubmit} className="space-y-5">
                    {!isLogin && (
                        <>
                            <AuthInputField
                                label="First Name"
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                            <AuthInputField
                                label="Last Name"
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                        </>
                    )}

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
                        {loading
                            ? isLogin
                                ? 'Loging in...'
                                : 'Registering...'
                            : isLogin
                              ? 'Login'
                              : 'Register'}
                    </button>

                    <button
                        type="button"
                        onClick={() => setTab(isLogin ? 'SIGNUP' : 'LOGIN')}
                        className="w-full text-blue-600 hover:underline mt-2"
                    >
                        {isLogin
                            ? "Don't have an account? Register"
                            : 'Already have an account? Log In'}
                    </button>

                    {error && (
                        <p className="text-red-500 text-sm text-center">
                            {error.message}
                        </p>
                    )}
                </form>
            </AuthFormWrapper>
        </div>
    );
}
