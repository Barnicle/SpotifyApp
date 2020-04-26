import React, { Component } from 'react';
import Login from '../Spotify/Login.js';

export default class IntroScreen extends Component {
  buttonClick(e) {
    e.preventDefault();
    console.log(e.target);
    Login.logInWithSpotify();
  }

  render() {
    return (
      <div>
        <button className="login-btn login-btn__hover" onClick={this.buttonClick}>
          Log in with Spotify
        </button>
      </div>
    );
  }
}
