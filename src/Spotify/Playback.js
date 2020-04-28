import React, { Component, Fragment } from 'react';

export default class WebPlayBack extends Component {
  deviceSelectedInterval = null;
  statePollingInterval = null;
  player = null;

  state = {
    playerReady: false,
    playerSelected: false,
  };

  handleState = async (state) => {
    if (state) {
      this.props.onPlayerStateChange(state);
    } else {
      let {
        _options: { id: device_id },
      } = this.player;

      this.clearStatePolling();
      this.props.onPlayerWaitingForDevice({ device_id: device_id });
      console.log(state.playerSelected, 'ps');
      await this.waitForDeviceToBeSelected();
      this.props.onPlayerDeviceSelected();
    }
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

  waitForDeviceToBeSelected = () =>
    new Promise((resolve) => {
      this.deviceSelectedInterval = setInterval(() => {
        if (this.player) {
          this.player.getCurrentState().then((state) => {
            if (state !== null) {
              console.log(state, 'state');
              this.startStatePolling();
              clearInterval(this.deviceSelectedInterval);
              resolve(state);
            }
          });
        }
      });
    });

  startStatePolling = () => {
    this.statePollingInterval = setInterval(async () => {
      let state = await this.player.getCurrentState();
      await this.handleState(state);
      console.log('hadle state has finished');
    }, this.props.playerRefreshRateMs || 1000);
  };

  clearStatePolling = () => clearInterval(this.statePollingInterval);

  setupWebPlaybackEvents = async () => {
    let { Player } = window.Spotify;
    this.player = new Player({
      name: this.props.playerName,
      volume: this.props.playerInitialVolume,
      getOAuthToken: async (callback) => {
        if (typeof this.props.onPlayerRequestAccessToken !== 'undefined') {
          let userAccessToken = await this.props.onPlayerRequestAccessToken();
          callback(userAccessToken);
        }
      },
    });

    //setting up error handlers
    this.player.on('initialization_error', (e) => this.props.onPlayerError(e.message));
    this.player.on('authentication_error', (e) => this.props.onPlayerError(e.message));
    this.player.on('account_error', (e) => this.props.onPlayerError(e.message));
    this.player.on('playback_error', (e) => this.props.onPlayerError(e.message));
    this.player.on('player_state_changed', async (state) => await this.handleState(state));
    this.player.on('ready', (data) => this.props.onPlayerWaitingForDevice(data));

    if (this.props.playerAutoConnect) this.player.connect();
  };

  setupWaitingForDevice() {
    return new Promise((resolve) => this.player.on('ready', (data) => resolve(data)));
  }

  componentDidMount = async () => {
    let {
      onPlayerLoading,
      onPlayerWaitingForDevice,
      onPlayerDeviceSelected,
      savePlaybackInstance,
    } = this.props;

    // Notify the player is loading
    onPlayerLoading();

    // Wait for Spotify to load player
    await this.waitForSpotify();
    console.log('waitedforSpotify');

    // Setup the instance and the callbacks
    await this.setupWebPlaybackEvents();
    console.log('setupedWebplayback');

    // Wait for device to be ready
    let device_data = await this.setupWaitingForDevice();
    onPlayerWaitingForDevice(device_data);
    console.log('waitedfordivice');

    // Wait for device to be selected
    await this.waitForDeviceToBeSelected();
    onPlayerDeviceSelected();
    savePlaybackInstance(this.player);
  };

  render() {
    return <Fragment>{this.props.children}</Fragment>;
  }
}
