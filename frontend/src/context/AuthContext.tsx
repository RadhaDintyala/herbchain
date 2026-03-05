import { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<any>;
    register: (name: string, email: string, password: string, role: string) => Promise<any>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        if (token) {
            axios.defaults.headers.common["x-auth-token"] = token;
        }
        setLoading(false);
    }, [token]);

    const login = async (email: string, password: string) => {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
        const { token, user } = res.data;
        setToken(token);
        setUser(user);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        axios.defaults.headers.common["x-auth-token"] = token;
        return user;
    };

    const register = async (name: string, email: string, password: string, role: string) => {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const res = await axios.post(`${API_URL}/api/auth/register`, { name, email, password, role });
        const { token, user } = res.data;
        setToken(token);
        setUser(user);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        axios.defaults.headers.common["x-auth-token"] = token;
        return user;
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete axios.defaults.headers.common["x-auth-token"];
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
