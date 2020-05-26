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
  }
  componentDidMount = () => {
    LoginCallBack({
      onSuccessfulAuthorization: this.onSuccessfulAuthorization.bind(this),
      onAccessTokenExpiration: this.onAccessTokenExpiration.bind(this),
    });
  };

  onSuccessfulAuthorization = (accessToken) => {
    this.setState({
      userAccessToken: accessToken,
    });
  };

  onAccessTokenExpiration = () => {
    this.setState({
      userDeviceId: null,
      userAccessToken: null,
      playerLoaded: false,
      playerSelected: false,
      playerState: null,
    });

    console.error('The user access token has expired.');
  };

  render() {
    let { userAccessToken, playerLoaded, playerSelected, playerState } = this.state;

    let webPlaybackSdkProps = {
      playerName: 'Spotify App',
      playerInitialVolume: .2,
      playerRefreshRateMs: 300, //как часто будет проверяться состояние на изменения
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

    
    //TODO написать экран, когда переключают с активного плеера, на другой девайс
    return (
      <div className="app app__background">
        {!userAccessToken && <Intro />}
        {userAccessToken && (
          <WebPlayBack {...webPlaybackSdkProps}>
            {playerLoaded  && playerState && (
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
