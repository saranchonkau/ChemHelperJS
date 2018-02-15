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

class FormulaGroup extends Component {
    constructor(){
        super();
        this.state = {
            open: false
        }
    }

    handleClick = () => this.setState(prevState => ({open: !prevState.open}));

    render(){
        const { title, items, classes } = this.props;
        return (
            <React.Fragment>
                <ListItem button onClick={this.handleClick}>
                    <ListItemText primary={title} />
                    {
                        !!items && items.length > 0 &&
                        (this.state.open ? <ExpandLess /> : <ExpandMore />)
                    }
                </ListItem>
                {
                    !!items && items.length > 0 &&
                    <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {
                                items.map(({title, link}, index) => (
                                    <NavLink exact to={link} key={index}>
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

FormulaGroup.propTypes = {
    title: PropTypes.string.isRequired,
    items: PropTypes.array
};

export default withStyles(styles)(FormulaGroup);