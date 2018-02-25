const initialState = {
    z: 0,
    n: 0,
    a: 0,
    modCount: 0
};

const hadleFilterData = ({z, n, a}) => {
    const data = {...initialState};
    data.z = Number.parseInt(z, 10) || 0;
    data.n = Number.parseInt(n, 10) || 0;
    data.a = Number.parseInt(a, 10) || 0;
    return data;
};

const filterBarReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FILTER_NUCLIDES': return {...hadleFilterData(action.data), modCount: state.modCount + 1};
        default: return state;
    }
};

export default filterBarReducer;