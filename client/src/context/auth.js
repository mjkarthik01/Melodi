import axios from "axios";
import { useState, useContext, createContext, useEffect } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
    initialized: false,
  });

  axios.defaults.headers.common["Authorization"] = auth?.token;
  useEffect(() => {
    const data = localStorage.getItem("auth");

    if (data) {
      const parseData = JSON.parse(data);

      setAuth({
        user: parseData.user,
        token: parseData.token,
        initialized: true,
      });
    } else {
      setAuth({
        user: null,
        token: "",
        initialized: true,
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("auth", JSON.stringify(auth));
  }, [auth]);
  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);
export { useAuth, AuthProvider };
