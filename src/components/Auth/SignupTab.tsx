import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SIGNUP_USER } from '../../graphql/Mutation/mutations';
import { SignupInput, AuthResponce } from '../../types/types';
import { useMutation } from '@apollo/client';
import AuthInputField from './AuthinputFields';

export function SignUp() {
    const [formData, setFormData] = useState<SignupInput>({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
    });

    const navigate = useNavigate();

    const [signUser, { loading, error }] =
        useMutation<AuthResponce>(SIGNUP_USER);

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
            const accessToken = res.data?.signup.accessToken;
            const refreshToken = res.data?.signup.refreshToken;

            if (!accessToken || !refreshToken) {
                throw new Error('Token not Recieved');
            }
            sessionStorage.setItem("refreshToken", refreshToken)
            sessionStorage.setItem("accessToken", accessToken)
            navigate('/projects');
        } catch (err) {
            console.error(`SingUp error:`, err);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="space-y-5">
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

                <AuthInputField
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="abc@gmail.com"
                />

                <AuthInputField
                    label="Username"
                    type="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="username"
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
                    {loading ? 'Registering...' : 'Register'}
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
