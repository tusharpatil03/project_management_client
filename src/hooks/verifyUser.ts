import { useMutation } from "@apollo/client";
import { useSearchParams } from "react-router-dom";
import { InterfaceAuth } from "../types";
import { VERIFY_USER } from "../graphql/Mutation/user";

export function useVerify() {
    const [searchParams] = useSearchParams();

    const token = searchParams.get('token');

    const [verifyUser, { error, loading }] = useMutation<{
        verifyUser: InterfaceAuth;
    }>(VERIFY_USER, {
        variables: {
            token: token,
        },
    });

    return { verifyUser, error, loading };
}
