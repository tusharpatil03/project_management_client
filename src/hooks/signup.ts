import { useMutation } from "@apollo/client";
import { useMessage } from "../components/ShowMessage";
import { AuthResponse, SignupInput } from "../types";
import { SIGNUP_USER } from "../graphql/Mutation/user";

export function useSignup() {
    const [signUser, { loading, error }] = useMutation<AuthResponse>(SIGNUP_USER
    );
    const { showError, showSuccess } = useMessage();

    const signUp = async (
        step: 1 | 2,
        setStep: (val: 1 | 2) => void,
        formData: SignupInput
    ) => {
        if (step === 1) {
            setStep(2);
            return;
        }

        try {
            const res = await signUser({ variables: { input: formData } });
            showSuccess('verification link send to you email');
        } catch (err) {
            console.error('SignUp error:', err);
            showError('Something went wrong');
        }
    };

    return { signUp, error, loading };
}