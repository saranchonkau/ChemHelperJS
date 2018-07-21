import React from 'react';
import PropTypes from "prop-types";
import { TableCell, TableRow } from '@material-ui/core/Table';
import Tooltip from '@material-ui/core/Tooltip';
import {withStyles} from '@material-ui/core';

const styles = {
    body: {
        fontSize: 'inherit'
    },
    tooltip: {
        fontSize: 17
    }
};

const Row = ({header, value, tooltip, classes}) => (
    <React.Fragment>
        {
            value !== null &&
            <TableRow>
                <TableCell className={classes.body}>
                    { tooltip ?
                        <Tooltip title={tooltip} classes={{ tooltip: classes.tooltip }}>{header}</Tooltip> :
                        header
                    }
                </TableCell>
                <TableCell className={classes.body}>{value}</TableCell>
            </TableRow>
        }
    </React.Fragment>
);

Row.propTypes = {
    header: PropTypes.node.isRequired,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    tooltip: PropTypes.string
};

export default withStyles(styles)(Row);