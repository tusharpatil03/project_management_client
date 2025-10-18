import { ASSIGN_ISSUE, REMOVE_ASSIGNEE } from "../graphql/Mutation/issue";
import { useMutation } from "@apollo/client";

export function useAssignee() {
    const [changeAssignee, { error, loading }] = useMutation(ASSIGN_ISSUE, {
        errorPolicy: 'all',
    });

    return { changeAssignee, assignError: error, assignLoading: loading };
}

export function useRemoveAssignee() {
    const [
        removeAssignee,
        { error: removeAssigneErr, loading: removeAssigneeLoad },
    ] = useMutation(REMOVE_ASSIGNEE, {
        errorPolicy: 'all',
    });

    return { removeAssignee, removeAssigneErr, removeAssigneeLoad };
}