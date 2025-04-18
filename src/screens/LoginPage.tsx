import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SIGNIN_USER, SIGNUP_USER } from '../graphql/Mutation/mutations'
import { AuthInput, SignResponce } from '../types/types'
import { useMutation } from '@apollo/client'
import AuthInputField from '../components/auth/authinputFields'
import AuthFormWrapper from '../components/auth/formWrapper'

export function SignPage() {
    const [formData, setFormData] = useState<AuthInput>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'Admin',
    })

    const [tab, setTab] = useState<'SIGNIN' | 'SIGNUP'>('SIGNIN')
    const navigate = useNavigate()

    const mutation = tab === 'SIGNIN' ? SIGNIN_USER : SIGNUP_USER
    const [signUser, { loading, error }] = useMutation<SignResponce>(mutation)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }
    const [showPassword, setShowPassword] = useState<boolean>(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const res = await signUser({ variables: { input: formData } })
            if (!res) {
                throw new Error('Data not Recieved')
            }
            console.log(res)
            const token = tab == "SIGNIN" ? res.data?.signin.accessToken : res.data?.signup.accessToken

            if (!token) {
                throw new Error('Token not Recieved')
            }
            localStorage.setItem('token', token)
            navigate('/projects')
        } catch (err) {
            console.error(`${tab} error:`, err)
        }
    }

    const isSignin = tab === 'SIGNIN'

    return (
        <div >
            <AuthFormWrapper title={isSignin ? 'Sign In' : 'Sign Up'}>
                <form onSubmit={handleSubmit} className="space-y-5">
                    {!isSignin && (
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
                        type={showPassword ? "text": "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        rightElement={
                            <button
                                type="button"
                                onClick={() => setShowPassword(prev => !prev)}
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
                            ? isSignin
                                ? 'Signing in...'
                                : 'Registering...'
                            : isSignin
                              ? 'Sign In'
                              : 'Sign Up'}
                    </button>

                    <button
                        type="button"
                        onClick={() => setTab(isSignin ? 'SIGNUP' : 'SIGNIN')}
                        className="w-full text-blue-600 hover:underline mt-2"
                    >
                        {isSignin
                            ? "Don't have an account? Sign Up"
                            : 'Already have an account? Sign In'}
                    </button>

                    {error && (
                        <p className="text-red-500 text-sm text-center">
                            {error.message}
                        </p>
                    )}
                </form>
            </AuthFormWrapper>
        </div>
    )
}
