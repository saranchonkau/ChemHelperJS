import React from 'react';
import FilterBar from './FilterBar';
import NuclidesTable from './NuclidesTable';
import Header from '../Header';
import NuclideDetails from './NuclideDetails';

const Nuclides = () => (
    <React.Fragment>
        <Header/>
        <main className='d-flex align-content-stretch'>
            <FilterBar/>
            <NuclidesTable/>
            <NuclideDetails/>
        </main>
    </React.Fragment>
);

export default Nuclides;