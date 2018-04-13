import React, {Component} from 'react';
import style from './App.style'
import Firebase from '../../firebase/Firebase'
import {
  Charts,
  ChartContainer,
  ChartRow,
  YAxis,
  LineChart,
  AreaChart,
  EventMarker
} from "react-timeseries-charts";
import {TimeSeries} from "pondjs";

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      tracker: null,
      trackerValues: "-- knots",
      trackerEvent: null,
      markerMode: "flag"
    }
  }

  unwindDictionary(data) {
    let array = [];

    if (data != null) {
      Object
        .keys(data)
        .forEach(key => {
          let value = data[key];
          array.push({
            ...value,
            key: key
          });
        });
    }
    return array;
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    let columns = [];
    columns.push('time');
    Firebase
      .database()
      .ref('/buoys/2320627075/')
      .on('value', entries => {
        entries = this.unwindDictionary(entries.val());
        let points = [];
        entries.forEach(entry => {

          Object.keys(entry).forEach(key => {
            if (!columns.find(k => k === key) && key !== 'key') {
              columns.push(key);
            }
          });

          let point = [];
          columns.forEach(key => {
            // eslint-disable-next-line
            entry[key] ? point.push(entry[key]) : null;
          });
          points.push(point);
        });

        let data = {
          name: "wind",
          columns: columns,
          points: points
        };

        let series = new TimeSeries(data);
        this.setState({
          series,
          timerange: series.range()
        });
      });
  }

  handleTimeRangeChange = (timerange) => {
    this.setState({ timerange })
  }

  handleTrackerChanged = t => {
    if (t) {
      const e = this.state.series.atTime(t);
      const eventTime = e.begin();
      const values = {
        Avg_Wind: `${e.get("Avg_Wind")} knots`,
        Gust: `${e.get("Gust")} knots`,
        Water_Temp: `${e.get("Water_Temp")}C`,
      }
      this.setState({
        tracker: eventTime,
        trackerValues: values,
        trackerEvent: e
      });
    } else {
      this.setState({ tracker: null, trackerValuess: null, trackerEvent: null });
    }
  };

  renderMarker = () => {
    if (!this.state.tracker) {
      return <g/>;
    }

    return (
      <EventMarker
        type="flag"
        axis="axis"
        event={this.state.trackerEvent}
        column="Avg_Wind"
        info={[
          { label: "Wind", value: this.state.trackerValues.Avg_Wind},
          { label: "Gust", value: this.state.trackerValues.Gust},
          { label: "Water Temp", value: this.state.trackerValues.Water_Temp},
        ]}
        infoTimeFormat="%H:%M"
        infoWidth={120}
        infoHeight={55}
        markerRadius={2}
        markerStyle={{
          fill: "black"
        }}
      />
    );

  };

  render() {
    let {series, timerange} = this.state;
    if (series) {
      return (
        <ChartContainer
          timeRange={timerange}
          width={1000}
          enablePanZoom={true}
          onTimeRangeChanged={this.handleTimeRangeChange}
          onTrackerChanged={this.handleTrackerChanged}
        >
          <ChartRow height="200">
            <YAxis id="axis" label="Wind Speed" max={30} width="60" type="linear"/>
            <Charts>
              <AreaChart
                style={style}
                axis="axis"
                series={series}
                columns={{
                up: ["Avg_Wind"]
              }}/>
              <LineChart style={style} axis="axis" series={series} columns={["Gust"]}/> 
              {this.renderMarker()}
            </Charts>
          </ChartRow>
        </ChartContainer>
      );
    } else {
      return ("Loading...")
    }
  }
}

export default App;
