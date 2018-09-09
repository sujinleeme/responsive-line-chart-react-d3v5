import React, { Component } from 'react';
import styled from 'styled-components';
import ReactDOM from 'react-dom';
import { media } from './style-utils';
import colors from './colors';
import Contents from './ChartContents';
import d3 from './d3';
import {
  AxisX, AxisY, Line, Legend, ToolTipLine, ToolTipBox,
} from './ChartComponents';
import {
  getPlotData, getLegends, addPlotData, removePlotData,
} from './DataHandler';


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
    this.ChartCanvas = React.createRef();

    this.state = {
      defaultData: [],
      plotData: [],
      xScale: null,
      yScale: null,
      plotHeight: null,
      plotWidth: null,
      isShow: {
        India: true,
        Thailand: true,
        Vietnam: true,
      },
      toolTip: false,
      legends: [],
    };
    this.onPlotDataChange = this.onPlotDataChange.bind(this);
    this.drawToolTip = this.drawToolTip.bind(this);
    this.showToolTip = this.showToolTip.bind(this);
    this.moveToolTip = this.moveToolTip.bind(this);
  }

  componentDidMount() {
    this.onPlotWidthChange();
    d3.csv('milledRiceEndingStocks.csv', d => ({
      Year: d.Year,
      Vietnam: d.Vietnam,
      India: d.India,
      Thailand: d.Thailand,
    })).then(data => this.setState({
      defaultData: data,
      plotData: data,
      legends: getLegends(data.columns, 'Year'),
    }, this.onChartSizeChange(data)));
  }

  onChartSizeChange(data) {
    const { plotWidth } = this.state;
    this.setState({ xScale: this.scaleX(data, plotWidth, 'Year'), yScale: this.scaleY(data) },
      window.addEventListener('resize', this.onPlotWidthChange.bind(this)));
  }

  onAxisChange() {
    const { plotData, plotWidth, isShow } = this.state;
    const selections = Object.values(isShow).filter(Boolean).length;
    if (selections === 0) { return; }
    this.setState({
      xScale: this.scaleX(plotData, plotWidth, 'Year'),
      yScale: this.scaleY(plotData),
    });
  }

  drawToolTip(showTooltip, pos, data) {
    const props = { showTooltip, pos, data };
    ReactDOM.render(<ToolTipBox {...props} />, document.getElementById('tooltip'));
  }
  
  moveToolTip() {
    const { xScale } = this.state;
    // var x0 = xScale.invert(d3.mouse(this)[0])
    console.log(xScale.invert);
      // i = bisectDate(data, x0, 1),
      // d0 = data[i - 1],
      // d1 = data[i],
      // d = x0 - d0.date > d1.date - x0 ? d1 : d0;
  }

  showToolTip() {
    this.setState(prevState => ({
      toolTip: !prevState.toolTip,
    }));
  }

  scaleX(data, plotWidth, keyName) {
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

  scaleY(data) {
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

  onPlotDataChange(countryName) {
    const { defaultData, plotData, isShow } = this.state;
    const show = !isShow[countryName];
    const data = (show ? addPlotData(plotData, defaultData, countryName)
      : removePlotData(plotData, countryName));

    this.setState({
      plotData: data,
      isShow: {
        ...isShow,
        [countryName]: show,
      },
    }, this.onAxisChange);
  }

  onPlotWidthChange() {
    const { plotData } = this.state;
    const { viewType } = this.props;
    const nodeWidth = this.ChartCanvas.current.getBoundingClientRect().width;
    const plotWidth = nodeWidth - MARGIN[viewType].left;
    const plotHeight = CANVAS_HEIGHT[viewType] - (MARGIN[viewType].top + MARGIN[viewType].bottom);
    this.setState({
      plotWidth,
      plotHeight,
      xScale: this.scaleX(plotData, plotWidth, 'Year'),
      yScale: this.scaleY(plotData),
    });
  }

  render() {
    const {
      plotData, xScale, yScale, plotHeight, isShow, legends,
      toolTip,
    } = this.state;
    const { viewType } = this.props;
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
            <Text>Thousand metric tonnes</Text>
            { plotData.length > 0 && (
            <SVGCanvas
              onMouseEnter={this.showToolTip}
              onMouseLeave={this.showToolTip}
              onMouseMove={this.moveToolTip}
            >
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
              <svg id="tooltip">
                {toolTip && (<ToolTipBox />) }
              </svg>
              {legends.map(legend => (
                <Line
                  key={legend}
                  x={x}
                  y="0"
                  show={isShow[legend]}
                  xScale={xScale}
                  yScale={yScale}
                  strokeColor={colors[legend]}
                  plotData={getPlotData(plotData, 'Year', legend)}
                />
              ))}
            </SVGCanvas>
            )
          }
          </Chart>
          <LegendContainer height={plotHeight/2}>
            <Text>Click to hide/show</Text>
            {legends.map(legend => (
              <Legend
                key={legend}
                title={legend}
                strokeColor={colors[legend]}
                show={isShow[legend]}
                onSettingChange={() => this.onPlotDataChange(legend)}
              />
            ))
            }
          </LegendContainer>
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


const LegendContainer = styled.div`
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

const Text = styled.span`
    font-size: 13px;
    color: #333333;
`
