import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List from 'material-ui/List';
import FormulaItem from './FormulaItem';

const styles = theme => ({
    root: {
        marginRight: 5,
        height: '100%',
        width: '100%',
        maxWidth: 250,
        backgroundColor: theme.palette.background.paper,
        boxShadow: '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
    },
    nested: {
        paddingLeft: theme.spacing.unit * 4,
    },
});

class FormulaList extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <List component="nav">
                    <FormulaItem title={'Nuclear chemistry'}/>
                    <FormulaItem title={'Radiation chemistry'}
                                 children={[
                                     {title: 'Radiation chemistry yield', link: '/formula/yield'}
                                 ]}
                    />
                    <FormulaItem title={'Dosimetry'}/>
                </List>
            </div>
        );
    }
}

FormulaList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FormulaList);