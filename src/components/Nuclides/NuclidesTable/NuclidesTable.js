import React, {Component} from 'react';
import { AgGridReact } from "ag-grid-react";
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-fresh.css';
import isElectron from 'is-electron';
import ReactPaginate from 'react-paginate';

const cellStyle = {
    fontSize: '16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    border: 'none'
};

class NuclidesTable extends Component {

    constructor(){
        super();
        this.state = {
            data: [],
            count: 0,
            currentPage: 0,
            sortModel: []
        };
        this.gridOptions = {
            columnDefs: [
                { unSortIcon: true, headerName: 'Z', field: 'z', width: 80, cellStyle: cellStyle},
                { unSortIcon: true, headerName: 'N', field: 'n', width: 80, cellStyle: cellStyle},
                { unSortIcon: true, headerName: 'Symbol', field: 'symbol', width: 130, cellStyle: cellStyle},
                { unSortIcon: true, headerName: 'A', field: 'atomic_mass', width: 170, cellStyle: cellStyle,
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
                this.setState({sortModel});
                this.loadData(this.state.page, sortModel);
            },
            icons: {
                sortAscending: '<i class="fa fa-sort-asc" style="color: black" />',
                sortDescending: '<i class="fa fa-sort-desc" style="color: black"/>',
                sortUnSort: '<i class="fa fa-sort" style="color: gray"/>',
            },
            enableColResize: true
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
            this.loadData();
            this.getCount();
        }
    }

    getCount = () => {
        window.ipcRenderer.send('countAll', 'select count(*) from nuclides');
    };

    loadData = (page = this.state.currentPage, sortModel = this.state.sortModel) => {
        let sortParam = sortModel.map(sort => `${sort.colId} ${sort.sort.toUpperCase()}`).join(', ');
        window.ipcRenderer.send('executeQuery',
            `select * from nuclides ${sortParam ? `order by ${sortParam}` : ''} limit ${page * 10}, 10`
        );
    };

    getTableHeight = () => 45 + this.state.data.length * 26;

    onGridReady = params => {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
    };

    handlePageClick = ({selected}) => {
        this.setState({currentPage: selected});
        this.loadData(selected);
    };

    render(){
        const {data} = this.state;
        return (
            <div className='w-100 py-4 px-4'>
                <div className="ag-theme-fresh " style={{width: 500, height: this.getTableHeight()}}>
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
        );
    }
}

export default NuclidesTable;