import React, { Component } from 'react';
import { last, initial, concat } from 'lodash';
import {connect} from 'react-redux';
import { destroy } from 'redux-form';
import Yield from './Yield';
import Chart from './Chart';
import FinalTable from './FinalTable';
import FinalChart from './FinalChart';
import {withStyles} from "material-ui";

class Counter {
    constructor(initialCount){
        this.count = initialCount;
    }
    next = () => {
        this.count += 1;
        return this.count;
    }
}

const styles = theme => ({
    root: {

        height: '100%',
        // width: '100%',
        maxWidth: '70%',
        flex: '0 0 70%',
        backgroundColor: theme.palette.background.paper,
    },
    nested: {
        paddingLeft: theme.spacing.unit * 4,
    },
});

class Wizard extends Component {
    constructor() {
        super();
        this.state = {
            page: 1,
            pageHistory: [1]
        };
    }

    nextPage = () => {
        this.setState((prevState) => {
            return {
                page: prevState.page + 1,
                pageHistory: concat(prevState.pageHistory, prevState.page + 1),
            }
        });
    };

    skipNextPage = () => {
        this.setState((prevState) => ({
            page: prevState.page + 2,
            pageHistory: concat(prevState.pageHistory, prevState.page + 2)
        }));
    };

    previousPage = () => {
        this.setState((prevState) => {
            let newPageHistory = initial(prevState.pageHistory);
            return {
                page: last(newPageHistory),
                pageHistory: newPageHistory
            };
        });
    };

    render() {
        const {classes} = this.props;
        const { page } = this.state;
        const counter = new Counter(0);
        const pageProps = { previousPage: this.previousPage, nextPage: this.nextPage };
        return (
            // TODO something with it (through array)
            <div className={classes.root}>
                {/*<Header/>*/}
                {page === counter.next() && <Yield nextPage={this.nextPage}/>}
                {page === counter.next() && <Chart nextPage={this.nextPage} previousPage={this.previousPage}/>}
                {page === counter.next() && <FinalTable nextPage={this.nextPage} previousPage={this.previousPage}/>}
                {page === counter.next() && <FinalChart previousPage={this.previousPage}/>}
            </div>
        )
    }
}

export default withStyles(styles)(connect(
    null,
    dispatch => ({
        clearForms: () => {
            dispatch(destroy('Wizard'));
        }
    })
)(Wizard));