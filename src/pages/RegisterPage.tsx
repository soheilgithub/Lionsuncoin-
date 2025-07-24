import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const RegisterForm = styled.div`
  background: ${props => props.theme.colors.surface};
  padding: 2rem;
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.theme.colors.border};
  max-width: 400px;
  width: 100%;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  color: ${props => props.theme.colors.accent};
`;

const RegisterPage: React.FC = () => {
  return (
    <Container>
      <RegisterForm>
        <Title>🦁 Join Lionsuncoin</Title>
        <p style={{ textAlign: 'center', color: 'var(--color-textSecondary)' }}>
          Registration functionality will be implemented here.
        </p>
      </RegisterForm>
    </Container>
  );
};

export default RegisterPage;