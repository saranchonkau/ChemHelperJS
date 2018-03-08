import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import filterBarReducer from '../components/Nuclides/FilterBar/filterBarReducer';
import nuclideDetailsReducer from '../components/Nuclides/NuclideDetails/nuclideDetailsReducer';

export default combineReducers({
    form: formReducer,
    filter: filterBarReducer,
    nuclide: nuclideDetailsReducer
});