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

  setToTimeFormat = (time_ms) => {
    const time_h = Math.trunc(time_ms % 60000);
    const time_s = Math.trunc(time_ms % 60000);
    const time_m = Math.trunc(time_ms / 60000);
    const time = `${time_m}:${time_s}`;
    return time;
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
          <h3>{this.setToTimeFormat(duration_ms)}</h3>
          <h3>{this.setToTimeFormat(position_ms)}</h3>
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
