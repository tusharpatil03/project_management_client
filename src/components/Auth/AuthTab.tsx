import { useState } from 'react';
import { Login } from './Logintab';
import { SignUp } from './SignupTab';
import AuthFormWrapper from './FormWrapper';

export function Auth() {
    const [tab, setTab] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');


    const isLogin = tab === 'LOGIN';
    return (
        <div>
            <AuthFormWrapper title={isLogin ? 'Task Flow' : 'Task Flow'}>
                {tab === 'LOGIN' ? <Login /> : <SignUp />}
                <button
                    type="button"
                    onClick={() => setTab(isLogin ? 'SIGNUP' : 'LOGIN')}
                    className="w-full text-blue-600 hover:underline mt-2"
                >
                    {isLogin
                        ? "Don't have an account? Register"
                        : 'Already have an account? Log In'}
                </button>
            </AuthFormWrapper>
        </div>
    );
}
