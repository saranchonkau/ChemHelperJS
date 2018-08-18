import React, {Component} from 'react';
import isElectron from 'is-electron';
import ReactPaginate from 'react-paginate';
import {connect} from 'react-redux';
import {getParam, getWhereParam, removeNull} from "../../../utils/query";
import {stateSelectors} from "../FilterBar/filterBarReducer";
import {bindActionCreators} from "redux";
import {actionCreators} from "../NuclideDetails/nuclideDetailsReducer";
import {nuclidesTableColumnDefs, SortTypes} from "../../../constants";
import Grid from "../../Grid/Grid";

class NuclidesTable extends Component {

    constructor(){
        super();
        this.state = {
            data: [],
            count: 0,
            currentPage: 0,
        };
    }

    componentDidMount(){
        if (isElectron()) {
            window.ipcRenderer.on('queryResponse', (event, result) => {
                this.setState({data: result});
            });
            window.ipcRenderer.on('countAll', (event, results) => {
                this.setState({ count: results[0]['count(*)'] });
            });
            const query = this.configureQuery({filter: this.props.filter});
            this.requestData(query);
            this.requestCount(query);
        }
    }

    componentWillReceiveProps(nextProps){
        if (this.props.filter.modCount !== nextProps.filter.modCount) {
            this.setState({page: 0});
            const query = this.configureQuery({filter: nextProps.filter});
            this.requestData(query);
            this.requestCount(query);
        }
    }

    onSortChanged = newSortModel => {
        this.setState({ currentPage: 0 });
        this.requestData(this.configureQuery({sort: newSortModel, filter: this.props.filter}));
    };

    onRowClick = rowData => this.props.openNuclideDetails(rowData);

    getSortParam = columnIndex => nuclidesTableColumnDefs[columnIndex].field;

    configureQuery = ({sort = this.api.getSortModel(), page = 0, filter = {}} ) => {
        const sortParam = sort.map(obj => `${this.getSortParam(obj.columnIndex)} ${obj.sort.toUpperCase()}`).join(', ');
        const pageParam = `limit ${page * 10}, 10`;
        const filterParam = this.configureFilterParam(filter);
        return removeNull([
            filterParam,
            sortParam && `order by ${sortParam}`,
            pageParam
        ]).join(' ');
    };

    requestCount = (query = '') => window.ipcRenderer.send('countAll', `select count(*) from nuclides ${query}`);

    requestData = (query = '') => window.ipcRenderer.send('executeQuery', `select * from nuclides ${query}`);

    configureFilterParam = filter => {
        return getWhereParam([
            getParam('z', filter.z),
            getParam('n', filter.n),
            getParam('z + n', filter.a)
        ]);
    };

    handlePageClick = ({selected}) => {
        this.setState({currentPage: selected});
        this.requestData(this.configureQuery({
            sort: this.api.getSortModel(),
            filter: this.props.filter,
            page: selected
        }));
    };

    onGridReady = api => {
        this.api = api;
    };

    render(){
        return (
            <div className='w-100 d-flex justify-content-center py-3 px-3'>
                <div>
                    <h2 className='text-center'>Database of nuclides</h2>
                    <Grid data={this.state.data}
                          options={{
                              columnDefs: nuclidesTableColumnDefs,
                              onSortChanged: this.onSortChanged,
                              onRowClick: this.onRowClick
                          }}
                          defaultSortModel={[
                              { columnIndex: 1, sort: SortTypes.ASC },
                              { columnIndex: 2, sort: SortTypes.ASC }
                          ]}
                          onGridReady={this.onGridReady}
                    />
                    <ReactPaginate
                        previousLabel={"Previous"}
                        nextLabel={"Next"}
                        breakLabel={<span className='page-link'>...</span>}
                        breakClassName={"page-item"}
                        pageCount={Math.ceil(this.state.count / 10)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        forcePage={this.state.currentPage}
                        onPageChange={this.handlePageClick}
                        containerClassName={"pagination mt-2"}
                        activeClassName={"active"}
                        pageClassName={'page-item'}
                        pageLinkClassName={'page-link'}
                        previousClassName={'page-item'}
                        nextClassName={'page-item'}
                        previousLinkClassName={'page-link'}
                        nextLinkClassName={'page-link'}
                    />
                </div>
            </div>
        );
    }
}

export default connect(
    state => ({ filter: stateSelectors.getFilter(state) }),
    dispatch => bindActionCreators(actionCreators, dispatch)
)(NuclidesTable);