
export const getRoleBadgeColor = (role: string, isCreator: boolean = false) => {
    if (isCreator) {
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-500';
    }
    switch (role?.toLowerCase()) {
        case 'admin':
            return 'bg-red-100 text-red-800 border-red-200';
        case 'contributor':
            return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'viewer':
            return 'bg-gray-100 text-gray-800 border-gray-200';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};
