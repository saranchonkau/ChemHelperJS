import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './grid.css';
import Header from "./Header";
import Row from "./Row";
import {SortTypes} from "../../constants";
import get from 'lodash/get';
import v4 from 'uuid/v4';

class Grid extends Component {

    constructor(props){
        super(props);
        this.state = {
            data: props.data.map(row => ({ rowId: v4(), ...row })),
            sortModel: props.defaultSortModel,
            shiftPressed: false,
        };
    }

    componentDidMount(){
        this.props.onGridReady(this.getApi());
        document.addEventListener('keydown', this.handleShiftKeyDown);
        document.addEventListener('keyup', this.handleShiftKeyUp);
    }

    componentWillUnmount(){
        document.removeEventListener('keydown', this.handleShiftKeyDown);
        document.removeEventListener('keyup', this.handleShiftKeyUp);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.data !== this.props.data) {
            this.setState({ data: this.props.data.map(row => ({ rowId: v4(), ...row })) });
        }
    }

    handleShiftKeyDown = event => event.keyCode === 16 && !this.state.shiftPressed && this.setState({ shiftPressed: true });

    handleShiftKeyUp = event => event.keyCode === 16 && this.setState({ shiftPressed: false });

    getApi = () => ({
        removeRow: this.removeRow,
        toggleSelection: this.toggleSelection,
        getRowData: this.getRowData,
        getSortModel: this.getSortModel,
        createRow: this.createRow,
        updateCell: this.updateCell,
        sortColumn: this.sortColumn
    });

    updateCell = ({ rowId, field, newValue }) => {
        const rowIndex = this.state.data.findIndex(row => row.rowId === rowId);
        this.setState(prevState => ({
            data: [
                ...prevState.data.slice(0, rowIndex),
                { ...prevState.data[rowIndex], [field]: newValue },
                ...prevState.data.slice(rowIndex + 1)
            ]
        }))
    };

    getNextSortType = sortType => {
        switch(sortType){
            case SortTypes.DESC: return SortTypes.ASC;
            case SortTypes.ASC: return SortTypes.NONE;
            case SortTypes.NONE: return SortTypes.DESC;
        }
    };

    sortColumn = columnIndex => {
        const currentColumnSort = this.state.sortModel.find(model => model.columnIndex === columnIndex);
        const nextSortType = this.getNextSortType(get(currentColumnSort, 'sort', SortTypes.NONE));

        const newSortModelElement = { columnIndex, sort: nextSortType };

        let updatedSortModel;
        // sortModel = [{ columnIndex, sort }, ...]
        if (this.state.shiftPressed) {
            if (currentColumnSort) {
                const filteredSortModel = this.state.sortModel.filter(model => model.columnIndex !== columnIndex);
                updatedSortModel = [...filteredSortModel, newSortModelElement];
            } else {
                updatedSortModel = [...this.state.sortModel, newSortModelElement];
            }
        } else {
            updatedSortModel = [newSortModelElement];
        }

        const finalSortModel = updatedSortModel.filter(model => model.sort !== SortTypes.NONE);

        const sortCallback = () => {
            const { onSortChanged } = this.props.options;
            onSortChanged && onSortChanged(finalSortModel);
        };

        this.setState({sortModel: finalSortModel}, sortCallback);
    };

    getComparatorBySortType = (sortType, field) => {
        switch(sortType) {
            case SortTypes.ASC: return (a, b) => a[field] - b[field];
            case SortTypes.DESC: return (a, b) => b[field] - a[field];
        }
    };

    getSortedData = () => {
        return [...this.state.sortModel].reverse()
            .reduce((data, currentModel) => {
                const { field } = this.props.options.columnDefs[currentModel.columnIndex];
                return data.sort(this.getComparatorBySortType(currentModel.sort, field));
            }, [...this.state.data]);
    };

    getRowData = () => this.state.sortModel.length ? this.getSortedData() : this.state.data;

    getSortModel = () => this.state.sortModel;

    createRow = row => {
        const newRow = { rowId: v4(), ...row };
        this.setState(prevState => ({ data: [...prevState.data, newRow] }));
    };

    removeRow = rowId => {
        const rowIndex = this.state.data.findIndex(row => row.rowId === rowId);
        this.setState(prevState => ({
            data: [
                ...prevState.data.slice(0, rowIndex),
                ...prevState.data.slice(rowIndex + 1)
            ]
        }));
    };

    toggleSelection = rowId => {
        this.setState(prevState => {
            const updatedData = prevState.data.map((element, index) => {
                if (element.rowId === rowId) {
                    return {...element, isSelected: !element.isSelected}
                }
                return element;
            });

            return { data: updatedData }
        });
    };

    getGridTemplateColumns = () => {
        const template = this.props.options.columnDefs
            .map(definition => `${definition.width}px`)
            .join(' ');
        return { gridTemplateColumns: template };
    };

    getGridWidth = () => this.props.options.columnDefs.reduce((sum, current) => sum + current.width, 0);

    renderRow = (data, index) => {
        return (
            <Row
                columnDefs={this.props.options.columnDefs}
                data={data}
                key={data.rowId}
                style={this.getGridTemplateColumns()}
                api={this.getApi()}
                onRowClick={this.props.options.onRowClick}
            />
        );
    };

    render(){
        const data = this.state.sortModel.length ? this.getSortedData() : this.state.data;
        return (
            <div className='grid' style={{width: this.getGridWidth()}}>
                <Header columnDefs={this.props.options.columnDefs}
                        sortModel={this.state.sortModel}
                        api={this.getApi()}
                        style={this.getGridTemplateColumns()}
                />
                { data.map(this.renderRow) }
            </div>
        );
    }
}

Grid.propTypes = {
    data: PropTypes.array.isRequired,
    options: PropTypes.shape({
        columnDefs: PropTypes.arrayOf(PropTypes.shape({
            headerName: PropTypes.string,
            field: PropTypes.string,
            type: PropTypes.string,
            editable: PropTypes.bool,
            parse: PropTypes.func,
            format: PropTypes.func,
            normalize: PropTypes.func
        })).isRequired,
        onSortChanged: PropTypes.func,
        onRowClick: PropTypes.func
    }).isRequired,
    onGridReady: PropTypes.func,
    defaultSortModel: PropTypes.arrayOf(PropTypes.shape({
        columnIndex: PropTypes.number,
        sort: PropTypes.string
    }))
};

Grid.defaultProps = {
    defaultSortModel: []
};

export default Grid;