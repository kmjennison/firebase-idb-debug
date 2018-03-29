import React, { Component } from 'react'
import * as firebase from 'firebase'

class App extends Component {
  initFirebase () {
    var config = {
      apiKey: 'AIzaSyBnqqd27Sew_77rkQAYZwGpQJqCI077VQE',
      authDomain: 'testing-project-a7d78.firebaseapp.com',
      databaseURL: 'https://testing-project-a7d78.firebaseio.com',
      projectId: 'testing-project-a7d78',
      storageBucket: ''
    }
    firebase.initializeApp(config)
    console.log('Initialized Firebase')
  }

  render () {
    const buttonStyle = {
      display: 'inline-block',
      padding: 10,
      cursor: 'pointer',
      background: '#DDD'
    }
    return (
      <div
        style={{
          padding: 20,
          background: '#FFF'
        }}
      >
        <div
          onClick={this.initFirebase.bind(this)}
          style={buttonStyle}
        >
          Initialize Firebase
        </div>
      </div>
    )
  }
}

export default App
