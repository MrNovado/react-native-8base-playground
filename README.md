# Quirks

- `paper` uses `react-native-vector-icons`; list of all avaliable icons could be found here:
  - https://callstack.github.io/react-native-paper/icons.html
  - https://materialdesignicons.com/

# Issues

- Inflightlink observables cannot serialize cyclic structures (`@apollo/client`)
  - https://github.com/apollographql/apollo-client/issues/1291#issuecomment-367911441
  - basically, never put a `refetch` method straight into an event-handler-prop like `<button onClick={refetch} />`
  - instead wrap the `refetch` method: `<button onClick={() => refetch()} />` or `const handleRefetch = () => {...; refetch()}`

- Filestack support & integration:
  - `filestack-react` does not support react-native https://github.com/filestack/filestack-react/issues/4
  - https://docs.8base.com/docs/development-tools/sdk/filestack-uploader/#react-native-support

- Auth0 package has to be configured for each native environment independently
  - https://github.com/auth0/react-native-auth0#getting-started

- Working with `env` variables
  - Android Manifest https://stackoverflow.com/questions/58912959/access-environment-variable-in-react-native-androidmanifest-xml