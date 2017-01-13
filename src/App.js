import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';

class App extends Component {
  constructor() {
    super();
    this.state = {
      tasks: {},
    }
    this.newTaskHandler = this.newTaskHandler.bind(this)
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
      this.getTasks();
    })
  }

  newTaskHandler(event) {
    this.createTask(event.target.value);
    console.log(event.target.value);
  }

  renderNewTaskInput() {
    return(
      <div>
        <input type='text' placeholder='New Task' />
        <input type='submit' onClick={ this.newTaskHandler }>
        </input>
      </div>
    )
  }



  renderTasks() {
    console.log(this.state.tasks)
    return(
      <div className="task-box pb-2">
        <ul className='tasks'>
          <li>{this.state.tasks}</li>
        </ul>
      </div>
    )
  }



  render() {
    return (
      <div className="App">
        {this.renderNewTaskInput()}
      </div>
    );
  }
}

export default App;
