import React, { Component } from 'react';
import TextInput from './reusable/TextInput';
import Button from './reusable/Button';

class SearchPanel extends Component {
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
        <TextInput placeholder="Search by text..." />
        <div className="flex-spacer" />
        <div className="">
          <button>TEMPORAL EXTENT</button>
        </div>
        <div className="flex-spacer" />
        <div className="flex-col">
          <div className="highlight-panel search-result">Search result</div>
        </div>
      </div>
    );
  }
}

export default SearchPanel;
