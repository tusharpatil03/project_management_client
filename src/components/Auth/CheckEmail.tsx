import React, { useState } from 'react';
import { MailCheck } from 'lucide-react';
import { SEND_VERIFICATION_LINK } from '../../graphql/Mutation/mutations';
import { useMutation } from '@apollo/client';

const CheckEmail: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [sendLink, { loading, error }] = useMutation(SEND_VERIFICATION_LINK);

  const handleSend = async () => {
    try {
      const email = localStorage.getItem('email');

      const res = await sendLink({ variables: { email: email } });
      if (res.data?.sendVerificationLink?.success) {
        setMessage('Verification link sent again successfully.');
      } else {
        setMessage(
          res.data?.sendVerificationLink?.message || 'Something went wrong.'
        );
      }
    } catch (err) {
      setMessage('Failed to send verification email.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4 text-blue-600">
          <MailCheck size={48} />
        </div>
        <h1 className="text-2xl font-semibold mb-2">Verify Your Email</h1>
        <p className="text-gray-600 mb-4">
          We’ve sent a verification link to your email. Please check your inbox
          and click the link to activate your account.
        </p>
        {message && (
          <div className="text-sm text-green-600 mb-2">{message}</div>
        )}
        <p className="text-sm text-gray-500">
          Didn’t receive the email?{' '}
          <span
            className="text-blue-600 underline cursor-pointer"
            onClick={handleSend}
          >
            {loading ? 'Sending...' : 'send the link'}
          </span>
        </p>
        {error && (
          <p className="text-sm text-red-500 mt-2">Error: {error.message}</p>
        )}
      </div>
    </div>
  );
};

export default CheckEmail;
