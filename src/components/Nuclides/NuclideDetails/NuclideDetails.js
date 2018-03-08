import React from 'react';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {closeNuclideDetails} from "./NuclideDetailsActionCreators";
import CloseButton from "../../Others/CloseButton";
import Table, { TableBody } from 'material-ui/Table';
import {withStyles} from "material-ui";
import Row from './Row';

const getHalfLifeUnit = half_life_unit => {
    switch (half_life_unit) {
        case 'm': return 'minutes';
        case 's': return 'seconds';
        case 'ms': return 'milliseconds';
        case 'us': return 'microseconds';
        case 'ns': return 'nanoseconds';
        case 'ps': return 'picoseconds';
        case 'as': return 'attoseconds';
        case 'Y': return 'years';
        case 'd': return 'days';
        case 'h': return 'hours';
        case 'eV': return 'electron-volts';
        case 'keV': return 'kiloelectron-volts';
        case 'MeV': return 'megaelectron-volts';
        default: return '';
    }
};

const getHalfLife = (half_life, half_life_unc, half_life_unit) => {
    if (half_life === 'STABLE') {
        return 'Stable';
    }
    // TODO Half-Life-Uncertainty
    return handleValue(half_life, null, getHalfLifeUnit(half_life_unit));
    // else if (half_life !== null) {
    //     return `${handleValue(half_life, half_life_unc)} ${getHalfLifeUnit(half_life_unit)}`
    // } else {
    //     return null;
    // }
};

const handleValue = (value, uncertainty, unit) => {
    let result = `${value || ''}`;
    if (uncertainty && result) {
        result = `${result} \xB1 ${uncertainty}`;
    }
    if (unit && result) {
        result = `${result} ${unit}`;
    }
    return result || null;
    // if (value !== null && uncertainty !== null) {
    //     return `${value} &#177; ${uncertainty}`;
    // } else if (value !== null) {
    //     return value;
    // } else {
    //     return null;
    // }
};

const NuclidesDetails = ({open, nuclide, onClose}) => (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>
            <div className='d-flex justify-content-between align-items-center'>
                Nuclide details
                <CloseButton onClick={onClose}/>
            </div>
        </DialogTitle>
        <DialogContent>
            <Table>
                <TableBody>
                    <Row header={'Nuclide ID'} value={nuclide.nucid} tooltip={'ID'}/>
                    <Row header={'Atomic number'} value={nuclide.z}/>
                    <Row header={'Neutrons count'} value={nuclide.n}/>
                    <Row header={'Symbol'} value={nuclide.symbol}/>
                    <Row header={'Spin, parity (Jp)'} value={nuclide.jp} tooltip={'Angular momentum and parity of the state.'}/>
                    <Row header={'Half-Life'}
                         value={getHalfLife(nuclide.half_life, nuclide.half_life_unc, nuclide.half_life_unit)}
                    />
                    <Row header={'Half-Life (in seconds)'} value={nuclide.half_life_sec}/>
                    <Row header={'Mass Excess'}
                         value={handleValue(nuclide.mass_excess, nuclide.mass_excess_unc, 'kiloelectron-volts')}
                         tooltip={'Difference between the Atomic Mass, expressed in AMU, and A'}
                    />
                    <Row header={'Binding/A'}
                         value={handleValue(nuclide.binding, nuclide.binding_unc,  'kiloelectron-volts')}
                         tooltip={'Binding energy per nucleon. The Binding energy is the energy required to separate all protons and neutron from the nuclide.'}
                    />
                    <Row header={'Atomic Mass'}
                         value={handleValue(nuclide.atomic_mass, nuclide.atomic_mass_unc)}
                         tooltip={'Mass given in micro Atomic Mass Units [\xB5AMU]. The AMU is defined as one twelfth of the mass of an atom of 12C in its nuclear and electronic ground state'}
                    />
                    <Row header={'Sn'}
                         value={handleValue(nuclide.sn, nuclide.sn_unc, 'keV')}
                         tooltip={'Separation energy. The energy needed to remove one neutron from a nuclide.'}
                    />
                    <Row header={'Sp'}
                         value={handleValue(nuclide.sp, nuclide.sp_unc, 'keV')}
                         tooltip={'Separation energy. The energy needed to remove one proton from a nuclide.'}
                    />
                </TableBody>
            </Table>
        </DialogContent>
    </Dialog>
);

NuclidesDetails.propTypes = {
    open: PropTypes.bool
};

export default connect(
    state => ({...state.nuclide}),
    dispatch => ({
        onClose: () => dispatch(closeNuclideDetails())
    })
)(NuclidesDetails);