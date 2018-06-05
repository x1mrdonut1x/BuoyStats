import React, {Component} from 'react';
import chartStyles from './chartStyle'
import Firebase from '../../firebase/Firebase'
import {
  Resizable,
  Charts,
  ChartContainer,
  ChartRow,
  YAxis,
  LineChart,
  AreaChart,
  Baseline,
  EventMarker,
  Legend,
  styler,
  ScatterChart
} from "react-timeseries-charts";
import { TimeSeries, TimeRange } from "pondjs";
import { withStyles } from 'material-ui/styles';
import style from './Chart.style';
import { DateTime } from 'luxon';

class Chart extends Component {

	constructor(props) {
		super(props)

		this.state = {
			timerange: null,
			tracker: null,
			trackerValues: "-- knots",
			trackerEvent: null,
			markerMode: "flag",
			columns: [],
			userId: props.userId || 2320627075,
		}
	}

	componentWillReceiveProps(nextProps){
		if(this.state.userId !== nextProps.userId){
			this.setState({ userId: nextProps.userId })
			this.loadData(nextProps.userId);
		}
	}

	unwindDictionary(data) {
		let array = [];

		if (data != null) {
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
			this.loadData(this.state.userId);
	}

	loadData(userId) {
		let columns = [];
		let maxValue = 0;
		columns.push('time');
		
		Firebase
		.database()
		.ref(`/buoys/${userId}/`)
		.once('value')
		.then(entries => {
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
					if(entry[key]){
						point.push(entry[key]);
						if(key !== 'time' && key !== 'Gust_Dir' && key !== 'Wind_Dir'){
							// eslint-disable-next-line
							maxValue < entry[key] ? maxValue = entry[key] : null;
						}
					}
				});
				points.push(point);
			});

			let data = {
				name: "wind",
				columns: columns,
				points: points
			};

			let series = new TimeSeries(data);
			let start = DateTime.local().startOf('day').valueOf();
			
			let timerange = new TimeRange([start > series.begin().getTime() ? series.begin().getTime() : start, series.end()]);
			this.setState({
				maxValue,
				series,
				columns,
				timerange: this.state.timerange ? this.state.timerange : timerange
			});
		});
	}

	getFormattedString(attribute, event){
		let value = event.get(attribute);
		if(value != null){
			switch(attribute){
				case 'Avg_Wind':
					return {
						label: 'Wind',
						value: `${value} knots`
					}
				case 'Gust':
					return {
						label: 'Gust',
						value: `${value} knots`
					}
				case 'Water_Temp':
					return {
						label: 'Water Temp',
						value: `${value}\u00B0C`
						}
				case 'Wave_Height':
					return {
						label: 'Wave Height',
						value: `${value}m`
					}
				case 'Wave_Period':
					return {
						label: 'Wave Period',
						value: `${value}s`
					}
				case 'Wind_Dir':
					return {
						label: 'Wind Dir',
						value: `${value}\u00B0`
					}
				case 'Gust_Dir':
					return {
						label: 'Gust Dir',
						value: `${value}\u00B0`
					}
				case 'Air_Temp':
					return {
						label: 'Air Temp',
						value: `${value}\u00B0C`
					}
				case 'Humidity':
					return {
						label: 'Humidity',
						value: `${value}%`
					}
				case 'Air_Press':
					return {
						label: 'Air Press',
						value: `${value}hPa`
					}
				default:
					return {
						label: '',
						value: ''
					}
			}
		}
	}

	handleTrackerChanged = t => {
		if (t) {
			let date = new Date(t);
			date.setMinutes(date.getMinutes() + 7.5);
			t = date;
			
			let { columns } = this.state;
			const event = this.state.series.atTime(t);
			const eventTime = event.begin();

			const values = [
				columns.find(c => c === 'Avg_Wind') ? this.getFormattedString('Avg_Wind', event) : null,
				...this.getAttributes(4).map(col => this.getFormattedString(col, event))
			]

			this.setState({
				tracker: eventTime,
				trackerValues: values,
				trackerEvent: event
			});
			
		}else{
			this.setState({ tracker: null, trackerValuess: null, trackerEvent: null });
		}
	};

	renderMarker = () => {
		return (
			<EventMarker
				type="flag"
				axis="wind"
				event={this.state.trackerEvent}
				column={"Gust"}
				info={this.state.trackerValues}
				infoTimeFormat="%H:%M"
				infoWidth={120}
				infoHeight={78}
				markerRadius={2}
				markerStyle={{
					fill: "black"
				}}
			/>
		);
	};

	handleTimeRangeChange = (timerange) => {
		let { series } = this.state;

		if(timerange.begin() < series.begin()){
			timerange = new TimeRange(series.begin(), timerange.end());
		}
		
		if(timerange.end() > series.end()){
			timerange = new TimeRange(timerange.begin(), series.end());
		}

		this.setState({ timerange })
	}

	getAttributes(size=this.columns.size){
		let { columns } = this.state;
		const attributes = [
			'Gust',
			'Water_Temp',
			'Wave_Height',
			'Wave_Period',
			'Wind_Dir',
			'Gust_Dir',
			'Air_Temp',
			'Air_Press',
			'Humidity'
		];

		let output = [];
		let num = 0;
		for(let i = 0; i < attributes.length; ++i){
			if(columns.find(c => c === attributes[i])){
				if(++num > size){
					return output
				}
				output.push(attributes[i]);
			}
		}
		// console.log(output)
		return output;

		// switch(userId){
		//     case 3302829610:
		//         return ['Avg_Wind', 'Gust', 'Temp']
		//     case 4016028339:
		//         return
		//     case 2359608031:
		//         return
		//     case 63284756830:
		//         return
		//     case 2320627075:
		//         return
		//     case 2800302088:
		//         return
		//     case 3055900497:
		//         return
		//     case 2359535845:
		//         return
		//     case 3055873233:
		//         return
		//     case 869880030444310529:
		//         return
		// }
	}

	getLabels(){
		let { columns } = this.state;
		return columns.map(c => c.replace('_', ' '))
	}


  render() {
    let { series, timerange, maxValue } = this.state;
    let { classes } = this.props;
    const legendStyle = styler([
        {key: "Avg_Wind", color: "steelblue", width: 3},
        {key: "Gust", color: "green", width: 2}
    ]);
    if (series) {
      return (
        <div className={classes.container}>
            <Resizable>
				<ChartContainer
					timeRange={timerange}
					enablePanZoom={true}
					onTimeRangeChanged={this.handleTimeRangeChange}
					onTrackerChanged={this.handleTrackerChanged}
				>
					<ChartRow height="200">
						<YAxis id="wind" label="Wind Speed" max={maxValue + 5} width="60" type="linear"/>
						<Charts>
							<Baseline axis="wind" value={20} label="20 Knots" position="left" />
							<AreaChart
								style={chartStyles}
								axis="wind"
								series={series}
								columns={{
									up: ["Avg_Wind"]
								}}
							/>
							<LineChart style={chartStyles} axis="wind" series={series} columns={["Gust"]}/> 
							{/* <LineChart style={chartStyles} axis="height" series={series} columns={["Wave_Height"]}/> */}
							{this.renderMarker()}
						</Charts>
					</ChartRow>
				</ChartContainer>
            </Resizable>
            <div>
              <Legend
					type="line"
					align="right"
					style={legendStyle}
					categories={[
						{key: "Avg_Wind", label: "Wind"},
						{key: "Gust", label: "Gust"}
					]}
              />
            </div>
        </div>
      );
    } else {
      return ("Loading...")
    }
  }
}

export default withStyles(style)(Chart);

