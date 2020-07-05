import React, { Component } from 'react';
import styled from 'styled-components';
import { PlayBtn, PauseBtn, ForwardBtn, BackwardBtn } from '../images/svg/svg';

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
    let { album, artists, name } = this.props.playerState.track_window.current_track;
    let { duration: duration_ms, position: position_ms } = this.props.playerState;
    return (
      <React.Fragment>
        <div className="track-meta__container">
          <img className="track-meta__cover" src={album.images[0].url} alt={name}></img>
          <h2 className="track-meta__artist">{artists[0].name}</h2>
          <h3 className="track-meta__song">{name}</h3>
        </div>
        <PlayerWrapper className="player">
          <MainWrapper>
            <div>
              <a onClick={this.prevTrack}>
                <BackwardBtn />
              </a>
              {this.toggleBtn()}
              <a onClick={this.nextTrack}>
                <ForwardBtn />
              </a>
            </div>
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
          <VolumeWrapper>
            <StyledSlider
              type={'range'}
              min={0}
              max={100}
              value={this.state.volume}
              minWidth={'100px'}
              position={this.getProgressOfTrack(100, this.state.volume)}
              onChange={this.setVolume}
            />
          </VolumeWrapper>
        </PlayerWrapper>
      </React.Fragment>
    );
  }
}

const StyledSlider = styled.input.attrs((props) => ({
  style: {
    background: `linear-gradient(to right, #1db954 0 ${props.position}%, #282828 ${props.position}% 100%)`,
  },
}))`
  -webkit-appearance: none;
  min-width: ${(props) => props.minWidth || '300px'};
  height: 4px;
  border-radius: 5px;
  margin: 0 1rem 0 1rem;
  outline: none;

  ::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    display: none;
    width: 10px;
    height: 10px;
    background: #1db954;
    border-radius: 50%;
  }
  ::-moz-range-thumb {
    width: 10px;
    height: 10px;
    background: #1db954;
  }

  :hover {
    ::-moz-range-thumb {
      display: block;
    }
    ::-webkit-slider-thumb {
      display: block;
    }
  }
`;

const ProgressBarWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-around;
  color: gray;
  font-size: 0.7rem;
`;

const PlayerWrapper = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
`;

const MainWrapper = styled.div`
  position: absolute;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  margin-right: auto;
  margin-left: auto;
  bottom: 0;
`;
const VolumeWrapper = styled.div`
  display: flex;
  margin-left: auto;
`;
