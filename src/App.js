import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import * as firebase from 'firebase'

class App extends Component {
  componentWillMount () {
    this.initFirebase()
  }

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
    return (
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h1 className='App-title'>Welcome to React</h1>
        </header>
        <p className='App-intro'>
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    )
  }
}

export default App
