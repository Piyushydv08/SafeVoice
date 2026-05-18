export const getErrorMessage = (error: any): string => {
    // Handle offline status immediately
    if (typeof navigator !== "undefined" && !navigator.onLine) {
        return "You are offline. Please check your internet connection.";
    }

    switch (error?.code) {
        // Auth Errors
        case "auth/user-not-found":
            return "No account found with this email.";
        case "auth/wrong-password":
            return "Incorrect password.";
        case "auth/email-already-in-use":
            return "This email is already registered.";
        case "auth/network-request-failed":
            return "Network error. Please check your connection.";
        case "auth/too-many-requests":
            return "Too many attempts. Please try again later.";

        // Firestore / Firebase Errors
        case "permission-denied":
            return "You don't have permission to perform this action.";
        case "unavailable":
            return "Service is currently unavailable. Please try again.";

        // Fallback
        default:
            return (
                error?.message || "An unexpected error occurred. Please try again."
            );
    }
};
