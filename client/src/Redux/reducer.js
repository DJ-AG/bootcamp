import { GET_ALL_BOOTCAMPS_STARTS,GET_ALL_BOOTCAMPS_DONE,GET_ALL_BOOTCAMPS_FAILED } from './actions';
import { initialState } from './appContext'

const reducer = (state, action) => {
    switch(action.type) {
        case GET_ALL_BOOTCAMPS_STARTS:
            return {
                ...state,  
                isLoading: true
            };
            case GET_ALL_BOOTCAMPS_DONE:
                return {
                    ...state,
                    data: action.payload.data,
                    pagination: action.payload.pagination,
                    isLoading: false
                };
        case GET_ALL_BOOTCAMPS_FAILED:
            return {
                ...state,
                isLoading: false,
                error: action.payload.error
            };
        default:
            return state;
    }
}

export default reducer;