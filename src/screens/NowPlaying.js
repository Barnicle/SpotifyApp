import React, { Component } from 'react';
import styled from 'styled-components';
import { PlayBtn, PauseBtn, ForwardBtn, BackwardBtn } from '../images/svg/svg';
import Player from './components/Player';
import TrackMeta from './components/TrackInfo';
import StyledSlider from '../styles/StyledSlider';
export default class NowPlaying extends Component {
  state = {
    volume: 20,
  };
  togglePlay = async () => this.props.player.togglePlay();
  nextTrack = async () => {
    this.props.player.nextTrack();
    console.log('next track');
  };
  prevTrack = async () => this.props.player.previousTrack();
  shuffleTracks = async () => {
    const token = this.props.onPlayerRequestAccessToken();
    try {
      fetch('https://api.spotify.com/v1/me/player', {
        method: 'PUT',
        body: JSON.stringify({ device_ids: [device_id] }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.log('Error', error);
    }
  };

  handleSeek = async (e) => {
    const position = e.target.value;
    await this.props.player;
    this.props.player.seek(position);
  };

  setVolume = async (e) => {
    const volume = e.target.value;
    const position = e.target.value / 100;
    await this.props.player;
    await this.props.player.setVolume(position);
    this.setState({
      volume: volume,
    });
  };

  toggleBtn = () => {
    return this.props.playerState.paused ? (
      <a onClick={this.togglePlay}>
        <PlayBtn />
      </a>
    ) : (
      <a onClick={this.togglePlay}>
        <PauseBtn />
      </a>
    );
  };

  //TODO если девайс не активен, то при нажатии на кнопки он должен все равно переключать трек, а при нажатии на "играть" если песня остановлена должен включить её на Spotify App
  //TODO сохранять последнюю громкость в localState;
  msToTime = (ms) => {
    const toTwoDigitFormat = (digit, format = 2) => {
      return ('00' + digit).slice(-format);
    };
    let s = Math.trunc(ms / 1000);
    let m = Math.trunc(s / 60);
    let h = Math.trunc(m / 60);
    s = s % 60;
    s = toTwoDigitFormat(s);
    const time = [h, m, s];
    ('');
    return `${time[0] != 0 ? time[0] + ':' : ''}${time[1] == '00' ? '0' : time[1]}:${time[2]}`;
  };

  getProgressOfTrack = (duration, position) => Math.trunc(position * 100) / duration;

  render() {
    let { duration: duration_ms, position: position_ms } = this.props.playerState;
    return (
      <React.Fragment>
        <TrackMeta {...this.props.playerState.track_window.current_track} />
        <PlayerWrapper>
          <MainWrapper>
            <StyledControls>
              <a onClick={this.prevTrack}>
                <BackwardBtn />
              </a>
              {this.toggleBtn()}
              <a onClick={this.nextTrack}>
                <ForwardBtn />
              </a>
            </StyledControls>
            <ProgressBarWrapper>
              <h3>{this.msToTime(position_ms)}</h3>

              <StyledSlider
                type={'range'}
                min={0}
                max={duration_ms}
                value={position_ms}
                position={this.getProgressOfTrack(duration_ms, position_ms)}
                onChange={(e) => this.handleSeek(e)}
              />

              <h3>{this.msToTime(duration_ms)}</h3>
            </ProgressBarWrapper>
          </MainWrapper>

          <StyledSlider
            type={'range'}
            min={0}
            max={100}
            value={this.state.volume}
            minWidth={'100px'}
            position={this.getProgressOfTrack(100, this.state.volume)}
            onChange={this.setVolume}
          />
        </PlayerWrapper>
      </React.Fragment>
    );
  }
}
const PlayerWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 150px;
  place-items: center;
  background: black;
  width: 100%;
  padding: 30px;
  @media (max-width: 750px) {
    grid-template-columns: auto;
    grid-template-rows: 1fr auto;
    grid-gap: 2rem;
    padding: 10px;
  }
`;
const MainWrapper = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  margin-left: 150px;
  @media (max-width: 750px) {
    margin-left: 0;
  }
`;
const StyledControls = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const ProgressBarWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-around;
  color: gray;
  font-size: 0.7rem;
`;
