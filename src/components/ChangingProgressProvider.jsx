import React from "react";

class ChangingProgressProvider extends React.Component {
  
  static defaultProps = {
    interval: 1000
  };

  state = {
    valuesIndex: 0
  };

  componentDidMount() {
    setInterval(() => {
      this.setState({
        valuesIndex: (this.state.valuesIndex + 1) % this.props.values.length
      });
    }, this.props.interval);
  }

  render() {
    return (
      <div>
        this.props.children(this.props.values[this.state.valuesIndex]);
      </div>
    )
  }
}

export default ChangingProgressProvider;
