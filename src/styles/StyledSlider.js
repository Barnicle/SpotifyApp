const StyledSlider = styled.input.attrs((props) => ({
  style: {
    background: `linear-gradient(to right, #1db954 0 ${props.position}%, #282828 ${props.position}% 100%)`,
  },
}))`
  -webkit-appearance: none;
  min-width: ${(props) => props.minWidth || '200px'};
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
export default StyledSlider;
