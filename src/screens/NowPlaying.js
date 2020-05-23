import React, { Component } from 'react';

import { PlayBtn, PauseBtn, ForwardBtn, BackwardBtn } from '../images/svg/svg';
export default class NowPlaying extends Component {
  togglePlay = async () => {
    await this.props.player;
    this.props.player.togglePlay().then(() => console.log('Toggled state'));
  };
  nextTrack = async () => {
    await this.props.player;
    this.props.player.nextTrack().then(() => console.log('Next Track'));
  };
  prevTrack = async () => {
    await this.props.player;
    this.props.player.previousTrack().then(() => console.log('Next Track'));
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
  
  //TODO нужно, чтобы когда минут 0 показывалось не 00, а 0.
  msToTime = (ms) => {
    const toTwoDigitFormat = (digit, format =2) => {
      return (('00'+digit).slice(-format));
    }
    let s = Math.trunc((ms / 1000));
    let m = Math.trunc(s / 60);
    let h = Math.trunc(m / 60);
    s = s % 60;
    h = toTwoDigitFormat(h);
    m = toTwoDigitFormat(m);
    s = toTwoDigitFormat(s)
    const time = [h, m, s];
    return (`${time[0]!=0?time[0]+ ':':''}${time[1]}:${time[2]}`);
  };

  render() {
    let { album, artists, name } = this.props.playerState.track_window.current_track;
    let { duration: duration_ms, position: position_ms } = this.props.playerState;
    console.log();
    return (
      <React.Fragment>
        <div className="track-meta__container">
          <img className="track-meta__cover" src={album.images[0].url} alt={name}></img>
          <h2 className="track-meta__artist">{artists[0].name}</h2>
          <h3 className="track-meta__song">{name}</h3>
          <h3>{this.msToTime(duration_ms)}</h3>
          <h3>{this.msToTime(position_ms)}</h3>
        </div>
        <div className="player">
          <div className="track-position__container"></div>
          <a onClick={this.prevTrack}>
            <BackwardBtn />
          </a>
          {this.toggleBtn()}
          <a onClick={this.nextTrack}>
            <ForwardBtn />
          </a>
        </div>
      </React.Fragment>
    );
  }
}
