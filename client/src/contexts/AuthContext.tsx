import {
  type FC,
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import { AxiosError } from "axios";
import { toast } from "sonner";

import { proxyAPIGateway } from "@api/gateway";

import type { FormValues, LogInResponse, UserFromToken } from "@lib/types";

interface Props {
  children: ReactNode;
}

interface AuthContextValues {
  onLogIn: (values: FormValues) => Promise<void>;
  onLogOut: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  user?: UserFromToken;
}

const AuthContext = createContext<AuthContextValues>({
  onLogIn: async () => {},
  onLogOut: async () => {},
  isAuthenticated: false,
  isAdmin: false,
  isLoading: false,
});

export const useAuthContext = (): AuthContextValues => useContext(AuthContext);

export const AuthContextProvider: FC<Props> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<UserFromToken>();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const isAdmin = user?.role === "ADMIN" || user?.role === "SYSTEM";

  const onLogIn = async (values: FormValues) => {
    try {
      setIsLoading(true);
      const {
        data: { user: currentUser, authenticated },
      } = await proxyAPIGateway.post<FormValues, { data: LogInResponse }>("/login", values);

      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(authenticated);
        navigate("/dashboard");
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.error(error);
      toast.error(error.response?.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onLogOut = async () => {
    const {
      data: { authenticated },
    } = await proxyAPIGateway.post<void, { data: Pick<LogInResponse, "authenticated"> }>("/logout");

    if (!authenticated) {
      setIsAuthenticated(false);
      navigate("/login");
    }
  };

  useEffect(() => {
    const getCurrentToken = async () => {
      try {
        setIsLoading(true);
        const {
          data: { user: currentUser, authenticated },
        } = await proxyAPIGateway.post<LogInResponse>("/refresh");

        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(authenticated);
        }
      } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        console.warn("Unauthorized: ", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getCurrentToken();
  }, []);

  return (
    <AuthContext.Provider value={{ onLogIn, onLogOut, user, isLoading, isAdmin, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
