import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Menu, { MenuItem } from '@material-ui/core/Menu';
import styles from './HeaderStyles';
import {NavLink} from 'react-router-dom';
import isElectron from 'is-electron';

class Header extends React.Component {
    state = {
        anchorEl: null,
    };

    handleMenu = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    render() {
        const { classes } = this.props;
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);

        return (
            <div className={classes.root}>
                <AppBar position="static" className={classes.root}>
                    <Toolbar>
                        <Typography variant="title" color="inherit" className={classes.flex}>ChemHelper</Typography>
                        <Typography variant="title" color="inherit" className={classes.flex}>
                            <NavLink to={'/formula'} style={{color: 'white'}} activeStyle={{color: 'red'}}>
                                Formula
                            </NavLink>
                        </Typography>
                        <Typography variant="title" color="inherit" className={classes.flex}>
                            <NavLink to={'/nuclides'} exact style={{color: 'white'}} activeStyle={{color: 'red'}}>
                                Nuclides
                            </NavLink>
                        </Typography>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

Header.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Header);