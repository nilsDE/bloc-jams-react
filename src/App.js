import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import './App.css';
import Landing from './components/Landing.js';
import Library from './components/Library.js';
import Album from './components/Album.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header>
        <nav id="navbar">
            <Link to='/' className="link">Landing</Link>
            <Link to='/library' className="link">Library</Link>
          </nav>
          <div id="blue-container">
            <h1 id="main-title">Bloc Jams</h1>
          </div>
        </header>
        <main>  
          <Route exact path="/" component={Landing} />
          <Route path="/library" component={Library} />      
          <Route path="/album/:slug" component={Album} />  
        </main>
      </div>
    );
  }
}

export default App;
