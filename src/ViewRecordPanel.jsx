import React, { Component } from 'react';
import { connect } from 'react-redux';
import Spacer from './reusable/Spacer.jsx';
import Button from './reusable/Button.jsx';
import { closeRecord } from './redux/actions.js';

class ViewRecordPanel extends Component {
  renderRecord(record) {
    if (!record) return <div />;
    return Object.keys(record).map(key => {
      return (
        <div>
          <div className="highlight-panel">
            {key}:<br />
            {JSON.stringify(record[key])}
          </div>
          <Spacer />
        </div>
      );
    });
  }

  render() {
    const attrs = {
      className:
        'pos-relative flex-col standard-panel scroll-y view-record-panel ' +
        (this.props.opened
          ? 'view-record-panel-opened '
          : 'view-record-panel-closed ')
    };

    return (
      <div {...attrs}>
        <div className="flex-no-shrink">
          <Button onClick={this.props.closeViewedRecord}>CLOSE RECORD</Button>
        </div>
        <Spacer no-shrink />
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
  error: null,
  opened: false
};

const mapStateToProps = (state, ownProps) => {
  return {
    record: state.viewedRecord,
    searching: state.viewedRecordUuid && !state.viewedRecord,
    error: state.recordLoadError,
    opened: !!state.viewedRecordUuid
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    closeViewedRecord: () => {
      dispatch(closeRecord());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewRecordPanel);
