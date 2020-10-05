# Issues

- Inflightlink observables cannot serialize cyclic structures (`@apollo/client`)
  - https://github.com/apollographql/apollo-client/issues/1291#issuecomment-367911441
  - basically, never put a `refetch` method straight into an event-handler-prop like `<button onClick={refetch} />`
  - instead wrap the `refetch` method: `<button onClick={() => refetch()} />` or `const handleRefetch = () => {...; refetch()}`