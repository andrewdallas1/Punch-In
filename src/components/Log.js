import React from 'react';

class Log extends React.Component {
  constructor(){
    super();

  }

  render() {
    const { time } = this.props;

      return(
        <div className="log">
        <h2>LOG</h2>
          <ul className='log-list'>
            {Object.keys(time)
            .map(key => <li className="time-element" key={key}>
              {this.props.time[key].info}
            </li>).reverse()
          }
          </ul>
        </div>
      )


  }

}


export default Log;
