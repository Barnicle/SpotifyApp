import React from 'react';
import './App.css';
import WebPlayBack from './Spotify/Playback';
import Spotify from 'spotify-web-api-js';

const spotifyWebApi = new Spotify();
class App extends React.Component {
  constructor() {
    super();
    const params = this.getHashParams();
    this.state = {
      token: null,
      loggedIn: params.access_token ? true : false,
      nowPlaying: {
        name: 'Not Checked',
        image: '',
      },
    };

    if (params.access_token) {
      spotifyWebApi.setAccessToken(params.access_token);
    }
  }
  getHashParams = () => {
    var hashParams = {};
    var e,
      r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    while ((e = r.exec(q))) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  };
  componentDidMount = () => {
    if (localStorage.key('state')) {
      const value = JSON.parse(localStorage.getItem('state'));
      this.setState({
        nowPlaying: value,
      });
    }
  };

  getNowPlaying = () => {
    spotifyWebApi.getMyCurrentPlaybackState().then((response) => {
      this.setState({
        nowPlaying: {
          name: response.item.name,
          image: response.item.album.images[0].url,
        },
      });
      this.setToLocalStorage();
    });
  };

  setToLocalStorage = () => {
    const toString = JSON.stringify(this.state.nowPlaying);
    localStorage.setItem('state', toString);
  };

  render() {
    return (
      <div className="App">
        <a href="http://localhost:8888">
          <button>Login with Spotify</button>
        </a>
        <div>Now Playing: {this.state.nowPlaying.name}</div>
        <img src={this.state.nowPlaying.image} alt="album cover" style={{ width: 300 }}></img>
        <button onClick={() => this.getNowPlaying()}>Check Now Playing</button>
        <WebPlayBack
          onPlayerRequestAccessToken={() => {
            const param = this.getHashParams();
            return param.access_token;
          }}
        />
      </div>
    );
  }
}

export default App;
