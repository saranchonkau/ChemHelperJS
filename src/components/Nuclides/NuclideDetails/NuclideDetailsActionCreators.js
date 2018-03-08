export const openNuclideDetails = nuclide => ({
    type: 'NUCLIDE_DETAILS_OPEN',
    nuclide
});

export const closeNuclideDetails = () => ({ type: 'NUCLIDE_DETAILS_CLOSE' });