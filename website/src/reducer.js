export const reducer = (state, action) => {
    switch(action.type){
        case 'SET_LOADING': return{
            ...state, 
            loading: true,

        }
        case 'SET_HITS': return{
                ...state,
                loading: false,
                hits: action.payload.hits,
                nbpages: action.payload.nbpages
        }
        default:
            throw new Error(`no matching "${action.type}" aciton type`);
    }
}