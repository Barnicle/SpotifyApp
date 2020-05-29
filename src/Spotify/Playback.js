import React, { Component, Fragment } from "react";

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
      await this.waitForDeviceToBeSelected();
      this.props.onPlayerDeviceSelected();
    }
  };

  waitForSpotify = () => {
    return new Promise((resolve) => {
      if ("Spotify" in window) {
        resolve();
      } else {
        window.onSpotifyWebPlaybackSDKReady = () => {
          resolve();
        };
      }
    });
  };

  // Обновляет стейт через промежутки, после того как был подключен девайс
  waitForDeviceToBeSelected = () =>
    new Promise((resolve) => {
      console.log("waiting");
      this.deviceSelectedInterval = setInterval(() => {
        if (this.player) {
          this.player.getCurrentState().then((state) => {
            if (state !== null) {
              this.startStatePolling();
              clearInterval(this.deviceSelectedInterval);
              resolve(state);
            }
          });
        } else this.clearStatePolling();
      });
    });

  startStatePolling = () => {
    this.statePollingInterval = setInterval(async () => {
      let state = await this.player.getCurrentState();
      await this.handleState(state);
    }, this.props.playerRefreshRateMs || 1000);
  };

  clearStatePolling = () => clearInterval(this.statePollingInterval);

  setupWebPlaybackEvents = async () => {
    let { Player } = window.Spotify;
    this.player = new Player({
      name: this.props.playerName,
      volume: this.props.playerInitialVolume,
      getOAuthToken: async (callback) => {
        if (typeof this.props.onPlayerRequestAccessToken !== "undefined") {
          let userAccessToken = await this.props.onPlayerRequestAccessToken();
          callback(userAccessToken);
        }
      },
    });

    //setting up error handlers
    this.player.on("initialization_error", (e) =>
      this.props.onPlayerError(e.message)
    );
    this.player.on("authentication_error", (e) =>
      this.props.onPlayerError(e.message)
    );
    this.player.on("account_error", (e) => this.props.onPlayerError(e.message));
    this.player.on("playback_error", (e) =>
      this.props.onPlayerError(e.message)
    );
    this.player.on(
      "player_state_changed",
      async (state) => await this.handleState(state)
    );
    this.player.on("ready", (data) =>
      this.props.onPlayerWaitingForDevice(data)
    );

    if (this.props.playerAutoConnect) this.player.connect();
  };

  setupWaitingForDevice() {
    return new Promise((resolve) =>
      this.player.on("ready", (data) => resolve(data))
    );
  }

  selectDevice = async ({ device_id }) => {
    const token = this.props.onPlayerRequestAccessToken();
    try {
      fetch("https://api.spotify.com/v1/me/player", {
        method: "PUT",
        body: JSON.stringify({ device_ids: [device_id] }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.log("Error", error);
    }
  };
  getUserInfo = async () => {
    const token = this.props.onPlayerRequestAccessToken();
    try {
      fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((user) => user.json())
        .then((data) => {
          console.log(data);
        });
    } catch (error) {
      console.log("Error", error);
    }
  };
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
    console.log("waitedforSpotify");

    // Setup the instance and the callbacks
    await this.setupWebPlaybackEvents();
    console.log("setupedWebplayback");

    // Wait for device to be ready
    let device_data = await this.setupWaitingForDevice();
    onPlayerWaitingForDevice(device_data);

    await this.selectDevice(device_data);
    await this.waitForDeviceToBeSelected();
    console.log("waited for device");
    console.log("device selected");
    onPlayerDeviceSelected();
    await this.getUserInfo();
    savePlaybackInstance(this.player);
  };

  render() {
    return <Fragment>{this.props.children}</Fragment>;
  }
}
