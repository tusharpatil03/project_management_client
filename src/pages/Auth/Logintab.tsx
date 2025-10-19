import { useState } from 'react';
import { LoginInput } from '../../types';
import AuthInputField from '../../components/Auth/AuthinputFields';
import { useLogin } from '../../hooks/login';

export function Login() {
  const [formData, setFormData] = useState<LoginInput>({
    email: '',
    password: '',
  });

  const { login, loading, error } = useLogin();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const isFormValid = (): boolean => {
    return formData.email.trim() !== '' && formData.password.trim() !== '';
  };

  return (
    <div>
      <form
        onSubmit={(e: React.FormEvent) => {
          e.preventDefault();
          login(formData);
        }}
        className="space-y-4"
      >
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
            {error?.message.toLowerCase() ?? 'Something went wrong'}
          </p>
        )}
      </form>
    </div>
  );
}
