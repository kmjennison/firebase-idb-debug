
import React, { Component } from 'react'
import * as firebase from 'firebase'
import idb from 'idb'

class App extends Component {
  constructor (props) {
    super(props)
    this.firebaseIndexedDbName = 'firebaseLocalStorageDb'
    this.firebaseObjectStoreName = 'firebaseLocalStorage'
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

  async deleteFirebaseIndexedDB () {
    console.log('Deleting Firebase IndexedDB...')
    await idb.delete(this.firebaseIndexedDbName)
    console.log('Finished deleting Firebase IndexedDB')
  }

  async createFirebaseIndexedDBWithoutObjectStore () {
    console.log('Creating Firebase IndexedDB...')
    window.performance.mark('idb-pre-open')
    await idb.open(this.firebaseIndexedDbName)
    window.performance.mark('idb-post-open')
    window.performance.measure('idb-time-to-open', 'idb-pre-open', 'idb-post-open')
    const perfMeasures = window.performance.getEntriesByName('idb-time-to-open')
    if (perfMeasures.length) {
      console.log('Time to open IDB:', perfMeasures.slice(-1)[0].duration)
    }
    console.log('Finished creating Firebase IndexedDB without object store')
  }

  render () {
    const buttonStyle = {
      display: 'inline-block',
      padding: 10,
      margin: 10,
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
        <div
          onClick={this.deleteFirebaseIndexedDB.bind(this)}
          style={buttonStyle}
        >
          Delete Firebase IndexedDB
        </div>
        <div
          onClick={this.createFirebaseIndexedDBWithoutObjectStore.bind(this)}
          style={buttonStyle}
        >
          Create Firebase IndexedDB without object store
        </div>
      </div>
    )
  }
}

export default App
