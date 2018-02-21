import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import AccountCircle from 'material-ui-icons/AccountCircle';
import Menu, { MenuItem } from 'material-ui/Menu';
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
                        {/*<IconButton className={classes.menuButton} color="inherit" aria-label="Menu">*/}
                            {/*<MenuIcon />*/}
                        {/*</IconButton>*/}
                        <Typography variant="title" color="inherit" className={classes.flex}>ChemHelper</Typography>
                        <Typography variant="title" color="inherit" className={classes.flex}>
                            <NavLink to={'/'} exact style={{color: 'white'}} activeStyle={{color: 'red'}}>Main</NavLink>
                        </Typography>
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
                        <div>
                            <IconButton
                                aria-owns={open ? 'menu-appbar' : null}
                                aria-haspopup="true"
                                onClick={this.handleMenu}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={open}
                                onClose={this.handleClose}
                            >
                                <MenuItem onClick={this.handleClose}>Profile</MenuItem>
                                <MenuItem onClick={this.handleClose}>My account</MenuItem>
                            </Menu>
                            </div>
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