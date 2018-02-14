import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Collapse, List, ListItem, ListItemText, withStyles} from "material-ui";
import {ExpandLess, ExpandMore} from "material-ui-icons";
import {NavLink} from "react-router-dom";

const styles = theme => ({
    nested: {
        paddingLeft: theme.spacing.unit * 4,
    },
});


class FormulaItem extends Component {
    constructor(){
        super();
        this.state = {
            open: false
        }
    }

    handleClick = () => this.setState(prevState => ({open: !prevState.open}));

    render(){
        const { title, children, classes } = this.props;
        return (
            <React.Fragment>
                <ListItem button onClick={this.handleClick}>
                    <ListItemText primary={title} />
                    {
                        !!children && children.length > 0 &&
                        (this.state.open ? <ExpandLess /> : <ExpandMore />)
                    }
                </ListItem>
                {
                    !!children && children.length > 0 &&
                    <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {
                                children.map(({title, link}) => (
                                    <NavLink exact to={link}>
                                        <ListItem button className={classes.nested}>
                                            <ListItemText primary={title} />
                                        </ListItem>
                                    </NavLink>
                                ))
                            }
                        </List>
                    </Collapse>
                }
            </React.Fragment>
        );
    }
}

FormulaItem.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.array
};

export default withStyles(styles)(FormulaItem);