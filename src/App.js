
import React, { Component } from 'react'
import * as firebase from 'firebase'
import * as firebaseModified from 'firebase-modified'
import idb from 'idb'

class App extends Component {
  constructor (props) {
    super(props)
    this.firebaseIndexedDbName = 'firebaseLocalStorageDb'
    this.firebaseObjectStoreName = 'firebaseLocalStorage'
    this.firebaseObjectStoreKeyPath = 'fbase_key'
    this.dbVersion = (
      window.localStorage.getItem('dbVersion')
        ? parseInt(window.localStorage.getItem('dbVersion'), 10)
        : 1
    )
  }

  getFirebaseConfig () {
    return {
      apiKey: 'AIzaSyBnqqd27Sew_77rkQAYZwGpQJqCI077VQE',
      authDomain: 'testing-project-a7d78.firebaseapp.com',
      databaseURL: 'https://testing-project-a7d78.firebaseio.com',
      projectId: 'testing-project-a7d78',
      storageBucket: ''
    }
  }

  initFirebase () {
    var config = this.getFirebaseConfig()
    firebase.initializeApp(config)
    console.log('Initialized Firebase')
  }

  initFirebaseModified () {
    var config = this.getFirebaseConfig()
    firebaseModified.initializeApp(config)
    console.log('Initialized modified Firebase')
  }

  async deleteFirebaseIndexedDB () {
    console.log('Deleting Firebase IndexedDB...')
    window.localStorage.removeItem('dbVersion')
    await idb.delete(this.firebaseIndexedDbName)
    console.log('Finished deleting Firebase IndexedDB')
  }

  async getFirebaseIndexedDB () {
    const db = await idb.open(this.firebaseIndexedDbName)
    return db
  }

  async createFirebaseIndexedDB (upgradeCallback = () => {}) {
    const version = this.dbVersion ? this.dbVersion : ''
    const self = this
    const db = await idb.open(this.firebaseIndexedDbName, version, (upgradeDb) => {
      self.dbVersion += 1
      window.localStorage.setItem('dbVersion', self.dbVersion)
      upgradeCallback(upgradeDb)
    })
    return db
  }

  async createFirebaseIndexedDBWithoutObjectStore () {
    console.log('Creating Firebase IndexedDB...')
    const db = await this.createFirebaseIndexedDB(async upgradeDb => {
      // Try deleting the object store (it may or may not exist)
      try {
        upgradeDb.deleteObjectStore(this.firebaseObjectStoreName)
        console.log('Deleted object store from DB')
      } catch (e) {
        console.warn('No object store existed, so we did not delete one')
      }
    })
    console.log('Finished opening Firebase IndexedDB without object store')
    db.close()
  }

  async createFirebaseIndexedDBWithObjectStore () {
    console.log('Creating Firebase IndexedDB...')
    const self = this
    const db = await this.createFirebaseIndexedDB(async upgradeDb => {
      // Try creating the object store (it may or may not exist)
      try {
        // https://github.com/firebase/firebase-js-sdk/blob/1b3ba41f7c5207907a32601e552168e29281948e/packages/auth/src/storage/indexeddb.js#L185
        upgradeDb.createObjectStore(this.firebaseObjectStoreName, {
          keyPath: self.firebaseObjectStoreKeyPath
        })
        console.log('Added object store to DB')
      } catch (e) {
        console.warn('An object store already existed, so we did not add one')
      }
    })
    console.log('Finished opening Firebase IndexedDB')
    db.close()
  }

  async testOpenDBTransaction () {
    console.log('Opening Firebase DB transaction (this will stall on Firefox if there\'s an error)...')
    const db = await this.getFirebaseIndexedDB()
    await db
      .transaction(this.firebaseObjectStoreName)
      .objectStore(this.firebaseObjectStoreName)
      .get('foo')
    console.log('Finished opening transaction')
    db.close()
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
        <div>
          <div
            onClick={this.initFirebase.bind(this)}
            style={buttonStyle}
          >
            Initialize Firebase
          </div>
          <div
            onClick={this.initFirebaseModified.bind(this)}
            style={buttonStyle}
          >
            Initialize modified Firebase
          </div>
        </div>
        <div>
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
            Create DB without object store
          </div>
          <div
            onClick={this.createFirebaseIndexedDBWithObjectStore.bind(this)}
            style={buttonStyle}
          >
            Create DB with object store
          </div>
          <div
            onClick={this.testOpenDBTransaction.bind(this)}
            style={Object.assign({}, buttonStyle, {
              display: 'none'
            })}
          >
            Test opening a transaction
          </div>
        </div>
        <div>
          <p>Open dev console to view some relevant logs.</p>
          <p>Modified Firebase code is <a href='https://github.com/kmjennison/firebase-js-sdk/pull/1'>here</a>. It:</p>
          <ul>
            <li>Handles recreating the database when the object store is missing</li>
            <li>Adds console logs to the IDB.open onerror event</li>
          </ul>
        </div>
      </div>
    )
  }
}

export default App
