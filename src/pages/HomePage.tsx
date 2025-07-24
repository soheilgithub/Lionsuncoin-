import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
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

const Hero = styled(motion.div)`
  max-width: 800px;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  background: ${props => props.theme.gradients.accent};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 3rem;
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled(Link)`
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

const SecondaryButton = styled(Button)`
  background: transparent;
  color: ${props => props.theme.colors.accent};
  border: 2px solid ${props => props.theme.colors.accent};
  
  &:hover {
    background: ${props => props.theme.colors.accent};
    color: ${props => props.theme.colors.primary};
  }
`;

const HomePage: React.FC = () => {
  return (
    <Container>
      <Hero
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Title>🦁 Welcome to Lionsuncoin Gaming</Title>
        <Subtitle>
          Experience the future of gaming with cryptocurrency rewards. 
          Play games, earn coins, and compete with players worldwide.
        </Subtitle>
        <ButtonGroup>
          <Button to="/register">Get Started</Button>
          <SecondaryButton to="/login">Sign In</SecondaryButton>
        </ButtonGroup>
      </Hero>
    </Container>
  );
};

export default HomePage;