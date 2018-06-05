import React, { Component } from 'react';
import { connect } from 'react-redux';
import TextInput from './reusable/TextInput.jsx';
import ButtonBar from './reusable/ButtonBar.jsx';
import Button from './reusable/Button.jsx';
import {
  setTextFilter,
  updateSearchResults,
  setViewedRecord,
  loadViewedRecord,
  setResultType
} from './redux/actions';
import Spacer from './reusable/Spacer.jsx';
import { GEONETWORK_URL } from './constants.js';

class SearchPanel extends Component {
  constructor(props) {
    super(props);
    this.onRecordViewRequest = this.onRecordViewRequest.bind(this);
    this.onRecordExternalViewRequest = this.onRecordExternalViewRequest.bind(
      this
    );
    this.props.setTextFilter('');
  }

  onRecordViewRequest(record) {
    this.props.viewRecord(record.uuid);
  }

  onRecordExternalViewRequest(record) {
    window.open(`${GEONETWORK_URL}/metadata/${record.uuid}`);
  }

  render() {
    return (
      <div className="pos-relative width-25 flex-col standard-panel">
        <ButtonBar vertical>
          <Button
            className="flex-grow"
            badge={this.props.resultTypes.dataset || '0'}
            toggled={this.props.filters.type === 'dataset'}
            onClick={() => this.props.setResultType('dataset')}
          >
            DATASETS
          </Button>
          <Button
            className="flex-grow"
            badge={this.props.resultTypes.series || '0'}
            toggled={this.props.filters.type === 'series'}
            onClick={() => this.props.setResultType('series')}
          >
            SERIES
          </Button>
          <Button
            className="flex-grow"
            badge={this.props.resultTypes.service || '0'}
            toggled={this.props.filters.type === 'service'}
            onClick={() => this.props.setResultType('service')}
          >
            SERVICES
          </Button>
          <Button
            className="flex-grow"
            badge={this.props.resultTypes.feature || '0'}
            toggled={this.props.filters.type === 'feature'}
            onClick={() => this.props.setResultType('feature')}
          >
            FEATURES
          </Button>
        </ButtonBar>
        <Spacer />
        <TextInput
          placeholder="Search by text..."
          onChange={this.props.setTextFilter}
        />
        <Spacer />
        <div className="">
          <Button className="flex-grow">TEMPORAL EXTENT</Button>
        </div>
        <Spacer />
        <div className="scroll-y flex-col">
          {this.props.searchError && (
            <div className="error-panel">{this.props.searchError}</div>
          )}
          {this.props.records.map(record => (
            <div key={record.uuid}>
              <div className="highlight-panel search-result">
                <div>{record.title}</div>
                <div className="flex-row">
                  <Button onClick={() => this.onRecordViewRequest(record)}>
                    OPEN
                  </Button>
                  <Spacer />
                  <Button
                    onClick={() => this.onRecordExternalViewRequest(record)}
                  >
                    VIEW IN GEONETWORK
                  </Button>
                </div>
              </div>
              <Spacer />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

SearchPanel.defaultProps = {
  records: [],
  resultTypes: {},
  searching: false,
  filters: {},
  searchError: null
};

const mapStateToProps = (state, ownProps) => {
  return {
    filters: state.searchFilters,
    records: state.records,
    searching: state.searching,
    resultTypes: state.resultTypes,
    searchError: state.searchError
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setTextFilter: text => {
      dispatch(setTextFilter(text));
      dispatch(updateSearchResults());
    },
    viewRecord: uuid => {
      dispatch(setViewedRecord(uuid));
      dispatch(loadViewedRecord());
    },
    setResultType: type => {
      dispatch(setResultType(type));
      dispatch(updateSearchResults());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchPanel);
