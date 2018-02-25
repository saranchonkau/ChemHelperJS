import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import filterBarReducer from '../components/Nuclides/FilterBar/filterBarReducer';

export default combineReducers({
    form: formReducer,
    filter: filterBarReducer
});
