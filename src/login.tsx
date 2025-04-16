import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LOGIN_USER } from './graphql/Query/queries'
import { AuthInput } from './types/types'
import { LoginResponse } from './types/types'
import { useMutation } from '@apollo/client'

export function Login() {
    const [formData, setFormData] = useState<AuthInput>({
        email: '',
        password: '',
        role: 'Admin',
    })

    const [loginUser, { loading, error }] =
        useMutation<LoginResponse>(LOGIN_USER)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            const { data } = await loginUser({
                variables: { signinInput: formData },
            })

            if (data?.signin?.accessToken) {
                localStorage.setItem('token', data.signin.accessToken)
                console.log('Login successful')
                navigate('/')
            }
        } catch (err) {
            console.error('Login error:', err)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Sign In
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-600"
                        >
                            Email
                        </label>
                        <input
                            required
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="abc@gmail.com"
                            className="mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-600"
                        >
                            Password
                        </label>
                        <input
                            required
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>

                    {error && (
                        <p className="text-red-500 text-sm text-center">
                            {error.message}
                        </p>
                    )}
                </form>
            </div>
        </div>
    )
}
