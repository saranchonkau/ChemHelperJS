const initialState = {
    nuclide: {},
    open: false
};

const nuclideDetailsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'NUCLIDE_DETAILS_OPEN': return { nuclide: action.nuclide, open: true };
        case 'NUCLIDE_DETAILS_CLOSE': return { nuclide: {}, open: false };
        default: return state;
    }
};

export default nuclideDetailsReducer;