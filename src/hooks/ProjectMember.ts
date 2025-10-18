import { useState } from "react";
import { useDashboard } from "../pages/Dashboard/DashBoard";
import {  useQuery } from "@apollo/client";
import { GET_ALL_MEMBERS } from "../graphql/Query/team";

export function useProjectMembers() {
  const [searchTerm, setSearchTerm] = useState('');
  const { currentProject } = useDashboard();

  const { data, loading, error, refetch } = useQuery(GET_ALL_MEMBERS, {
    variables: { projectId: currentProject?.id },
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  });

  const members = data?.getProjectTeamsMembers || [];

  // Filter members based on search term
  const filteredMembers = members.filter((member: any) => {
    const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
    const email = member.email?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
    return fullName.includes(search) || email.includes(search);
  });

  return {
    data,
    loading,
    error,
    refetch,
    members,
    filteredMembers,
    searchTerm,
    setSearchTerm,
  };
}
