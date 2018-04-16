import React, {Component} from 'react';
import style from './Footer.style'
import { withStyles } from 'material-ui/styles';
import FontAwesome from 'react-fontawesome'; 

class Footer extends Component {

  render() {
      let { classes } = this.props;
      return (    
        <footer className={classes.footerDistributed}>
            <div className={classes.footerRight}>
                <a
                    href="https://github.com/x1mrdonut1x/BuoyStats"
                >
                    
                <FontAwesome
                    className={classes.github}
                    name='github'
                    size='2x'
                    // style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}
                />
      {/* <i className="fa fa-github"></i> */}
                </a>
            </div>
            <div className={classes.footerLeft}>
                Alex Niznik &copy; 2018
            </div>
        </footer>)
  }
}

export default withStyles(style)(Footer);
