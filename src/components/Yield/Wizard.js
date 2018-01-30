import React, { Component } from 'react';
import { last, initial, concat } from 'lodash';
import Header from '../Header';
import {connect} from 'react-redux';
import { destroy } from 'redux-form';
import Yield from './Yield';
import Chart from './Chart';

class Counter {
    constructor(initialCount){
        this.count = initialCount;
    }
    next = () => {
        this.count += 1;
        return this.count;
    }
}
class Wizard extends Component {
    constructor() {
        super();
        this.state = {
            page: 1,
            pageHistory: [1]
        };
    }

    // componentDidMount(){
    //     this.props.clearForms();
    // }

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
        const { page } = this.state;
        const counter = new Counter(0);
        const pageProps = { previousPage: this.previousPage, nextPage: this.nextPage };
        return (
            // TODO something with it (through array)
            <div>
                <Header/>
                {page === counter.next() && <Yield nextPage={this.nextPage}/>}
                {page === counter.next() && <Chart nextPage={this.nextPage} previousPage={this.previousPage}/>}
            </div>
        )
    }
}

export default connect(
    null,
    dispatch => ({
        clearForms: () => {
            dispatch(destroy('Wizard'));
        }
    })
)(Wizard);