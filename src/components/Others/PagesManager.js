import React, {Component} from 'react';
import {concat, initial, last} from "lodash";
import {withStyles} from "material-ui";
import PropTypes from 'prop-types';

const styles = theme => ({
    root: {
        width: '100%',
        height: '100%'
    },
    nested: {
        paddingLeft: theme.spacing.unit * 4,
    },
});

const PagesManager = ({pages}) => {
    return withStyles(styles)(
        class extends Component {
            constructor() {
                super();
                this.state = {
                    page: 0,
                    // TODO: linked list in future
                    pageHistory: [0]
                };
                this.pages = this.putProps(pages);
            }

            putProps = pages => {
                const pageProps = {
                    previousPage: this.previousPage,
                    nextPage: this.nextPage,
                };
                return pages.map(Page => <Page {...pageProps}/>);
            };

            nextPage = () => {
                this.setState((prevState) => (
                    {
                        page: prevState.page + 1,
                        pageHistory: concat(prevState.pageHistory, prevState.page + 1),
                    }
                ));
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
                return (
                    <div className={classes.root}>
                        {this.pages[page]}
                    </div>
                )
            }
        }
    )
};

PagesManager.propTypes = {
    pages: PropTypes.array.isRequired
};

export default PagesManager;