import { GET_ALL_BOOTCAMPS } from './actions';
import { initialState } from './appContext'

const reducer = (state, action) => {
    switch(action.type) {
        case GET_ALL_BOOTCAMPS:
            return {
                ...state,
                bootcamps: action.payload,
                loading: false
            };
        // ... other case statements ...
        default:
            return state;
    }
}

export default reducer;