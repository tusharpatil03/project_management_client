import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import CheckEmail from '../../components/Auth/CheckEmail';
import { useMutation } from '@apollo/client';
import { VERIFY_USER } from '../../graphql/Mutation/mutations';

const EmailVerification: React.FC = () => {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>(
    'verifying'
  );
  const [message, setMessage] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');

  const [verifyUser] = useMutation(VERIFY_USER);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid or missing verification token.');
        return;
      }

      try {
        const response = await verifyUser({ variables: { token } });
        const result = response.data.verifyUser;

        if (result.user.isVerified) {
          localStorage.setItem(
            'name',
            `${result.user.firstName} ${result.user.lastName}`
          );
          localStorage.setItem('id', result.user.id);
          localStorage.setItem('email', result.user.email);
          localStorage.setItem('IsLoggedIn', 'TRUE');
          localStorage.setItem('avtar', result.user.profile.avatar);
          localStorage.setItem('username', result.user.username);

          setStatus('success');
          setMessage('Email verified successfully! Redirecting...');
          setTimeout(() => navigate('/dashboard/projects'), 1000);
        } else {
          throw new Error('User verification failed');
        }
      } catch (err: any) {
        setStatus('error');
        setMessage(err?.message || 'Email verification failed.');
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token, verifyUser, navigate]);

  return (
    <>
      {token ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full text-center">
            {status === 'verifying' && (
              <p className="text-blue-600">Verifying your email...</p>
            )}
            {status === 'success' && (
              <p className="text-green-600">{message}</p>
            )}
            {status === 'error' && <p className="text-red-600">{message}</p>}
          </div>
        </div>
      ) : (
        <CheckEmail />
      )}
    </>
  );
};

export default EmailVerification;
