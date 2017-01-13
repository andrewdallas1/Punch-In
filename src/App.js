import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';

class App extends Component {
  constructor() {
    super();
    this.state = {
      tasks: {},
      newTaskInput: false
    }
    this.newTaskHandler = this.newTaskHandler.bind(this);
    this.renderInputHandler = this.renderInputHandler.bind(this);
    this.getTasks = this.getTasks.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
  }

  componentDidMount() {
    this.getTasks();
  }

  getTasks() {

   axios({
    url: '/tasks.json',
    baseURL: 'https://punch-in-94a10.firebaseio.com/',
    method: 'GET'
   }).then((res) => {
      console.log(res)
      this.setState({
        tasks: res.data
      })
      console.log(this.state.tasks)
   })
  }

  createTask(newTaskText) {
    let newTask = { info: newTaskText }
    axios({
      url: '/tasks.json',
      baseURL: 'https://punch-in-94a10.firebaseio.com/',
      method: 'POST',
      data: newTask
    }).then((res) => {
      let tasks = this.state.tasks;
      let newTaskId = res.data.name;
      console.log(newTaskId)
      tasks[newTaskId] = newTask;
      console.log(tasks)
      this.setState({
        tasks: tasks
      })
      console.log(this.state.tasks)
      this.getTasks();
    })
  }

  newTaskHandler(event) {
    event.preventDefault();
    this.createTask(this.newTask.value);
    console.log(event.target.value);
    this.setState({ newTaskInput: false});
  }

  renderNewTaskInput() {
    console.log('trying')
    if(this.state.newTaskInput === true) {
      return(
        <form>
          <input ref={(input) => this.newTask = input} type='text' placeholder='New Task' />
          <input type='submit' onClick={ this.newTaskHandler } />
        </form>
      )
    }
  }

  renderInputHandler() {
    this.setState({
      newTaskInput: true
    })
  }

  renderAddTaskButton() {
    if(this.state.newTaskInput === false) {
      return(
        <div className="add">
          <button onClick={ this.renderInputHandler }>Add Task</button>
        </div>
      )
    } else {
      this.renderNewTaskInput();
    }
  }

  deleteTask(event) {
    let deleteKey = event.target.name;
    axios({
      url: `/tasks/${deleteKey}.json`,
      baseURL: 'https://punch-in-94a10.firebaseio.com/',
      method: 'DELETE',
    }).then((res) => {
      let tasks = this.state.tasks;
      delete tasks[deleteKey];
      this.setState({ tasks: tasks })
    })
  }


  renderTasks() {
    console.log(this.state.tasks)
    const { tasks } = this.state
    return(
      <div className="task-box pb-2">
        <ul className='tasks'>
          {Object.keys(tasks)
          .map(key => <li key={key}>{this.state.tasks[key].info}
           <button name={key} onClick={this.deleteTask}>X</button><button>Edit</button></li>)
        }
        </ul>
      </div>
    )
  }



  render() {
    return (
      <div className="App">
        {this.renderTasks()}
        {this.renderNewTaskInput()}
        {this.renderAddTaskButton()}




      </div>
    );
  }
}

export default App;
