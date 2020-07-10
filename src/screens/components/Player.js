import React from 'react';
import styled from 'styled-components';
const Player = (props) => (
  <PlayerWrapper>
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
);
export default Player;

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
  display: grid;
  grid-template-rows: 1fr auto;
  align-items: center;
  background: black;

  width: 100%;
  padding: 30px;
`;

const MainWrapper = styled.div`
  display: grid;
  grid-template-rows: 1fr auto;
  align-items: center;
  margin-right: auto;
  margin-left: auto;
  bottom: 0;
`;
