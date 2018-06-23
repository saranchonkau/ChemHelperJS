import React from 'react';
import Dialog, {
    DialogContent,
    DialogTitle,
} from 'material-ui/Dialog';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import CloseButton from "../../Others/CloseButton";
import Table, { TableBody } from 'material-ui/Table';
import {withStyles} from "material-ui";
import Row from './Row';
import {bindActionCreators} from 'redux';
import {actionCreators, stateSelectors} from "./nuclideDetailsReducer";

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
        case 'eV': return 'eV';
        case 'keV': return 'keV';
        case 'MeV': return 'MeV';
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
};

const NuclidesDetails = ({open, nuclide, closeNuclideDetails}) => (
    <Dialog open={open} onClose={closeNuclideDetails}>
        <DialogTitle>
            <div className='d-flex justify-content-between align-items-center'>
                Nuclide details
                <CloseButton onClick={closeNuclideDetails}/>
            </div>
        </DialogTitle>
        <DialogContent>
            <Table>
                <TableBody>
                    <Row header={<div>Nuclide ID</div>} value={nuclide.nucid}/>
                    <Row header={<div>Number of protons, Z</div>} value={nuclide.z}/>
                    <Row header={<div>Number of neutrons, N</div>} value={nuclide.n}/>
                    <Row header={<div>Symbol</div>} value={nuclide.symbol}/>
                    <Row header={<div>J<sup><i>&pi;</i></sup></div>} value={nuclide.jp}
                         tooltip={'Angular momentum and parity of the state. Values between round brackets are uncertain, values between square brackets are assumed from theory.'}/>
                    <Row header={<div>T<sub>1/2</sub></div>}
                         value={getHalfLife(nuclide.half_life, nuclide.half_life_unc, nuclide.half_life_unit)}
                         tooltip={<div>Half-life of the state (or STABLE ). Some states report the total width Γ in eV, keV, or MeV. The following relation holds: T<sub>1/2</sub>(s) ≅ ℏ X ln2 / Γ = 4.562 10<sup>22</sup>/Γ(MeV).</div>}
                    />
                    <Row header={<div>T<sub>1/2</sub> [s]</div>} value={nuclide.half_life_sec}
                         tooltip={<div>Half-life converted into seconds. For the conversion, one year is 365.24219878 days, and one eV = 6.58211889e<sup>-16</sup> log(2). No rounding to the original value precision is made.</div>}
                    />
                    <Row header={<div>Mass Excess [keV]</div>}
                         value={handleValue(nuclide.mass_excess, nuclide.mass_excess_unc)}
                         tooltip={<div>Difference between the Atomic Mass, expressed in AMU, and A. The Mass Excess is expressed in keV, given that 1 AMU = 931 494.061 ± 0.021 keV.</div>}
                    />
                    <Row header={<div>Abundance [mole fraction]</div>}
                         value={handleValue(nuclide.abundance, null, '%')}
                         tooltip={<div>Isotopic abundance (mole-fraction)</div>}
                    />
                    <Row header={<div>Binding/A [keV]</div>}
                         value={handleValue(nuclide.binding, nuclide.binding_unc)}
                         tooltip={'Binding energy per nucleon. The Binding energy is the energy required to separate all protons and neutron from the nuclide.'}
                    />
                    <Row header={<div>Atomic Mass [μ AMU]</div>}
                         value={handleValue(nuclide.atomic_mass, nuclide.atomic_mass_unc)}
                         tooltip={<div>Mass given in micro Atomic Mass Units [AMU]. The AMU is defined as one twelfth of the mass of an atom of <sup>12</sup>C in its nuclear and electronic ground state.</div>}
                    />
                    <Row header={<div>S<sub>n</sub> [keV]</div>}
                         value={handleValue(nuclide.sn, nuclide.sn_unc, 'keV')}
                         tooltip={'Separation energy. The energy needed to remove one neutron from a nuclide'}
                    />
                    <Row header={<div>S<sub>p</sub> [keV]</div>}
                         value={handleValue(nuclide.sp, nuclide.sp_unc, 'keV')}
                         tooltip={'Separation energy. The energy needed to remove one proton from a nuclide'}
                    />
                    <Row header={<div>Charge radius R [fm]</div>}
                         value={handleValue(nuclide.radii_val, null, 'fm')}
                         tooltip={'Root-mean-square of the nuclear charge radius, expressed in fm'}
                    />
                    <Row header={<div>Q<sub><i>&beta;</i><sup>&mdash;</sup></sub> [keV]</div>}
                         value={handleValue(nuclide.beta_decay_en, nuclide.beta_decay_en_unc, 'keV')}
                         tooltip={<div>Energy available for <i>&beta;</i><sup>&ndash;</sup> decay. <i>&beta;</i><sup>&ndash;</sup> decay is emission of an electron and an anti-neutrino. A neutron inside the nucleus is transformed into a proton.</div>}
                    />
                    <Row header={<div>Q<sub><i>&alpha;</i></sub> [keV]</div>}
                         value={handleValue(nuclide.qa, nuclide.qa_unc, 'keV')}
                         tooltip={<div>Energy available for <i>&alpha;</i> decay. <i>&alpha;</i> decay is alpha particle emission (<sup>4</sup>He nucleus)</div>}
                    />
                    <Row header={<div>Q<sub>EC</sub></div>}
                         value={handleValue(nuclide.qec, nuclide.qec_unc, 'keV')}
                         tooltip={<div>Energy available for EC decay. EC(electron capture) decay is capture of one orbital electron by the the nucleus. A proton inside the nucleus is transformed into a neutron plus a neutrino.</div>}
                    />
                    <Row header={<div>Q [barn]</div>}
                         value={handleValue(nuclide.el_mom, null, 'barn')}
                         tooltip={<div><b>Electric Quadrupole Moment Q</b>. Second multipole expansion of the nucleus electric moment. Measured in barns.</div>}
                    />
                    <Row header={<div>Capture σ [barn]</div>}
                         value={handleValue(nuclide.ther_capture, null, 'barn')}
                         tooltip={'Thermal neutron capture cross section'}
                    />
                    <Row header={<div>Westcott g factor</div>}
                         value={handleValue(nuclide.westcott_g)}
                    />
                    <Row header={<div>Capture resonance integral [barn]</div>}
                         value={handleValue(nuclide.resonance_integ)}
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
    state => ({...stateSelectors.getNuclideState(state)}),
    dispatch => bindActionCreators(actionCreators, dispatch)
)(NuclidesDetails);