export const Spinner = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
    const sizeClasses = {
        sm: "h-4 w-4 border-2",
        md: "h-8 w-8 border-2",
        lg: "h-12 w-12 border-4",
    };

    return (
        <div className="flex justify-center items-center">
            <div
                className={`animate-spin rounded-full border-solid border-white border-t-pink-200 ${sizeClasses[size]}`}
            />
        </div>
    );
};
