import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';

const SidebarOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const SidebarContainer = styled(motion.aside)`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 280px;
  background: ${props => props.theme.colors.surface};
  border-right: 1px solid ${props => props.theme.colors.border};
  z-index: 1000;
  padding: 6rem 0 2rem 0;
  overflow-y: auto;
`;

const NavList = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
`;

const NavItem = styled.li`
  margin: 0;
`;

const NavLinkStyled = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 2rem;
  color: ${props => props.theme.colors.textSecondary};
  text-decoration: none;
  transition: all ${props => props.theme.animations.fast};
  
  &:hover {
    background: ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.text};
  }
  
  &.active {
    background: ${props => props.theme.colors.accent}22;
    color: ${props => props.theme.colors.accent};
    border-right: 3px solid ${props => props.theme.colors.accent};
  }
`;

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  platform: string;
}

const navItems = [
  { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { path: '/games', icon: '🎮', label: 'Games' },
  { path: '/wallet', icon: '💰', label: 'Wallet' },
  { path: '/leaderboard', icon: '🏆', label: 'Leaderboard' },
  { path: '/profile', icon: '👤', label: 'Profile' },
  { path: '/settings', icon: '⚙️', label: 'Settings' },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, platform }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <SidebarOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <SidebarContainer
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <NavList>
              {navItems.map((item) => (
                <NavItem key={item.path}>
                  <NavLinkStyled
                    to={item.path}
                    onClick={() => window.innerWidth <= 768 && onClose()}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </NavLinkStyled>
                </NavItem>
              ))}
            </NavList>
          </SidebarContainer>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;