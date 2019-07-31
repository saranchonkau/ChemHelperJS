// *****   Action types   *****

export const actionTypes = {
    OPEN_NUCLIDE_DETAILS: 'OPEN_NUCLIDE_DETAILS',
    CLOSE_NUCLIDE_DETAILS: 'CLOSE_NUCLIDE_DETAILS',
};

// *****   Initial state   *****

const initialState = {
    nuclide: {},
    open: false
};

// *****   Reducer   *****

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case actionTypes.OPEN_NUCLIDE_DETAILS: return { nuclide: payload.nuclide, open: true };
        case actionTypes.CLOSE_NUCLIDE_DETAILS: return { nuclide: {}, open: false };
        default: return state;
    }
};

// *****   Action creators   *****

export const actionCreators = {
    openNuclideDetails: nuclide => ({
        type: actionTypes.OPEN_NUCLIDE_DETAILS,
        payload: { nuclide }
    }),
    closeNuclideDetails: () => ({
        type: actionTypes.CLOSE_NUCLIDE_DETAILS
    })
};

// *****   State selectors   *****

export const stateSelectors = {
    getNuclideState: state => state.nuclide
};