import React, { Component } from 'react';
import Task from './components/Task';
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
    this.editedTaskHandler = this.editedTaskHandler.bind(this);
    this.editTask = this.editTask.bind(this);
    this.getTasks = this.getTasks.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.renderTasks = this.renderTasks.bind(this);
    this.getEditableTask = this.getEditableTask.bind(this);
    this.punchIn = this.punchIn.bind(this);
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
    const { tasks } = this.state;
    if(this.state.editable === false) {
      return(
        <div className="task-box pb-2">
          <ul className='tasks'>
            {Object.keys(tasks)
            .map(key => <li key={key}>{this.state.tasks[key].info}
             <button name={key} onClick={this.deleteTask}>X</button>
             <button name={key} onClick={() => this.selectTask(key)}>Edit</button></li>)
          }
          </ul>
        </div>
      )
    } else {
      return(
        <div className="task-box pb-2">
        <ul className='tasks'>
            {Object.keys(tasks)
            .map(key => <li key={key}>{this.state.tasks[key].info}
             <button name={key} onClick={this.deleteTask}>X</button>
             <button name={key} onClick={() => this.selectTask(key)}>Edit</button></li>)
          }
          </ul>
        <form>
          <input ref={(input) => this.editedTask = input} type='text'
            defaultValue={this.state.editableTaskText} />
          <input type='submit' onClick={ this.editedTaskHandler } />
        </form>
        </div>
      )
    }
  }

  getEditableTask(et) {
    axios.get(`https://punch-in-94a10.firebaseio.com/tasks/${et}.json`)
      .then((res) => {
        console.log(res)

        this.setState({
          editableTaskText: res.data.info
        })
        console.log(this.state.editableTasText)
      })
  }

  editedTaskHandler(event) {
    event.preventDefault();

    this.editTask(this.editedTask.value);
    console.log(event.target.value);
    this.setState({
      editable: false,
    });

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
      console.log(editedTaskId)
      tasks[editedTaskId] = editedTask;
      console.log(tasks)
      this.setState({
        tasks: tasks
      })
      console.log(this.state.tasks)
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
    console.log(moment().format('LTS'))
    this.setState({
      punchedIn: true,
    })
    this.renderPunchInButton();
    this.logPunchIn();
    this.getLog();
  } else {
    this.setState({
      punchedIn: false,
    })
    this.renderPunchInButton();
    this.logPunchIn();
    this.getLog();
  }
  }

  logPunchIn() {
    let newTime = { info: moment().format('LTS') }
    console.log(moment().format('LTS'))
    axios({
      url: '/time.json',
      baseURL: 'https://punch-in-94a10.firebaseio.com/',
      method: 'POST',
      data: newTime
    }).then((res) => {
      console.log(res);
      }).catch((err) => {
        console.error(err);
      })
      console.log(this.state.tasks)
  }

  getLog() {
    axios({
      url: '/time.json',
      baseURL: 'https://punch-in-94a10.firebaseio.com/',
      method: 'Get'
    }).then((res) => {
      console.log(res);
      this.setState({
        time: res.data
      })
      console.log(this.state.time)
      }).catch((err) => {
        console.error(err);
      })
      console.log(this.state.tasks)
  }
  renderTime() {
    console.log(this.state.time)
    const { time } = this.state;

      return(
        <div className="task-box pb-2">
          <ul className='tasks'>
            {Object.keys(time)
            .map(key => <li key={key}>{this.state.time[key].info}
            </li>)
          }
          </ul>
        </div>
      )
    }


  renderPunchInButton() {
    if(this.state.punchedIn === false) {
      return(
        <div className="punch">
          <button className="punchIn" onClick={this.punchIn}>Punch-In</button>
        </div>
      )
    } else {
        return(
          <div className="punch">
            <button className="punchOut" onClick={this.punchIn}>Punch-Out</button>
          </div>
        )
      }
  }



  render() {
    return (
      <div className="App">
        <Task
          tasks={this.state.tasks}
          editable={this.state.editable}
          deleteTask={this.deleteTask}
          selectTask={this.selectTask}
          editedTaskHandler={this.editedTaskHandler}
        />
        {this.renderTime()}
        {this.renderNewTaskInput()}
        {this.renderAddTaskButton()}
        {this.renderPunchInButton()}
      </div>
    );
  }
}

export default App;
