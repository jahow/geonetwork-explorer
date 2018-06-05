import React, { Component } from 'react';
import { connect } from 'react-redux';

class ViewRecordPanel extends Component {
  render() {
    return (
      <div className="pos-relative width-33 flex-col standard-panel scroll-y">
        {this.props.searching
          ? 'Searching...'
          : JSON.stringify(this.props.record)}
      </div>
    );
  }
}

ViewRecordPanel.defaultProps = {
  record: null,
  searching: false
};

const mapStateToProps = (state, ownProps) => {
  return {
    record: state.viewedRecord,
    searching: state.viewedRecordUuid && !state.viewedRecord
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewRecordPanel);
