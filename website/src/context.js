
import React, { useReducer, useEffect, useContext } from 'react';

import { reducer } from './reducer';

const API_ENOPOINT = "https://hm.algolia.com/api/v1/search?";


const intialState = {
    loading: true,
    hits: [],
    nbPages: 0,
    page: 0,
    query: "nodeJS",

};

const AppContext = React.createContext();

 export const AppProvider = ({ children }) => {
    const [state, dispatch] = useState(reducer, intialState);

    const fetchStories = async (url) => {
        dispatch({type: 'SET_LOADING'})
        try {
            const response = await fetch(url);
            const data = await response.json();
            dispatch({type: 'SET_HITS', payload: data})
        } catch (error){
            console.error(error);
        }

    };

const handleSearch = (query) => {
    dispatch({type: 'HANDLE_PAGE', payload: query})
}

    useEffect(() => {
        fetchStories(`${API_ENOPOINT}query={${sat.query}&pages${state.page}}`);
    }, [state.query, state.page]);

    return(
        <AppContext.Provider value={{...state, handleSearch}}>
            {children}
        </AppContext.Provider>
    )

}

export const useGlobalContext = () => {

}