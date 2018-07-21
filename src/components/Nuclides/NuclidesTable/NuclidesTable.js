import React, {Component} from 'react';
import { AgGridReact } from "ag-grid-react";
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-fresh.css';
import isElectron from 'is-electron';
import ReactPaginate from 'react-paginate';
import {cellStyle, suppressProps} from "../../App/StyleConstants";
import {connect} from 'react-redux';
import {getParam, getWhereParam, removeNull} from "../../../utils/query";
import '../../App/table.css';
import {stateSelectors} from "../FilterBar/filterBarReducer";
import {bindActionCreators} from "redux";
import {actionCreators} from "../NuclideDetails/nuclideDetailsReducer";

class NuclidesTable extends Component {

    constructor(){
        super();
        this.state = {
            data: [],
            count: 0,
            currentPage: 0,
            sortModel: [{colId: 'z', sort: 'asc'}, {colId: 'n', sort: 'asc'}]
        };
        this.gridOptions = {
            columnDefs: [
                { unSortIcon: true, headerName: 'ID', field: 'nucid', width: 90, cellStyle: cellStyle, ...suppressProps, suppressSorting: true},
                { unSortIcon: true, headerName: 'Z', field: 'z', width: 80, cellStyle: cellStyle, ...suppressProps, sort: 'asc'},
                { unSortIcon: true, headerName: 'N', field: 'n', width: 80, cellStyle: cellStyle, ...suppressProps, sort: 'asc'},
                { unSortIcon: true, headerName: 'Symbol', field: 'symbol', width: 130, cellStyle: cellStyle, ...suppressProps},
                { unSortIcon: true, headerName: 'A', field: 'atomic_mass', width: 170, cellStyle: cellStyle, ...suppressProps, suppressSorting: true,
                    valueFormatter: params => {
                        let A = Number.parseFloat(params.value);
                        if (Number.isNaN(A)) {
                            return params.value;
                        } else {
                            return (A/1000000).toString(10)
                        }
                    }
                }
            ],
            enableSorting: true,
            onSortChanged: params => {
                const sortModel = params.api.getSortModel();
                console.log('SORT MODEL CHANGED: ', sortModel);
                this.setState({sortModel, currentPage: 0});
                this.requestData(this.configureQuery({sort: sortModel, filter: this.props.filter}));
            },
            onRowClicked: ({data}) => {
                console.log('Data: ', data);
                this.props.openNuclideDetails(data)},
            icons: {
                sortAscending: '<i class="fa fa-sort-asc" style="color: black" />',
                sortDescending: '<i class="fa fa-sort-desc" style="color: black"/>',
                sortUnSort: '<i class="fa fa-sort" style="color: gray"/>',
            },
            headerHeight: 50,
            rowHeight: 30
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

    configureQuery = ({sort = this.state.sortModel, page = 0, filter = {}} ) => {
        const sortParam = sort.map(obj => `${obj.colId} ${obj.sort.toUpperCase()}`).join(', ');
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
            sort: this.state.sortModel,
            filter: this.props.filter,
            page: selected
        }));
    };

    getTableHeight = () => 64 + 10 * 30.5;

    onGridReady = params => {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
    };

    render(){
        const {data} = this.state;
        return (
            <div className='w-100 d-flex justify-content-center py-3 px-3'>
                <div style={{width: 590}}>
                    <h2 className='text-center'>Database of nuclides</h2>
                    <div className="ag-theme-blue " style={{height: this.getTableHeight()}}>
                        <AgGridReact
                            rowData={data}
                            onGridReady={this.onGridReady}
                            gridOptions={this.gridOptions}
                        />
                    </div>
                    <ReactPaginate previousLabel={"Previous"}
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