import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SIGNUP_USER } from '../../graphql/Mutation/user';
import { SignupInput, AuthResponse } from '../../types/';
import { useMutation } from '@apollo/client';
import AuthInputField from './AuthinputFields';

export function SignUp() {
  const [step, setStep] = useState<1 | 2>(1);

  const [formData, setFormData] = useState<SignupInput>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [signUser, { loading, error }] = useMutation<AuthResponse>(SIGNUP_USER);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [showAlert, setShowAlert] = useState({
    isStrongPassword: true,
  });

  const passwordValidationRegExp = {
    lowercaseCharRegExp: new RegExp('[a-z]'),
    uppercaseCharRegExp: new RegExp('[A-Z]'),
    numericalValueRegExp: new RegExp('\\d'),
    specialCharRegExp: new RegExp('[!@#$%^&*()_+{}\\[\\]:;<>,.?~\\\\/-]'),
  };

  const validatePassword = (pass: string): boolean => {
    const lowercaseChar =
      passwordValidationRegExp.lowercaseCharRegExp.test(pass);
    const uppercaseChar =
      passwordValidationRegExp.uppercaseCharRegExp.test(pass);
    const numericValue =
      passwordValidationRegExp.numericalValueRegExp.test(pass);
    const specialChar = passwordValidationRegExp.specialCharRegExp.test(pass);

    if (
      pass.length > 8 &&
      lowercaseChar &&
      uppercaseChar &&
      numericValue &&
      specialChar
    ) {
      return true;
    }
    return false;
  };

  const handlePasswordCheck = (pass: string): void => {
    setShowAlert({
      isStrongPassword: validatePassword(pass),
    });
  };

  const isFormValid = (): boolean => {
    return step === 1
      ? formData.email.trim() !== '' &&
          formData.password.trim() !== '' &&
          showAlert.isStrongPassword
      : formData.firstName !== '' && formData.lastName !== '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      setStep(2);
      return;
    }

    try {
      const res = await signUser({ variables: { input: formData } });

      if (!res.data?.signup.success) {
        throw new Error('Internal Server Error');
      }

    } catch (err) {
      console.error('SignUp error:', err);
      throw new Error('Internal Server Error');
    }

    navigate("/signup/checkEmail");
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
              label="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={(e) => {
                handleChange(e);
                handlePasswordCheck(e.target.value);
              }}
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
            {!showAlert.isStrongPassword && formData.password && (
              <p className="text-sm text-red-500 mt-1">
                Password must contain uppercase, lowercase, number, and special
                character.
              </p>
            )}
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
          disabled={loading || !isFormValid()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition duration-200 disabled:opacity-50"
        >
          {step === 1 ? 'Next' : loading ? 'Registering...' : 'Register'}
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
