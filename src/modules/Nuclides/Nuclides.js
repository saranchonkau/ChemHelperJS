import React, { useState } from 'react';
import styled from 'styled-components';

import Header from 'components/Header';

import FilterBar from './components/FilterBar';
import NuclidesTable from './components/NuclidesTable';
import NuclideDetails from './components/NuclideDetails';

const initialFilter = {
  z: '',
  n: '',
  a: '',
};

const Nuclides = () => {
  const [filter, setFilter] = useState(initialFilter);
  const [nuclide, setNuclide] = useState(null);

  console.log('filter', filter);
  return (
    <>
      <Header />
      <Main>
        <FilterBar setFilter={setFilter} />
        <NuclidesTable filter={filter} openNuclideDetails={setNuclide} />
        {nuclide && (
          <NuclideDetails nuclide={nuclide} onClose={() => setNuclide(null)} />
        )}
      </Main>
    </>
  );
};

const Main = styled.div`
  display: flex;
  align-content: stretch;
`;

export default Nuclides;
