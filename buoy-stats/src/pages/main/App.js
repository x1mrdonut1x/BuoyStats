import React, { Component } from 'react';
import Firebase from '../../firebase/Firebase'
import './App.css';import {
  Charts,
  ChartContainer,
  ChartRow,
  YAxis,
  LineChart,
  AreaChart
} from "react-timeseries-charts";
import { TimeSeries } from "pondjs";

const style = {
  Avg_Wind: {
    line: {
      normal: {stroke: "steelblue", fill: "none", strokeWidth: 1},
      highlighted: {stroke: "#5a98cb", fill: "none", strokeWidth: 1},
      selected: {stroke: "steelblue", fill: "none", strokeWidth: 1},
      muted: {stroke: "steelblue", fill: "none", opacity: 0.4, strokeWidth: 1}
    },
    area: {
        normal: {fill: "steelblue", stroke: "none", opacity: 0.25},
        highlighted: {fill: "#5a98cb", stroke: "none", opacity: 0.25},
        selected: {fill: "steelblue", stroke: "none", opacity: 0.25},
        muted: {fill: "steelblue", stroke: "none", opacity: 0.25}
    }
  },
  Gust: {
      normal: {stroke: "green", fill: "none", strokeWidth: 1},
      highlighted: {stroke: "#5a98cb", fill: "none", strokeWidth: 1},
      selected: {stroke: "steelblue", fill: "none", strokeWidth: 1},
      muted: {stroke: "steelblue", fill: "none", opacity: 0.4, strokeWidth: 1}
  },
  Water_Temp: {
    normal: {stroke: "red", fill: "none", strokeWidth: 1},
    highlighted: {stroke: "#5a98cb", fill: "none", strokeWidth: 1},
    selected: {stroke: "steelblue", fill: "none", strokeWidth: 1},
    muted: {stroke: "steelblue", fill: "none", opacity: 0.4, strokeWidth: 1}
  },
  Wave_Height: {
    normal: {stroke: "yellow", fill: "none", strokeWidth: 1},
    highlighted: {stroke: "#5a98cb", fill: "none", strokeWidth: 1},
    selected: {stroke: "steelblue", fill: "none", strokeWidth: 1},
    muted: {stroke: "steelblue", fill: "none", opacity: 0.4, strokeWidth: 1}
  },
};

class App extends Component {

  constructor(props) {
      super(props)

      this.state = {
      }
  }

  unwindDictionary(data){
    let array = [];

    if(data != null){
      Object.keys(data).forEach(key => {
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
    let points = [];
    columns.push('time');
    Firebase
      .database()
      .ref('/buoys/2320627075/')
      .on('value', entries => {
        entries = this.unwindDictionary(entries.val());
        entries.forEach(entry => {

          Object.keys(entry).forEach(key => {
            if(!columns.find(k => k === key) && key !== 'key'){
              columns.push(key);
            }
          })
          let point = [];
          
          columns.forEach(key => {
            if(entry.hasOwnProperty(key)){
              point.push(entry[key]);
            }

            points.push(point);
          });
          
        })
        // console.log(columns)
        // console.log(points)
        let data = {
          name: "wind",
          columns: columns,
          points: points,
        };
        console.log(data)
        let series = new TimeSeries(data);
        this.setState({ series, timerange: series.range() });
    });
  }

  handleTimeRangeChange = (timerange) => {
    this.setState({ timerange })
  }

  render() {
    let { series, timerange } = this.state;
    if(series){
      return (
      <ChartContainer
        timeRange={timerange}
        width={1000}
        enablePanZoom={true}
        onTimeRangeChanged={this.handleTimeRangeChange}
      >
          <ChartRow height="200">
              <YAxis id="axis1" label="Wind Speed" max={30} width="60" type="linear"/>
              <Charts>
                  <AreaChart
                    style={style}
                    axis="axis1"
                    series={series}
                    columns={{
                      up: ["Avg_Wind"]
                    }}
                  />
                  <LineChart
                    style={style}
                    axis="axis1"
                    series={series}
                    columns={["Gust"]}
                  />
                  {/* <LineChart style={style} axis="axis1" series={series} columns={["Wave_Height"]}/>
                  <LineChart style={style} axis="axis1" series={series} columns={["Water_Temp"]}/> */}
              </Charts>
          </ChartRow>
      </ChartContainer>
      );
    }else{
      return ("Nothing here!")
    }
  }
}

export default App;
