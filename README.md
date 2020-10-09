# Plan

- [x] Try `paper`
- [x] Try `styled-components/native`
- [x] Work out simple workflow using private api-keys
- [x] Install appollo & make sure it can query stuff from a non-restricted 8base-workspace
- [x] Install auth0 & make sure it can be used for simple oauth
- [x] Link auth-token to gql-requests via gql-links
  - [x] Test auth link against restricted workspace
- [ ] Find a solution to filestack
- [x] Find a solution to routing (note: `react-navigation` conflicts wtih auth0 web-flow)

# Quirks

- `paper` uses `react-native-vector-icons` __which you will have to link manually!__; list of all avaliable icons could be found here:
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

- `apollo/@client` `v3` ~~links are not working for some reason (at least for the Android)~~
  - https://github.com/apollographql/apollo-client/issues/6520 ?? subs
  - https://github.com/apollographql/apollo-client/issues/7126 ?? some other network issue
  - You have to use `HttpLink` in order to set your endpoint' `URI`! Setting `uri` directly in the apollo' config `new ApolloClient({ uri })` makes network flaky when you start adding links!
  - The issue was you should never mix setting `uri` to the apollo config & links together. Either use `uri` or `links` -- not both.

- Auth0 !!! Do not forget to actually select the type of your auth0-app-type
  - Regular web app works: https://community.auth0.com/t/success-login-and-a-failed-exchange/41513/10

- Auth0 -- configure & set callbacks:
  - https://github.com/auth0/react-native-auth0#configuration
  - https://github.com/auth0/react-native-auth0#callback-urls

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
