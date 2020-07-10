export default {
  logInWithSpotify: () => {
    let client_id = 'a9aa83fe08914a3e99d63bc37d0bd996';
    let redirect_uri = 'http://localhost:3000/callback';
    let scopes =
      'streaming user-read-private user-read-email user-modify-playback-state user-read-currently-playing user-read-playback-state';
    let scopes_encoded = scopes.replace(' ', '%20');
    //редирект на сайт спотифая, чтобы получить токен
    window.location = [
      'https://accounts.spotify.com/authorize',
      `?client_id=${client_id}`,
      `&redirect_uri=${redirect_uri}`,
      `&scope=${scopes_encoded}`,
      '&response_type=token',
      '&show_dialog=true',
      'SameSite=None',
      'Secure',
    ].join('');
  },
};
