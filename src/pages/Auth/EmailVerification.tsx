import React, { useEffect } from 'react';
import { useSearchParams, useNavigate} from 'react-router-dom';
import CheckEmail from '../../components/Auth/CheckEmail';
import { useMutation } from '@apollo/client';
import { VERIFY_USER } from '../../graphql/Mutation/user';
import Loader from '../../components/Loader';
import { InterfaceAuth } from '../../types/types';
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

        if (result.user.isVerified) {
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

    if (token) {
      verifyEmail();
    }
  }, [token, verifyUser, navigate, auth, showSuccess, showError]);

  return (
    <>
      {token ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full text-center">
            {loading && <Loader size="lg" />}
            {!loading && <p>Verifying your email, please wait...</p>}
          </div>
        </div>
      ) : (
        <CheckEmail />
      )}
    </>
  );
};

export default EmailVerification;
