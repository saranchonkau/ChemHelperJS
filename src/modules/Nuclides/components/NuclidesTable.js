import React, { Component } from 'react';
import isElectron from 'is-electron';
import ReactPaginate from 'react-paginate';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Grid from 'components/Grid';

import { getParam, getWhereParam, removeNull } from 'utils/query';
import { sendMessage } from 'utils/ipc';

import { nuclidesTableColumnDefs, SortTypes } from 'constants/common';

class NuclidesTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      count: 0,
      currentPage: 0,
    };
  }

  componentDidMount() {
    if (isElectron()) {
      window.ipcRenderer.on('queryResponse', (event, result) => {
        this.setState({ data: result });
      });
      window.ipcRenderer.on('countAll', (event, results) => {
        this.setState({ count: results[0]['count(*)'] });
      });
      const query = this.configureQuery({ filter: this.props.filter });
      this.requestData(query);
      this.requestCount(query);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.filter !== nextProps.filter) {
      this.setState({ page: 0 });
      const query = this.configureQuery({ filter: nextProps.filter });
      this.requestData(query);
      this.requestCount(query);
    }
  }

  onSortChanged = newSortModel => {
    this.setState({ currentPage: 0 });
    this.requestData(
      this.configureQuery({ sort: newSortModel, filter: this.props.filter }),
    );
  };

  onRowClick = rowData => this.props.openNuclideDetails(rowData);

  getSortParam = columnIndex => nuclidesTableColumnDefs[columnIndex].field;

  configureQuery = ({
    sort = this.api.getSortModel(),
    page = 0,
    filter = {},
  }) => {
    const sortParam = sort
      .map(
        obj =>
          `${this.getSortParam(obj.columnIndex)} ${obj.sort.toUpperCase()}`,
      )
      .join(', ');
    const pageParam = `limit ${page * 10}, 10`;
    const filterParam = this.configureFilterParam(filter);
    return removeNull([
      filterParam,
      sortParam && `order by ${sortParam}`,
      pageParam,
    ]).join(' ');
  };

  requestCount = (query = '') =>
    sendMessage('countAll', `select count(*) from nuclides ${query}`);

  requestData = (query = '') =>
    sendMessage('executeQuery', `select * from nuclides ${query}`);

  configureFilterParam = filter => {
    return getWhereParam([
      getParam('z', filter.z),
      getParam('n', filter.n),
      getParam('z + n', filter.a),
    ]);
  };

  handlePageClick = ({ selected }) => {
    this.setState({ currentPage: selected });
    this.requestData(
      this.configureQuery({
        sort: this.api.getSortModel(),
        filter: this.props.filter,
        page: selected,
      }),
    );
  };

  onGridReady = api => {
    this.api = api;
  };

  render() {
    return (
      <Container>
        <div>
          <Title>Database of nuclides</Title>
          <StyledGrid
            data={this.state.data}
            options={{
              columnDefs: nuclidesTableColumnDefs,
              onSortChanged: this.onSortChanged,
              onRowClick: this.onRowClick,
            }}
            defaultSortModel={[
              { columnIndex: 1, sort: SortTypes.ASC },
              { columnIndex: 2, sort: SortTypes.ASC },
            ]}
            onGridReady={this.onGridReady}
          />
          <ReactPaginate
            previousLabel={'Previous'}
            nextLabel={'Next'}
            breakLabel={<span className="page-link">...</span>}
            breakClassName={'page-item'}
            pageCount={Math.ceil(this.state.count / 10)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            forcePage={this.state.currentPage}
            onPageChange={this.handlePageClick}
            containerClassName={'pagination mt-2'}
            activeClassName={'active'}
            pageClassName={'page-item'}
            pageLinkClassName={'page-link'}
            previousClassName={'page-item'}
            nextClassName={'page-item'}
            previousLinkClassName={'page-link'}
            nextLinkClassName={'page-link'}
          />
        </div>
      </Container>
    );
  }
}

NuclidesTable.propTypes = {
  filter: PropTypes.object.isRequired,
  openNuclideDetails: PropTypes.func.isRequired,
};

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0 2rem;

  .page-link {
    position: relative;
    display: block;
    padding: 0.5rem 0.75rem;
    margin-left: -1px;
    line-height: 1.25;
  }
  .page-item {
    color: #36304a;
    background-color: #fff;
    border: 1px solid #dee2e6;
    cursor: pointer;
  }
  .pagination {
    display: flex;
    padding-left: 0;
    list-style: none;
    border-radius: 0.25rem;
    margin-top: 1rem;
  }
  .active {
    cursor: default;
    z-index: 1;
    color: #fff;
    background-color: #36304a;
    font-weight: bold;
  }
`;

const StyledGrid = styled(Grid)`
  min-height: 450px;
  background-color: #e6e3e3;
`;

const Title = styled.header`
  font-size: 30px;
  margin: 2rem auto 1rem auto;
  text-align: center;
`;

export default NuclidesTable;
