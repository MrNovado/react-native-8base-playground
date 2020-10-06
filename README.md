# Quirks

- `paper` uses `react-native-vector-icons`; list of all avaliable icons could be found here:
  - https://callstack.github.io/react-native-paper/icons.html
  - https://materialdesignicons.com/

- UI: `paper`/react-native quirk: `React.Fragment` does not let styles to propagate, so you should return arrays instead of wrapping components into fragments, like 

```js
[
  <Appbar.Action key={0} ... />,
  <Appbar.Action key={1} ... />,
  ...
]
```

# Issues

- Auth0 !!! Do not forget to actually select the type of your auth0-app-type
  - Regular web app works: https://community.auth0.com/t/success-login-and-a-failed-exchange/41513/10

- Inflightlink observables cannot serialize cyclic structures (`@apollo/client`)
  - https://github.com/apollographql/apollo-client/issues/1291#issuecomment-367911441
  - basically, never put a `refetch` method straight into an event-handler-prop like `<button onClick={refetch} />`
  - instead wrap the `refetch` method: `<button onClick={() => refetch()} />` or `const handleRefetch = () => {...; refetch()}`

- Filestack support & integration:
  - `filestack-react` does not support react-native https://github.com/filestack/filestack-react/issues/4
  - https://docs.8base.com/docs/development-tools/sdk/filestack-uploader/#react-native-support

- Auth0 package has to be configured for each native environment independently
  - https://github.com/auth0/react-native-auth0#getting-started

- Working with `env` variables (private keys workflow)
  - Android Manifest
    - https://stackoverflow.com/questions/58912959/access-environment-variable-in-react-native-androidmanifest-xml
  - There's no silver bullet in how `env` variables could be organized
    - https://github.com/luggit/react-native-config
    - https://www.npmjs.com/package/react-native-dotenv
  - It is possible to simply use `gitignore` to ignore config artefacts
    - `src/env.json` (note: hiding json files by prepending them with `.` will break `sha` decoding)
    - `android/app/src/main/res/values/apikeys.xml`

# APIKEYS

`android/app/src/main/res/values/apikeys.xml`

```
<resources>
    <string name="auth_domain">AUTH0_DOMAIN</string>
</resources>
```
