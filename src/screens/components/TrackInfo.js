import React from 'react';
import styled from 'styled-components';
const TrackMeta = (props) => {
  const { album, artists, name } = props;

  return (
    <StyledTrackMeta>
      <img className="track-meta__cover" src={album.images[0].url} alt={name}></img>
      <h2 className="track-meta__artist">{artists[0].name}</h2>
      <h3 className="track-meta__song">{name}</h3>
    </StyledTrackMeta>
  );
};

const StyledTrackMeta = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 10px;

  .track-meta__cover {
    max-width: 300px;
    min-width: 64px;
  }

  .track-meta__artist {
    font-size: 2rem;
    margin-top: 2rem;
  }
  .track-meta__song {
    font-size: 1.5rem;
    margin-top: 1rem;
  }
`;

export default TrackMeta;
