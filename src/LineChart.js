import React, { Component } from 'react';
import styled from 'styled-components';
import { media } from './style-utils';
import colors from './colors';
import Contents from './ChartContents';
import d3 from './d3';
import {
  AxisX, AxisY, Line, Label,
} from './ChartComponents';
import { getPlotData } from './DataHandler';


const MARGIN = {
  desktop: {
    top: 20, right: 20, bottom: 20, left: 50,
  },
  mobile: {
    top: 20, right: 20, bottom: 20, left: 50,
  },
};

const CANVAS_HEIGHT = {
  desktop: 300,
  mobile: 300,
};

export default class LineChart extends Component {
  constructor(props) {
    super(props);

    this.canvasWidth = 0;
    this.canvasheight = 300;
    this.ChartCanvas = React.createRef();

    this.state = {
      data: [],
      xScale: null,
      yScale: null,
      plotHeight: null,
      plotWidth: null,
    };
  }

  componentDidMount() {
    this.determineWidth();
    d3.csv('milledRiceEndingStocks.csv', d => ({
      Year: d.Year,
      Vietnam: d.Vietnam,
      India: d.India,
      Thailand: d.Thailand,
    })).then(data => this.setState({
      data,
    }, this.updateChartSize(data)));
  }

  updateChartSize(data) {
    this.setState((prevState) => {
      const { plotWidth } = prevState;
      return {
        xScale: this.updateX(data, plotWidth, 'Year'),
        yScale: this.updateY(data),
      };
    }, window.addEventListener('resize', this.determineWidth.bind(this)));
  }

  determineWidth() {
    const { data } = this.state;
    const { viewType } = this.props;
    const nodeWidth = this.ChartCanvas.current.getBoundingClientRect().width;
    const plotWidth = nodeWidth - MARGIN[viewType].left;
    const plotHeight = CANVAS_HEIGHT[viewType] - (MARGIN[viewType].top + MARGIN[viewType].bottom);
    this.setState({
      plotWidth,
      plotHeight,
      xScale: this.updateX(data, plotWidth, 'Year'),
      yScale: this.updateY(data),
    });
  }

  updateX(data, plotWidth, keyName) {
    const scaleData = data.map(d => +d[keyName]);
    const dataPoint = {
      min: d3.min(scaleData),
      max: d3.max(scaleData),
    };
    const scale = d3.scaleLinear()
      .domain([dataPoint.min, dataPoint.max]).range([0, plotWidth])
      .nice();
    return scale;
  }


  updateY(data) {
    const { plotHeight } = this.state;
    const scaleData = [].concat(...data.map(d => [+d.Vietnam, +d.India, +d.Thailand]));
    const dataPoint = {
      min: d3.min(scaleData),
      max: d3.max(scaleData),
    };
    const scale = d3.scaleLinear()
      .domain([dataPoint.min, dataPoint.max]).range([plotHeight, 0])
      .nice();
    return scale;
  }

  render() {
    const {
      data, xScale, yScale, plotHeight,
    } = this.state;
    const { viewType } = this.props;
    const columns = ['India', 'Thailand', 'Vietnam'];
    const x = MARGIN[viewType].left;

    return (
      <div>
        <Header>
          {Contents.headline}
        </Header>
        <Deck>
          {Contents.deck}
        </Deck>
        <Wrapper>
          <Chart innerRef={this.ChartCanvas} height={CANVAS_HEIGHT[viewType]}>
            { data.length > 0 && (
            <SVGCanvas>
              <AxisX
                x={x}
                y={plotHeight}
                xScale={xScale}
                ticksNum={5}
              />
              <AxisY
                x={x}
                y="0"
                yScale={yScale}
                ticksNum={5}
              />
              {columns.map(column => (
                <Line
                  key={column}
                  x={x}
                  y="0"
                  xScale={xScale}
                  yScale={yScale}
                  strokeColor={colors[column]}
                  plotData={getPlotData(data, column)}
                />
              ))}
            </SVGCanvas>
            )
          }

          </Chart>
          <Legend height={plotHeight}>
            {columns.map(column => (
              <Label
                key={column}
                title={column}
                strokeColor={colors[column]}
              />
            ))
            }
          </Legend>
        </Wrapper>
      </div>
    );
  }
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row-wrap;
  ${media.handheld`
    width: 100vw;
    flex-direction: column-reverse
     flex-flow: column-wrap;
  `}
`;

const SVGCanvas = styled.svg`
  // margin-right: ${MARGIN.desktop.top}px;
  width: 100%;
  height: 100%;
  ${media.handheld`
  `}
`;

const Header = styled.h1`
  font-size : 21px;
`;

const Deck = styled.p`
  font-size : 16px;
  line-height : 21px;
`;

const Chart = styled.div`
  width: 83%;
  height: ${props => `${props.height}px`};
   ${media.handheld`
    width: 100%;`}
`;


const Legend = styled.div`
  width: 17%;
  height: ${props => `${props.height}px`};
  display: flex;
  flex-direction: column;
   ${media.handheld`
    width: 100%;
    flex-direction: row;
    height: 80px;
    `}
`;
