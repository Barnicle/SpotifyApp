import React, { Component, Fragment } from 'react';

export default class WebPlayback extends Component {
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
    const webPlaybackInstance = new Player({
      name: 'Instance Psini Ebanoi',
      getOAuthToken: async (callback) => {
        let userAccessToken = await this.props.onPlayerRequestAccessToken();
        console.log(userAccessToken);
        callback(userAccessToken);
      },
    });
    webPlaybackInstance.connect();
  };

  componentDidMount = async () => {
    await this.waitForSpotify();
    await this.setPlaybackEvent();
  };
  render() {
    console.log(this.props.token);

    return <Fragment>PLAYBACK</Fragment>;
  }
}
