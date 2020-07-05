import React, { Fragment } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import WebPlayBack from './Spotify/Playback';
import LoginCallBack from './Spotify/LoginCallBack';
import Intro from './screens/intro';
import NowPlaying from './screens/NowPlaying';

window.onSpotifyWebPlaybackSDKReady = () => {};

const GlobalStyle = createGlobalStyle`
*,
*::after,
*::before {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body,
html,
#root {
  margin: 0;
  padding: 0;
  height: 100%;
  min-width: 320px;
}
svg {
  fill: #ffffff;
  :hover{
    fill: #b3b3b3;

  }
}
`;
const StyledApp = styled.div`
  min-width: 570px;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`;
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
      playerInitialVolume: 0.2,
      playerRefreshRateMs: 100, //как часто будет проверяться состояние на изменения
      playerAutoConnect: true,
      onPlayerRequestAccessToken: () => userAccessToken,
      onPlayerLoading: () => this.setState({ playerLoaded: true }),
      onPlayerWaitingForDevice: (data) =>
        this.setState({ playerSelected: false, userDeviceId: data.device_id }),
      onPlayerDeviceSelected: () => this.setState({ playerSelected: true }),
      onPlayerStateChange: (playerState) => this.setState({ playerState: playerState }),
      savePlaybackInstance: (player) => {
        this.setState({ player: player });
      },
      onPlayerError: (playerError) => console.error(playerError),
    };

    //TODO написать экран, когда переключают с активного плеера, на другой девайс
    return (
      <Fragment>
        <GlobalStyle />
        <StyledApp>
          {!userAccessToken && <Intro />}
          {userAccessToken && !playerSelected && <div>Waiting for device to be selected</div>}
          {userAccessToken && (
            <WebPlayBack {...webPlaybackSdkProps}>
              {playerLoaded && playerSelected && playerState && (
                <Fragment>
                  <NowPlaying playerState={playerState} player={this.state.player} />
                </Fragment>
              )}
            </WebPlayBack>
          )}
        </StyledApp>
      </Fragment>
    );
  }
}

export default App;
