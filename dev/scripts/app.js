import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import firebase from './firebase'

const dbRef = firebase.database().ref('/starCount');

class TimerDisplay extends React.Component {
  render() {
    return(
      <div>
        <h2>{`${this.props.currentTime.get('minutes')}:${this.props.currentTime.get('seconds')}`}</h2>
      </div>
    )
  }
}

const StarDisplay = (props) => {
  let starCount = props.starCount;
  let stars = [];
  for (let i = 0; i < starCount; i++) {
      stars.push(<li key={i}><i className='fa fa-star-o fa-3x' aria-hidden='true'></i></li>);
  }

  return (
    <div>
      <ul>{stars}</ul>
    </div>
  )
}


class App extends React.Component {
  constructor() {
    super();
    this.state = {
      currentTime: moment.duration(1, 'minutes'),
      // baseTime: moment.duration(1, 'minutes'),
      timerIsRunning: false,
      timer: null,
      timeArray: [2, 1],
      intervalSwitch: true,
      starCount: 1,
    };
    this.startTimer = this.startTimer.bind(this);
    this.reduceTimer = this.reduceTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
  }

  componentDidMount() {
      dbRef.on('value', (snapshot) => {
        let value = snapshot.val();
        if (value !== null) {
          this.setState({
            starCount: value.count,
          })
        }
      })
  }

  removeStars() {
    dbRef.remove();
    this.setState({
      starCount: 0,
    })
  }

  startTimer() {
    const setTime = setInterval(this.reduceTimer, 1000);
    this.setState({
      timer: setTime,
      timerIsRunning: true,
    })
  }

  reduceTimer() {
    const newTime = moment.duration(this.state.currentTime);
    newTime.subtract(1, 'second')

    //set the first time to be index[0] of the time array
    let workInterval = this.state.timeArray[0];
    let breakInterval = this.state.timeArray[1];

    let secondTime = newTime.asSeconds();

    if (secondTime === 0 ) {
      if (this.state.intervalSwitch === false) {
        this.setState({
          currentTime: moment.duration(workInterval, 'minutes'),
          intervalSwitch: true,
        })
      } else {
        dbRef.set({count: this.state.starCount + 1})
        this.setState({
          currentTime: moment.duration(breakInterval, 'minutes'),
          intervalSwitch: false,
        })
      }
    } else {
      this.setState({
        currentTime: newTime,
      })
    }
  }

  stopTimer() {
    this.setState({
      timerIsRunning: false,
    })
    clearInterval(this.state.timer)
  }

  //star count data is held in firebase
  //star count should be 'clearable'

  render() {
    let startButton = (
      <button onClick={this.startTimer}>start</button>
    );
    let stopButton = (
      <button onClick={this.stopTimer}>stop</button>
    );
    return (
      <div>
        <TimerDisplay currentTime={this.state.currentTime} />
        { this.state.timerIsRunning === true ? stopButton : startButton  }
        <StarDisplay starCount={this.state.starCount} />
        <button onClick={() =>
        this.removeStars()}>Remove</button>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
