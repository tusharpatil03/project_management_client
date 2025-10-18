import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { VERIFY_USER } from '../../graphql/Mutation/user';
import LoadingState from '../../components/LoadingState';
import { InterfaceAuth } from '../../types/';
import { useAuth } from '../../contexts/AuthContext';
import { setRefreshToken } from '../../utils/storage';
import { useMessage } from '../../components/ShowMessage';

const EmailVerification: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useMessage();

  const token = searchParams.get('token');

  const [verifyUser, { loading }] = useMutation<{
    verifyUser: InterfaceAuth;
  }>(VERIFY_USER);

  const auth = useAuth();

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        showError('Verification token is missing from the URL.');
        return;
      }

      try {
        const response = await verifyUser({ variables: { token } });
        const result = response.data?.verifyUser;

        if (!result) {
          throw new Error('No response from server during verification.');
        }

        if (result?.accessToken && result?.refreshToken) {
          const { accessToken, refreshToken } = result;
          setRefreshToken(refreshToken);
          auth.setAccessToken(accessToken);
          showSuccess('Email verified successfully! Redirecting...');
          navigate('/projects');
        } else {
          showError('Email verification failed. Please try again.');
        }
      } catch (err: any) {
        showError(err.message || 'An unknown error occurred.');
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <>
      (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full text-center">
          {loading && <LoadingState size="lg" fullScreen={false} />}
          {!loading && <p>Verifying your email, please wait...</p>}
        </div>
      </div>
      )
    </>
  );
};

export default EmailVerification;
