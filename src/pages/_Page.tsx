import React from 'react';
import styled from 'styled-components/native';
import { StatusBar } from 'react-native';

const Container = styled.SafeAreaView`
  flex: 1;
`;

export default function PageContainer(props: { children: JSX.Element }) {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Container>{props.children}</Container>
    </>
  );
}
