import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 2rem;
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.accent};
  margin-bottom: 2rem;
`;

const WalletPage: React.FC = () => {
  return (
    <Container>
      <Title>💰 Wallet</Title>
      <p>Wallet functionality will be implemented here.</p>
    </Container>
  );
};

export default WalletPage;