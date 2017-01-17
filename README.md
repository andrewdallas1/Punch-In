# Punch-In

## A productivity app

 This is a minimalistic task and time management app. Tasks are displayed 
 as well as a time log to make workplace prioritizing as simple as it should be.

The technologies used in this app include:
- React.js
- Javascript
- CSS
- Firebase

[Find Punch-In on Bitballoon](http://housing-agent-camel-84028.bitballoon.com/)
![Punch-In](https://i.imgur.com/VaZlAOM.png)

##This is a C.R.U.D. based app relying on RESTful api calls such as:

```javascript
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
```


###Authored by:
###Andrew Dallas
