import { useState } from 'react';
import { Login } from './Logintab';
import { SignUp } from './SignupTab';
//import AuthFormWrapper from './FormWrapper';

export function AuthTab() {
  const [tab, setTab] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const isLogin = tab === 'LOGIN';


  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg">
      <div className="flex justify-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Task Flow</h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex mb-6 border-b border-gray-200">
        <button
          onClick={() => setTab('LOGIN')}
          className={`flex-1 py-3 px-4 text-center font-medium text-sm focus:outline-none transition-colors duration-200 ${
            isLogin
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => setTab('SIGNUP')}
          className={`flex-1 py-3 px-4 text-center font-medium text-sm focus:outline-none transition-colors duration-200 ${
            !isLogin
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Create Account
        </button>
      </div>

      {/* Form Content */}
      <div className="space-y-6">
        {isLogin ? <Login /> : <SignUp />}

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setTab(isLogin ? 'SIGNUP' : 'LOGIN')}
            className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}
