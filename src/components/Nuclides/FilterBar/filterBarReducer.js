// *****   Action types   *****

export const actionTypes = {
    FILTER_NUCLIDES: 'FILTER_NUCLIDES',
    CLEAR_FILTER: 'CLEAR_FILTER'
};

// *****   Initial state   *****

const initialState = {
    z: 0,
    n: 0,
    a: 0,
    modCount: 0
};

// *****   Reducer   *****

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case actionTypes.FILTER_NUCLIDES : return {...state, ...payload.data, modCount: state.modCount + 1};
        case actionTypes.CLEAR_FILTER : return {...state, z: 0, n: 0, a: 0, modCount: state.modCount + 1};

        default: return state;
    }
};

// *****   Action creators   *****

export const actionCreators = {
    //data = { z, n, a }
    filterNuclides: data => ({
        type: actionTypes.FILTER_NUCLIDES,
        payload: { data }
    }),
    clearFilter: () => ({
        type: actionTypes.CLEAR_FILTER
    })
};

// *****   State selectors   *****

export const stateSelectors = {
    getFilter: state => state.filter
};