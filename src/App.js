import React, { Component } from 'react';
import styled from 'styled-components';
import LineChart from './LineChart';


const CHART_WIDTH = 750;

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      viewType: 'desktop',
    };
  }

  componentDidMount() {
    this.updateDeviceView();
    window.addEventListener('resize', this.updateDeviceView.bind(this));
  }

  updateDeviceView() {
    const device = (window.innerWidth <= CHART_WIDTH ? 'mobile' : 'desktop');
    this.setState({ viewType: device });
  }

  render() {
    const { viewType } = this.state;
    return (
      <Wrapper>
        <LineChart
          viewType={viewType}
        />
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center';
  max-width: 750px;
`;
