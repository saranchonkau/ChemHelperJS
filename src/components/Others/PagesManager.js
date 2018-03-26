import React, {Component} from 'react';
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

class Page {
    constructor(pageNumber, prevPage, nextPage){
        this.pageNumber = pageNumber;
        this.prevPage = prevPage;
        this.nextPage = nextPage;
    }

    getNextPage = () => this.nextPage;

    getPrevPage = () => this.prevPage;

    getNumber = () => this.pageNumber;

    setNextPage = nextPage => this.nextPage = nextPage;

    createNextPageAndLink = () => {
        this.nextPage = new Page(this.pageNumber + 1, this);
        return this.nextPage;
    };

    createNewPageAndLink = pageNumber => {
        this.nextPage = new Page(pageNumber, this);
        return this.nextPage;
    };
}

const PagesManager = ({pages}) => {
    return withStyles(styles)(
        class extends Component {
            constructor() {
                super();
                this.state = {
                    page: new Page(0),
                };
                this.pages = this.putProps(pages);
            }

            putProps = pages => {
                const pageProps = {
                    previousPage: this.previousPage,
                    nextPage: this.nextPage,
                    goToPage: this.goToPage,
                };
                return pages.map(page => {
                    const Page = page.component;
                    return <Page {...{...pageProps, ...page.props}}/>;
                })
            };

            nextPage = () => this.setState(prevState => ({ page: prevState.page.createNextPageAndLink() }));

            goToPage = pageNumber => this.setState(prevState => ({ page: prevState.page.createNewPageAndLink(pageNumber) }));

            previousPage = () => {
                this.setState((prevState) => {
                    const currentPage = prevState.page;
                    const prevPage = currentPage.getPrevPage();
                    currentPage.prevPage = null;
                    prevPage.nextPage = null;
                    return {
                        page: prevPage,
                    };
                });
            };

            render() {
                const {classes} = this.props;
                const { page } = this.state;
                return (
                    <div className={classes.root}>
                        {this.pages[page.getNumber()]}
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