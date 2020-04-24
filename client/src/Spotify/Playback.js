import React, { Component, Fragment } from 'react';
export default class WebPlayback extends Component {
  state = {
    player: null,
  };
  waitForSpotify = () => {
    return new Promise((resolve) => {
      if ('Spotify' in window) {
        resolve();
      } else {
        window.onSpotifyWebPlaybackSDKReady = () => {
          resolve();
        };
      }
    });
  };
  setPlaybackEvent = async () => {
    const { Player } = window.Spotify;
    const player = new Player({
      name: 'Spotify App',
      getOAuthToken: async (callback) => {
        let userAccessToken = await this.props.onPlayerRequestAccessToken();
        console.log(userAccessToken);
        callback(userAccessToken);
      },
    });

    player.connect().then((success) => {
      if (success) console.log('The Web Playback SDK successfully connected to Spotify!');
    });
    this.setState({
      player,
    });
    this.props.setPlayerState(player);
    console.log(this.state);
  };

  componentDidMount = async () => {
    await this.waitForSpotify();
    await this.setPlaybackEvent();
  };
  togglePlay = async () => {
    await this.state.player;
    const { player } = this.state;

    player.togglePlay().then(() => console.log('Resume'));
  };
  nextTrack = async () => {
    await this.state.player;
    const { player } = this.state;

    player.nextTrack().then(() => console.log('Resume'));
  };
  previousTrack = async () => {
    await this.state.player;
    const { player } = this.state;

    player.previousTrack().then(() => console.log('Resume'));
  };
  render() {
    console.log(this.props, 'playback');
    return (
      <Fragment>
        <img>{}</img>
        <div className="player">
          <button className="player__btn" onClick={this.togglePlay}>
            Play
          </button>
          <button className="player__btn" onClick={this.previousTrack}>
            Previous Track
          </button>
          <button className="player__btn" onClick={this.nextTrack}>
            Next Track
          </button>
        </div>
      </Fragment>
    );
  }
}
