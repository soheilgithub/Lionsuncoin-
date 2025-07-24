import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background: ${props => props.theme.colors.surface};
  border-top: 1px solid ${props => props.theme.colors.border};
  padding: 2rem;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <p>&copy; 2024 Lionsuncoin Gaming Platform. All rights reserved.</p>
    </FooterContainer>
  );
};

export default Footer;