import React, { useReducer, useContext } from "react";
import reducer from "./reducer";
import axios from "axios";
import { GET_ALL_BOOTCAMPS } from "./actions";

const initialState = {
  bootcamps: [],
};


const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  let url = "http://localhost:5000";


  const authFetch = axios.create({
    baseUrl:'/api/v1'
  })


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

  const getBootcamps = async (filters) => {
    const { select, sort, page, limit } = filters; // destructuring other filters too
    console.log("This is the filters : ",select, sort, page, limit)
    url = url + "/api/v1/bootcamps"
    // Append field selection parameter if it exists
    if (select) {
      url += `select=${select}&`;
    }
  
    // Append sorting parameter if it exists
    if (sort) {
      url += `sort=${sort}&`;
    }
  
    // Append pagination parameters if they exist
    if (page) {
      url += `page=${page}&`;
    }
    if (limit) {
      url += `limit=${limit}&`;
    }

    // Remove the trailing '&' if it exists
    if (url.endsWith('&')) {
      url = url.slice(0, -1);
    }
  
    dispatch({ type: GET_ALL_BOOTCAMPS }); // Assuming this dispatch type exists in your context
  
    try {
      console.log("This is the fetch url : ",url);
      const { data } = await authFetch(url);
      console.log(data);
    } catch (error) {
      console.log(error)
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
