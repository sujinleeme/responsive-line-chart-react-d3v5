import React, { Component } from 'react';
import styled from 'styled-components';
import d3 from './d3';
import colors from './colors';

const D3blackbox = d3render => class Blackbox extends Component {
  componentDidMount() {
    d3render.call(this);
  }

  componentDidUpdate() {
    d3render.call(this);
  }

  render() {
    const { x, y } = this.props;

    return <g transform={`translate(${x}, ${y})`} ref="anchor" />;
  }
};

export const AxisX = D3blackbox(function () {
  const { ticksNum = 5, xScale } = this.props;
  const axis = d3.axisBottom(xScale).ticks(ticksNum);
  d3.select(this.refs.anchor).call(axis);
});

export const AxisY = D3blackbox(function () {
  const { ticksNum, yScale } = this.props;
  const axis = d3.axisLeft(yScale).ticks(ticksNum);
  d3.select(this.refs.anchor).call(axis);
});

export const Line = ({
  x, xScale, yScale, plotData, strokeColor,
}) => {
  const path = d3
    .line()
    .x(d => xScale(d.x))
    .y(d => yScale(d.y));

  const d = path(plotData);
  return (
    <Path
      strokeColor={strokeColor}
      transform={`translate(${x}, 0)`}
      d={d}
    />
  );
};

export const Label = ({ title }) => (
  <LabelBox>
    <svg width="50%">
      <LabelLine x1="0" y1="50%" x2="50%" y2="50%" stroke={colors[title]} />
    </svg>
    <LabelText>
      {title}
    </LabelText>
  </LabelBox>
);

const LabelLine = styled.line`
  stroke-width:2;
`;

const LabelBox = styled.div`
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

const LabelText = styled.span`
  width: 50%;
  font-family : 'CuratorBold', sans-serif;
  font-size : 13px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Path = styled.path`
  fill: none;
  stroke: ${props => props.strokeColor};
  stroke-width: 2px;
`;
