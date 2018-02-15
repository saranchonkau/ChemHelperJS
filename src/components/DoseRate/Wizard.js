import React from 'react';
import CalibrationTable from './CalibrationTable';
import CalibrationChart from './CalibrationChart';
import FinalTable from './FinalTable';
import FinalChart from './FinalChart';
import PagesManager from '../Others/PagesManager';

export default PagesManager({pages: [
        CalibrationTable,
        CalibrationChart,
        FinalTable,
        FinalChart
    ]});