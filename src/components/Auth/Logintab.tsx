import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LOGIN_USER } from '../../graphql/Mutation/user';
import { LoginInput, AuthResponce } from '../../types/types';
import { useMutation } from '@apollo/client';
import AuthInputField from './AuthinputFields';
import { authState } from '../../utils/logout';

export function Login() {
  const [formData, setFormData] = useState<LoginInput>({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const [signUser, { loading, error }] = useMutation<AuthResponce>(LOGIN_USER);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await signUser({ variables: { input: formData } });
      const data = res.data?.login;
      if (!data) {
        throw new Error('Data not Recieved');
      }
      const accessToken = res.data?.login.accessToken;
      const refreshToken = res.data?.login.refreshToken;

      if (!accessToken || !refreshToken) {
        throw new Error('Token not Recieved');
      }

      localStorage.setItem(
        'name',
        `${data.user.firstName} ${data.user.lastName}`
      );
      localStorage.setItem('id', data.user.id);
      localStorage.setItem('email', data.user.email);
      localStorage.setItem('IsLoggedIn', 'TRUE');
      localStorage.setItem('avatar', data.profile.avatar);
      localStorage.setItem('username', data.user.username);
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      if (!data.user.isVerified) {
        navigate('/auth/verify');
      }
      authState.isAuthenticated = true;
      authState.skipAuth = true;

      navigate('/dashboard/projects');
    } catch (err) {
      console.error(`Login error:`, err);
    }
  };

  const isFormValid = (): boolean => {
    return formData.email.trim() !== '' && formData.password.trim() !== '';
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <AuthInputField
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
        />

        {/* Password Input with Toggle */}
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
              className="text-sm text-blue-600 hover:underline focus:outline-none"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          }
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !isFormValid()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition duration-200 disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {/* Error Message */}
        {error && (
          <p className="text-sm text-red-500 text-center mt-2">
            {error.message}
          </p>
        )}
      </form>
    </div>
  );
}
