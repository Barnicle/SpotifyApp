import styled, { createGlobalStyle } from 'styled-components';

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
    h3, h2 {
    cursor: default;
  }
}
`;
export default GlobalStyle;
