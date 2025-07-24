import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const NavContainer = styled(motion.nav)`
  position: sticky;
  top: 0;
  z-index: 1000;
  background: ${props => props.theme.colors.surface}ee;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.accent};
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.text};
`;

const ThemeToggle = styled.button`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 0.5rem;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all ${props => props.theme.animations.fast};
  
  &:hover {
    background: ${props => props.theme.colors.border};
  }
`;

interface NavbarProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick, sidebarOpen }) => {
  const { user, isAuthenticated } = useAuth();
  const { toggleTheme, themeName } = useTheme();

  return (
    <NavContainer
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {isAuthenticated && (
          <MenuButton onClick={onMenuClick}>
            {sidebarOpen ? '✕' : '☰'}
          </MenuButton>
        )}
        <Logo>
          🦁 Lionsuncoin Gaming
        </Logo>
      </div>
      
      <NavActions>
        <ThemeToggle onClick={toggleTheme}>
          {themeName === 'dark' ? '🌙' : '☀️'}
        </ThemeToggle>
        
        {isAuthenticated && user && (
          <UserInfo>
            <span>👋 {user.username}</span>
            <span>🪙 {user.coins}</span>
          </UserInfo>
        )}
      </NavActions>
    </NavContainer>
  );
};

export default Navbar;