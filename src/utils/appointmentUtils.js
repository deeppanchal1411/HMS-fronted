export const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
        case "completed":
            return "success";
        case "pending":
            return "warning";
        case "cancelled":
            return "danger";
        default:
            return "secondary";
    }
};