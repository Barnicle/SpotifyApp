import React, { Fragment } from 'react';
import WebPlayBack from './Spotify/Playback';
import LoginCallBack from './Spotify/LoginCallBack';
import Intro from './screens/intro';
import NowPlaying from './screens/NowPlaying';
window.onSpotifyWebPlaybackSDKReady = () => {};

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      //credentials
      userDeviceId: null,
      userAccessToken: null,
      //player state
      playerLoaded: false,
      playerSelected: false,
      player: null,
      playerState: null,
    };
    console.log(this.state);
    if (this.state.userAccessToken) localStorage.setItem('state', JSON.stringify(this.state));
  }
  componentDidMount = () => {
    LoginCallBack({
      onSuccessfulAuthorization: this.onSuccessfulAuthorization.bind(this),
      onAccessTokenExpiration: this.onAccessTokenExpiration.bind(this),
    });
  };

  componentWillUnmount = () => {
    localStorage.setItem('state', JSON.stringify(this.state));
  };

  onSuccessfulAuthorization(accessToken) {
    this.setState({
      userAccessToken: accessToken,
    });
  }

  onAccessTokenExpiration() {
    this.setState({
      userDeviceId: null,
      userAccessToken: null,
      playerLoaded: false,
      playerSelected: false,
      playerState: null,
    });

    console.error('The user access token has expired.');
  }

  render() {
    let { userAccessToken, playerLoaded, playerSelected, playerState } = this.state;

    let webPlaybackSdkProps = {
      playerName: 'Spotify App',
      playerInitialVolume: 1.0,
      playerRefreshRateMs: 100,
      playerAutoConnect: true,
      onPlayerRequestAccessToken: () => userAccessToken,
      onPlayerLoading: () => this.setState({ playerLoaded: true }),
      onPlayerWaitingForDevice: (data) =>
        this.setState({ playerSelected: false, userDeviceId: data.device_id }),
      onPlayerDeviceSelected: () => this.setState({ playerSelected: true }),
      onPlayerStateChange: (playerState) => this.setState({ playerState: playerState }),
      savePlaybackInstance: (player) => {
        this.setState({ player: player });
        console.log(this.state);
      },
      onPlayerError: (playerError) => console.error(playerError),
    };

    return (
      <div className="app">
        {!this.state.userAccessToken && <Intro />}

        {userAccessToken && (
          <WebPlayBack {...webPlaybackSdkProps}>
            {playerLoaded && playerSelected && playerState && (
              <Fragment>
                <NowPlaying playerState={playerState} player={this.state.player} />
              </Fragment>
            )}
          </WebPlayBack>
        )}
      </div>
    );
  }
}

export default App;
