import React, { useReducer, useContext } from "react";
import reducer from "./reducer";
import axios from "axios";
import { GET_ALL_BOOTCAMPS_STARTS,GET_ALL_BOOTCAMPS_DONE,GET_ALL_BOOTCAMPS_FAILED } from "./actions";

const initialState = {
  count: 0,
  data:[],
  pagination:{},
  isLoading: false,
};


const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  let url = "http://localhost:5000";


  const authFetch = axios.create({
    baseURL: `${url}/api/v1`
});


  const login = async (email, password) => {
    try {
      const data = await axios.post(`${url}/api/v1/auth/login`, {
        email,
        password,
      });
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  const getBootcamps = async (page, limit) => {
    dispatch({ type: GET_ALL_BOOTCAMPS_STARTS });
    const fetchUrl = `${url}/api/v1/bootcamps?page=${page}`;
    try {
      console.log("This is the fetch url : ", fetchUrl);
      const { data } = await authFetch(fetchUrl);
      dispatch({ type: GET_ALL_BOOTCAMPS_DONE, payload:data });
    } catch (error) {
      dispatch({ type: GET_ALL_BOOTCAMPS_FAILED, payload: { error: error.message } });
      console.log(error);
    }
}

  return (
    <AppContext.Provider value={{ ...state, getBootcamps, login }}>
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider, initialState, useAppContext };
