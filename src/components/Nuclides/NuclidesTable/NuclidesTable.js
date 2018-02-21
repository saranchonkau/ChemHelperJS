import React, {Component} from 'react';
import { AgGridReact } from "ag-grid-react";
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-fresh.css';
import isElectron from 'is-electron';

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
            data: []
        };
        this.gridOptions = {
            columnDefs: [
                { unSortIcon: true, headerName: 'Z', field: 'z', width: 60, cellStyle: cellStyle},
                { unSortIcon: true, headerName: 'N', field: 'n', width: 60, cellStyle: cellStyle},
                { unSortIcon: true, headerName: 'Symbol', field: 'symbol', width: 100, cellStyle: cellStyle},
                { unSortIcon: true, headerName: 'A', field: 'atomic_mass', width: 120, cellStyle: cellStyle,
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
                console.log('Params: ', params);
                console.log('SortModel: ', params.api.getSortModel());
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
            window.ipcRenderer.send('selectFirst10');
            window.ipcRenderer.on('selectFirst10', (event, result) => {
                console.log('Event: ', event);
                console.log('Result: ', result);
                this.setState({data: result});
            });
        }
    }

    getTableHeight = dataLength => 45 + this.state.data.length * 26;

    onGridReady = params => {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        // this.gridApi.sizeColumnsToFit();
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
            </div>
        );
    }
}

export default NuclidesTable;