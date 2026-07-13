import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";

export const useAuthContext = () => {
    const ctx = useContext(AuthContext);

    if (!ctx) {
        throw new Error("useAuthContext must be used inside AuthProvider");
    }

    return ctx;
};