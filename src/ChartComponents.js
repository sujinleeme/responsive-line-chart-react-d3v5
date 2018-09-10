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


export const ToolTipBox = () => (
  <Rect />
);

export const ToolTipLine = D3blackbox(() => {
  // const { ticksNum = 5, xScale, yScale } = this.props;
  // const path = d3
  //   .line()
  //   .x1(d => xScale(d['Year']))
  //   .y(d => yScale(d.y))
  // const axis = d3.line(xScale)
  // d3.select(this.refs.anchor).call(axis);
});


export const Line = ({
  show, x, xScale, yScale, plotData, strokeColor,
}) => {
  const path = d3
    .line()
    .x(d => xScale(d.x))
    .y(d => yScale(d.y));
  const d = path(plotData);
  return (
    <g>
      {show && (
      <Path
        strokeColor={strokeColor}
        transform={`translate(${x}, 0)`}
        d={d}
      />
      )}
    </g>
  );
};

export const Legend = ({ title, show, value="", onSettingChange }) => (
  <LabelBox>
    <InnerLabel
      onClick={onSettingChange}
    >
      <Svg>
        <LabelLine
          show={show}
          x1="0"
          y1="50%"
          x2="50%"
          y2="50%"
          stroke={colors[title]}
        />
      </Svg>
      <LabelText
        show={show}
      >
        {title}
      </LabelText>
      <LabelText
        show={show}
      >
        {value}
      </LabelText>
    </InnerLabel>
  </LabelBox>
);


const Svg = styled.svg`
  width: 30%;
`
const Rect = styled.rect`
  background: red;
  width: 30px;
  height: 30px;
`;
const LabelLine = styled.line`
  stroke-width: 2
  opacity: ${props => props.show ? 1 : 0.5};
  )};
`;

const LabelBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const InnerLabel = styled.div`
  height: 15px;
  margin: auto;
  display: flex;
  justify-content: center;
  cursor: pointer;
`;

const LabelText = styled.span`
  width: 70%;
  font-family : 'CuratorBold', sans-serif;
  font-size : 13px;
  display: flex;
  flex-direction: column;
  justify-InnerLabel: center;
  font-weight: ${props => props.show ? 'bold ' : 'normal !important'};
`;

const Path = styled.path`
  fill: none;
  stroke: ${props => props.strokeColor};
  stroke-width: 2px;
  transition: d 0.5s;
`;

const HoverLine = styled.line`
`;
