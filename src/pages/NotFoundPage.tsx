import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2rem;
`;

const ErrorCode = styled.h1`
  font-size: 6rem;
  color: ${props => props.theme.colors.accent};
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
`;

const Message = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 2rem;
`;

const HomeButton = styled(Link)`
  background: ${props => props.theme.gradients.accent};
  color: ${props => props.theme.colors.primary};
  padding: 1rem 2rem;
  border-radius: ${props => props.theme.borderRadius.lg};
  text-decoration: none;
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  transition: all ${props => props.theme.animations.fast};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

const NotFoundPage: React.FC = () => {
  return (
    <Container>
      <ErrorCode>404</ErrorCode>
      <Title>Page Not Found</Title>
      <Message>The page you're looking for doesn't exist.</Message>
      <HomeButton to="/">Go Home</HomeButton>
    </Container>
  );
};

export default NotFoundPage;