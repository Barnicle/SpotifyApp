import React, { Component, F } from 'react';
import styled from 'styled-components';
import Login from '../Spotify/Login.js';

const LoginButton = styled.button`
  padding: 20px;
  font-size: 1rem;
  font-weight: bolder;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #ffffff;
  background-color: #1db954;
  border: 1px solid transparent;
  border-radius: 20px;
  width: 15rem;
  min-width: 160px;
  outline: none;
  :hover {
    background-color: #1ed760;
    transition: all 1s ease;
  }
`;

const IntroScreen = () => (
  <LoginButton onClick={() => Login.logInWithSpotify()}>Log in with Spotify</LoginButton>
);
export default IntroScreen;
