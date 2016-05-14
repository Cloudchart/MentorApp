import React, { Component, PropTypes, Text, NativeModules } from 'react-native'

const { measureLayoutRelativeToParent } = NativeModules.UIManager

export default class AutoText extends Component {

  static propTypes = {
    style: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array,
      PropTypes.number,
    ]),
    scalingStyle: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array,
      PropTypes.number,
    ]),
    completeStyle: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array,
      PropTypes.number,
    ]),
    initialFontSize: PropTypes.number,
    maxHeight: PropTypes.number,
    onComplete: PropTypes.func,
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      fontSize: props.initialFontSize || 0.5,
      isScalingComplete: false,
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.children !== this.props.children) {
      this.setState({
        fontSize: this.props.initialFontSize || 0.5,
        isScalingComplete: false,
      }, () => this._tryNewSize())
    }
  }

  componentDidMount() {
    // Convert this to async/await function so I can process synchronously in loop
    this._tryNewSize()
  }

  _tryNewSize() {
    requestAnimationFrame(() => {
      const node = React.findNodeHandle(this._text)
      if (node) {
        measureLayoutRelativeToParent(
          node,
          () => React.AlertIOS.alert('ERROR!'),
          (x, y, width, height) => this._checkSize(width, height)
        )
      }
    })
  }

  _checkSize(width, height) {
    const { onComplete } = this.props
    const { fontSize } = this.state
    if (this.props.maxHeight !== undefined) {
      if (height > this.props.maxHeight) {
        if (fontSize == 0.5) {
          try {
            this.setState({
              isScalingComplete: true,
            }, () => {
              if (onComplete) {
                onComplete(height)
              }
            })
          } catch (e) {
            if (onComplete) {
              onComplete(height)
            }
          }
        } else {
          try {
            this.setState({
              fontSize: fontSize - 0.5,
              //isScalingComplete: true,
            })
          } catch (e) {
            // nothing
          }
          this._tryNewSize()
        }
      } else if (this.state.isScalingComplete === false) {
        try {
          this.setState({
            //fontSize: fontSize + 0.5,
            isScalingComplete: true,
          }, () => {
            if (onComplete) {
              onComplete({fontSize, height})
            }
          })
          //this._tryNewSize()
        } catch (e) {
          if (onComplete) {
            onComplete({fontSize, height})
          }
        }
      }
    }
  }

  render() {
    const { style, scalingStyle, completeStyle, children } = this.props
    const { fontSize, isScalingComplete } = this.state
    const stateStyle = isScalingComplete ? completeStyle : scalingStyle
    const finalStyle = [
      style || {},
      stateStyle,
      { fontSize: fontSize },
    ]
    return (
      <Text
        ref={component => this._text = component}
        style={finalStyle}
        >
        {children}
      </Text>
    )
  }

}
