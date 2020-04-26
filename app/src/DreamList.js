import React, { Component } from 'react';

class DreamList extends Component {
  state = {
    dreamList: []
  };

  async componentDidMount() {
    const response = await fetch('/.netlify/functions/dreams');
    const dreamList = await response.json();
    this.setState({dreamList});
  }

  render() {
    return (
      <div className="DreamList">
        <h3>All my dreams</h3>
        <ul>
        {this.state.dreamList.map(dream =>
          <li key={dream.id}>{dream.title}</li>
        )}
        </ul>
      </div>
    );
  }
}

export default DreamList;
