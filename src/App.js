import React, { Component } from 'react';
import Task from './components/Task';
import Log from './components/Log';
import jquery from 'jquery';

import axios from 'axios';
import moment from 'moment';

class App extends Component {
  constructor() {
    super();
    this.state = {
      tasks: {},
      time: {},
      newTaskInput: false,
      editable: false,
      editableTaskText: "",
      key: null,
      punchedIn: false
    }
    this.newTaskHandler = this.newTaskHandler.bind(this);
    this.renderInputHandler = this.renderInputHandler.bind(this);
    this.editTask = this.editTask.bind(this);
    this.getTasks = this.getTasks.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.getEditableTask = this.getEditableTask.bind(this);
    this.punchIn = this.punchIn.bind(this);
    this.selectTask = this.selectTask.bind(this)
  }

  componentDidMount() {
    this.getTasks();
    this.getLog();
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
      tasks[newTaskId] = newTask;
      this.setState({
        tasks: tasks
      })
      this.getTasks();
    })
  }

  newTaskHandler(event) {
    event.preventDefault();
    this.createTask(this.newTask.value);
    this.setState({ newTaskInput: false});
  }

  renderNewTaskInput() {
    if(this.state.newTaskInput === true) {
      return(
        <form className="newTask">
          <input ref={(input) => this.newTask = input}
          type='text' placeholder='New Task' />
          <input className="submit" type='submit'
          onClick={ this.newTaskHandler } />
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
        <div>
          <button className="add" onClick={ this.renderInputHandler }>
          Add Task </button>
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


  getEditableTask(et) {
    axios.get(`https://punch-in-94a10.firebaseio.com/tasks/${et}.json`)
      .then((res) => {
        this.setState({
          editableTaskText: res.data.info
        })
      })
  }

  editTask(editedTaskText) {
    let editedTask = { info: editedTaskText }
    let editKey = this.state.editableTask;
    axios({
      url: `/tasks/${editKey}.json`,
      baseURL: 'https://punch-in-94a10.firebaseio.com/',
      method: 'PATCH',
      data: editedTask
    }).then((res) => {
      let tasks = this.state.tasks;
      let editedTaskId = res.data.name;
      tasks[editedTaskId] = editedTask;
      this.setState({
        tasks: tasks,
        editable: false
      })
      this.getTasks();
    })
  }

  selectTask(key) {
    this.setState({
      editableTask: key,
      editable: true
    })
    this.getEditableTask(key);

  }

  punchIn() {
    if(this.state.punchedIn === false) {
    this.setState({
      punchedIn: true,
    })
    this.renderPunchInButton();
    this.logPunchIn();
    setTimeout(this.getLog(), 1000);
  } else {
    this.setState({
      punchedIn: false,
    })
    this.renderPunchInButton();
    this.logPunchIn();
    setTimeout(this.getLog(), 1000);
  }
  }

  logPunchIn() {
    let newTime = { info: moment().format('LLL') }
    axios({
      url: '/time.json',
      baseURL: 'https://punch-in-94a10.firebaseio.com/',
      method: 'POST',
      data: newTime
    }).then((res) => {
      }).catch((err) => {
        console.error(err);
      })

  }

  getLog() {
    axios({
      url: '/time.json',
      baseURL: 'https://punch-in-94a10.firebaseio.com/',
      method: 'Get'
    }).then((res) => {
      this.setState({
        time: res.data
      })
      }).catch((err) => {
        console.error(err);
      })
  }


  renderPunchInButton() {
    if(this.state.punchedIn === false) {
      return(
        <div className="punch">
          <button className="punchIn" onClick={this.punchIn}>
          Punch-In</button>
        </div>
      )
    } else {
        return(
          <div className="punch">
            <button className="punchOut" onClick={this.punchIn}>
            Punch-Out</button>
          </div>
        )
      }
  }



  render() {
    return (
      <div className="App">
        <h1 className="title">Punch-In</h1>
        <h4 className="sub-title">A Productivity App</h4>
        <Task
          tasks={this.state.tasks}
          editable={this.state.editable}
          deleteTask={this.deleteTask}
          selectTask={this.selectTask}
          editTask={this.editTask}
        />
        <Log
          time={this.state.time}
          punchedIn={this.state.punchedIn}
        />
        {this.renderNewTaskInput()}
        {this.renderAddTaskButton()}
        {this.renderPunchInButton()}
      </div>
    );
  }
}

export default App;
