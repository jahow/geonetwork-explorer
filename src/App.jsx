import React, { Component } from "react";
import Map from "./Map";
import SearchPanel from "./SearchPanel";
import ViewRecordPanel from "./ViewRecordPanel";
import Spacer from "./reusable/Spacer";

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
