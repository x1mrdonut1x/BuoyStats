import React, {Component} from 'react';
import {withStyles} from 'material-ui/styles';
import style from './Main.style';
import Chart from '../../components/chart/Chart';
import {MenuItem} from 'material-ui/Menu';
import Select from 'material-ui/Select';
import Grid from 'material-ui/Grid';

class Main extends Component {

    constructor(props) {
        super(props)

        this.state = {
            userId: 2320627075, // @DublinBayBuoy
        }
    }

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    render() {
        let {classes} = this.props;
        let {userId} = this.state;

        return (
            <div className={classes.pageWrapper}>
                <Grid container direction="column" spacing={40}>
                    <Grid item>
                        <Select
                            value={userId}
                            onChange={this.handleChange}
                            name="userId"
                            className={classes.select}>
                            <MenuItem value={3302829610}>@FastnetLightHouse</MenuItem>
                            {/* <MenuItem value={4016028339}>@KishlHouse</MenuItem> */}
                            <MenuItem value={2359608031}>@BallybunionBuoy</MenuItem>
                            {/* <MenuItem value={632847568}>@ConingbegBuoy</MenuItem> */}
                            <MenuItem value={2320627075}>@DublinBayBuoy</MenuItem>
                            {/* <MenuItem value={2800302088}>@FinnisBuoy</MenuItem> */}
                            <MenuItem value={3055900497}>@FoyleBuoy</MenuItem>
                            {/* <MenuItem value={2359535845}>@SplaughBuoy</MenuItem> */}
                            {/* <MenuItem value={3055873233}>@SouthHunterBuoy</MenuItem> */}
                            {/* <MenuItem value={869880030444310529}>@SouthRockBuoy</MenuItem> */}
                        </Select>
                    </Grid>
                    <Grid item>
                        <Chart userId={userId}/>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withStyles(style)(Main);
