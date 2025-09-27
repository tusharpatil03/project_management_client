import React, { useEffect } from 'react';
import { useSearchParams, useNavigate} from 'react-router-dom';
import CheckEmail from '../../components/Auth/CheckEmail';
import { useMutation } from '@apollo/client';
import { VERIFY_USER } from '../../graphql/Mutation/user';
import { showError } from '../../utils/showError';
import Loader from '../../components/Loader';
import { InterfaceAuth } from '../../types/types';
import { useAuth } from '../../contexts/AuthContext';
import { setRefreshToken } from '../../utils/storage';

const EmailVerification: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');

  const [verifyUser, { loading, error }] = useMutation<{
    verifyUser: InterfaceAuth;
  }>(VERIFY_USER);

  const auth = useAuth();

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        return;
      }

      try {
        const response = await verifyUser({ variables: { token } });
        const result = response.data?.verifyUser;

        if (!result) {
          throw new Error('No Responce from server');
        }

        if (result.user.isVerified) {
          const { accessToken, refreshToken } = result;
          setRefreshToken(refreshToken);
          // set token via provider
          auth.setAccessToken(accessToken);
          navigate('/projects');
        }
      } catch (err: any) {
        console.log(err);
        showError(err?.message);
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
            {loading && <Loader size="lg" />}
            {error && <p>{error.message}</p>}
          </div>
        </div>
      ) : (
        <CheckEmail />
      )}
    </>
  );
};

export default EmailVerification;
