import React, { Component } from 'react';

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

  render() {
    let { album, artists, name } = this.props.playerState.track_window.current_track;
    return (
      <React.Fragment>
        <div className="track-meta__container">
          <img className="track-meta__cover" src={album.images[0].url} alt={name}></img>
          <h2 className="track-meta__artist">{artists[0].name}</h2>
          <h3 className="track-meta__song">{name}</h3>
        </div>
        <div>
          <button onClick={this.prevTrack}>Preveous track</button>
          <button onClick={this.togglePlay}>Play</button>
          <button onClick={this.nextTrack}>Next track</button>
        </div>
      </React.Fragment>
    );
  }
}
