import React, { Component } from 'react';
import Map from './Map.jsx';
import SearchPanel from './SearchPanel.jsx';
import ViewRecordPanel from './ViewRecordPanel.jsx';
import Spacer from './reusable/Spacer.jsx';

class App extends Component {
  render() {
    return (
      <div className="flex-row height-100">
        <Map />
        <SearchPanel />
        <Spacer grow />
        <ViewRecordPanel />
      </div>
    );
  }
}

export default App;
