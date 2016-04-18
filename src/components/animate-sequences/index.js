import React, {
    Animated,
    Component,
    Image
} from "react-native";

class AnimateSequences extends Component {

  state = {
    imageIndex: 0
  }

  constructor (props) {
    super(props)
    this.intervalId = null;
    this.animationRepeatCount = 0;
  }

  componentDidMount () {
    this.start()
  }


  componentDidUpdate (nextProps, nextState) {
    if ( this.props.moodSequences != nextProps.moodSequences ) {
      this.clear()
      this.start(true);
    }
  }


  componentWillUnmount () {
    this.clear()
  }

  start (opt_props = false) {
    if ( !opt_props ) {
      this._startAnimateTimeOut = setTimeout(()=> {
        this._animate()
      }, 500)
    } else {
      this._animate()
    }
  }

  clear () {
    this.state.imageIndex = 0;
    this.animationRepeatCount = 0;
    clearTimeout(this.intervalId);
    clearTimeout(this._startAnimateTimeOut);
  }

  _animate () {
    const { animationRepeatCount, animationDuration, animationImages } = this.props;
    this.animationRepeatCount = animationRepeatCount || 0;
    const duration = animationDuration || 1000;

    let __animate = animate.bind(this);

    function animate () {
      let imageIndex = this.state.imageIndex + 1;

      if ( imageIndex >= animationImages.length ) {
        imageIndex = 0;

        if ( animationRepeatCount ) {
          if ( this.animationRepeatCount === 1 ) {
            clearInterval(this.intervalId);
            return;
          }
          this.animationRepeatCount--;
        }
      }
      this.setState({ imageIndex: imageIndex })
      this.intervalId = setTimeout(__animate, duration);
    }

    this.intervalId = setTimeout(__animate, duration);
  }


  render () {
    return (
        <Image
            {...this.props}
            source={this.props.animationImages[this.state.imageIndex]}/>
    )
  }
}

AnimateSequences.propTypes = {
  animationImages: React.PropTypes.array.isRequired,
  animationRepeatCount: React.PropTypes.oneOfType([
    React.PropTypes.bool,
    React.PropTypes.number,
  ]),
  animationDuration: React.PropTypes.number
}


export default AnimateSequences;
