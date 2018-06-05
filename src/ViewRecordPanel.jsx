import React, { Component } from 'react';
import { connect } from 'react-redux';
import Spacer from './reusable/Spacer.jsx';

class ViewRecordPanel extends Component {
  renderRecord(record) {
    if (!record) return <div />;
    return Object.keys(record).map(key => {
      return (
        <div>
          <div class="highlight-panel">
            {key}:<br />
            {JSON.stringify(record[key])}
          </div>
          <Spacer />
        </div>
      );
    });
  }

  render() {
    return (
      <div className="pos-relative width-33 flex-col standard-panel scroll-y">
        {this.props.error ? (
          <div className="error-panel">{this.props.error}</div>
        ) : this.props.searching ? (
          'Searching...'
        ) : (
          this.renderRecord(this.props.record)
        )}
      </div>
    );
  }
}

ViewRecordPanel.defaultProps = {
  record: {},
  searching: false,
  error: null
};

const mapStateToProps = (state, ownProps) => {
  return {
    record: state.viewedRecord,
    searching: state.viewedRecordUuid && !state.viewedRecord,
    error: state.viewedRecord && state.viewedRecord.error
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewRecordPanel);
