import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 2rem;
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.accent};
  margin-bottom: 2rem;
`;

const DashboardPage: React.FC = () => {
  return (
    <Container>
      <Title>🏠 Dashboard</Title>
      <p>Dashboard content will be implemented here.</p>
    </Container>
  );
};

export default DashboardPage;