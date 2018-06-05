import React, { Component } from 'react';
import { connect } from 'react-redux';
import TextInput from './reusable/TextInput.jsx';
import Button from './reusable/Button.jsx';
import { setTextFilter, updateSearchResults } from './redux/actions';

class SearchPanel extends Component {
  constructor(props) {
    super(props);
  }
  componentWillReceiveProps() {}

  render() {
    return (
      <div className="pos-relative width-25 flex-col standard-panel">
        <div className="flex-row">
          <Button className="flex-grow" badge={23}>
            DATASETS
          </Button>
          <Button className="flex-grow" badge={3}>
            SERIES
          </Button>
          <Button className="flex-grow" badge={43}>
            SERVICES
          </Button>
          <Button className="flex-grow" badge={532}>
            FEATURES
          </Button>
        </div>
        <div className="flex-spacer" />
        <TextInput
          placeholder="Search by text..."
          onChange={this.props.setTextFilter}
        />
        <div className="flex-spacer" />
        <div className="">
          <Button className="flex-grow">TEMPORAL EXTENT</Button>
        </div>
        <div className="flex-spacer" />
        <div className="flex-col">
          <div className="highlight-panel search-result">Search result</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    filters: state.searchFilters
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setTextFilter: text => {
      dispatch(setTextFilter(text));
      dispatch(updateSearchResults());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchPanel);
