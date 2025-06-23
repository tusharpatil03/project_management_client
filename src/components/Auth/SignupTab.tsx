import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SIGNUP_USER } from '../../graphql/Mutation/mutations';
import { SignupInput, AuthResponce } from '../../types/types';
import { useMutation } from '@apollo/client';
import AuthInputField from './AuthinputFields';

export function SignUp() {
    const [step, setStep] = useState<1 | 2>(1); // step control
    const [formData, setFormData] = useState<SignupInput>({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const [signUser, { loading, error }] = useMutation<AuthResponce>(SIGNUP_USER);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (step === 1) {
            setStep(2); // go to next phase
            return;
        }

        // Final submit on step 2
        try {
            const res = await signUser({ variables: { input: formData } });

            if (!res?.data?.signup?.accessToken || !res?.data?.signup?.refreshToken) {
                throw new Error('Token not received');
            }

            sessionStorage.setItem("accessToken", res.data.signup.accessToken);
            sessionStorage.setItem("refreshToken", res.data.signup.refreshToken);

            navigate('/projects');
        } catch (err) {
            console.error("SignUp error:", err);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="space-y-4">
                {step === 1 ? (
                    <>
                        <AuthInputField
                            label="Email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                        />
                        <AuthInputField
                            label="Username"
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="yourusername"
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
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            }
                        />
                    </>
                ) : (
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

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition duration-200 disabled:opacity-50"
                >
                    {step === 1
                        ? 'Next'
                        : loading
                        ? 'Registering...'
                        : 'Register'}
                </button>

                {error && (
                    <p className="text-sm text-red-500 text-center mt-2">
                        {error.message}
                    </p>
                )}

                {step === 2 && (
                    <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="w-full text-sm text-blue-600 hover:underline text-center mt-2"
                    >
                        ← Back to credentials
                    </button>
                )}
            </form>
        </div>
    );
}
