import React from 'react';


class Task extends React.Component {
  constructor() {
    super();


    this.editedTaskHandler = this.editedTaskHandler.bind(this);
  }

  editedTaskHandler(event) {
    event.preventDefault();
    this.props.editTask(this.editedTask.value);
  }

  render() {
    const { tasks } = this.props;
    if(this.props.editable === false) {
      return(
        <div className="tasks">
        <h2>TASKS</h2>
          <ul className='tasks-list'>
            {Object.keys(tasks)
            .map(key => <li className="task-element" key={key}>
              {this.props.tasks[key].info}
             <button className="delete" name={key}
             onClick={this.props.deleteTask}>X</button>
             <button className="edit" name={key} onClick={() =>
              this.props.selectTask(key)}>Edit</button></li>)
          }
          </ul>
        </div>
      )
    } else {
      return(
        <div className="tasks">
        <h2>TASKS</h2>
        <ul className="tasks-list">
            {Object.keys(tasks)
            .map(key => <li className="task-element" key={key}>
              {this.props.tasks[key].info}
             <button className="delete" name={key}
             onClick={this.props.deleteTask}>X</button>
             <button className="edit" name={key} onClick={() =>
              this.props.selectTask(key)}>Edit</button></li>)
          }
          </ul>
        <div className="form-inline">
          <input className="input" ref={(input) =>
            this.editedTask = input} type='text'
            defaultValue={this.props.editableTaskText} />
          <input type='submit' onClick={ this.editedTaskHandler } />
        </div>
        </div>
      )
    }


  }
}

export default Task;


