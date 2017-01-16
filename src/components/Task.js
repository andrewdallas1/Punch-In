import React from 'react';

class Task extends React.Component {
  constructor() {
    super();
  }

  render() {
      console.log(this.props.tasks)
    const { tasks } = this.props;
    if(this.props.editable === false) {
      return(
        <div className="task-box pb-2">
          <ul className='tasks'>
            {Object.keys(tasks)
            .map(key => <li key={key}>{this.props.tasks[key].info}
             <button name={key} onClick={this.props.deleteTask}>X</button>
             <button name={key} onClick={() => this.props.selectTask(key)}>Edit</button></li>)
          }
          </ul>
        </div>
      )
    } else {
      return(
        <div className="task-box pb-2">
        <ul className='tasks'>
            {Object.keys(tasks)
            .map(key => <li key={key}>{this.props.tasks[key].info}
             <button name={key} onClick={this.props.deleteTask}>X</button>
             <button name={key} onClick={() => this.props.selectTask(key)}>Edit</button></li>)
          }
          </ul>
        <form>
          <input ref={(input) => this.editedTask = input} type='text'
            defaultValue={this.props.editableTaskText} />
          <input type='submit' onClick={ this.props.editedTaskHandler } />
        </form>
        </div>
      )
    }


  }
}

export default Task;


