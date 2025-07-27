import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

// Icons (you can replace with actual icon library)
const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 12h18m-9 6h9m-9-12h9"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>
  </svg>
);

const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14l5-5-5-5m5 5H9"/>
  </svg>
);

const NavContainer = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: ${({ theme }) => theme.zIndex.fixed};
  background: ${({ theme }) => theme.gradients.glass};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(220, 198, 160, 0.2);
  padding: 0;
  transition: ${({ theme }) => theme.transitions.normal};
  
  &.scrolled {
    background: ${({ theme }) => theme.colors.surface};
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0 ${({ theme }) => theme.spacing.md};
  }
`;

const Logo = styled(Link)`
  font-size: ${({ theme }) => theme.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  background: ${({ theme }) => theme.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: ${({ theme }) => theme.transitions.normal};

  &:hover {
    transform: scale(1.05);
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.textLight};
  text-decoration: none;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  transition: ${({ theme }) => theme.transitions.normal};
  
  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.surface};
    transform: translateY(-1px);
  }
  
  &.active {
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.soft};
  }
`;

const UserMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const UserButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  color: ${({ theme }) => theme.colors.text};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.normal};

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.medium};
    transform: translateY(-1px);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.sm};
    
    span {
      display: none;
    }
  }
`;

const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: calc(100% + ${({ theme }) => theme.spacing.sm});
  right: 0;
  min-width: 200px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.large};
  overflow: hidden;
  z-index: ${({ theme }) => theme.zIndex.dropdown};
`;

const DropdownItem = styled(motion.button)`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  border: none;
  cursor: pointer;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
  }

  &.danger {
    color: ${({ theme }) => theme.colors.error};
    
    &:hover {
      background: ${({ theme }) => theme.colors.error};
      color: white;
    }
  }
`;

const MobileMenuButton = styled(motion.button)`
  display: none;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.sm};
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  border: none;
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  transition: ${({ theme }) => theme.transitions.normal};

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.primary};
  box-shadow: ${({ theme }) => theme.shadows.large};
  z-index: ${({ theme }) => theme.zIndex.dropdown};
`;

const MobileNavLink = styled(Link)`
  display: block;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  border-bottom: 1px solid ${({ theme }) => theme.colors.primary};
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
  }
  
  &.active {
    background: ${({ theme }) => theme.colors.accent};
    color: white;
  }
`;

const RoleBadge = styled.span`
  display: inline-block;
  padding: 2px 8px;
  background: ${({ theme, role }) => 
    role === 'vendor' ? theme.colors.info : theme.colors.success
  };
  color: white;
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when location changes
  useEffect(() => {
    setShowDropdown(false);
    setShowMobileMenu(false);
  }, [location]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const vendorLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/new-order', label: 'New Order' },
    { path: '/group-buy', label: 'Group Buy' },
    { path: '/civil-score', label: 'Civil Score' },
    { path: '/supplier-ratings', label: 'Suppliers' },
    { path: '/community', label: 'Community' },
  ];

  const supplierLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/group-buy', label: 'Orders' },
    { path: '/supplier-ratings', label: 'My Ratings' },
    { path: '/community', label: 'Community' },
  ];

  const navigationLinks = isAuthenticated 
    ? (user?.role === 'vendor' ? vendorLinks : supplierLinks)
    : [];

  return (
    <NavContainer 
      className={isScrolled ? 'scrolled' : ''}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <NavContent>
        <Logo to="/">VendorHub</Logo>

        {/* Desktop Navigation */}
        <NavLinks>
          {navigationLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={isActive(link.path) ? 'active' : ''}
            >
              {link.label}
            </NavLink>
          ))}
        </NavLinks>

        {/* User Menu */}
        <UserMenu>
          {isAuthenticated ? (
            <>
              <UserButton
                onClick={() => setShowDropdown(!showDropdown)}
                whileTap={{ scale: 0.95 }}
              >
                <UserIcon />
                <span>{user?.name}</span>
                <RoleBadge role={user?.role}>{user?.role}</RoleBadge>
              </UserButton>

              <AnimatePresence>
                {showDropdown && (
                  <DropdownMenu
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <DropdownItem
                      onClick={() => {
                        navigate('/dashboard');
                        setShowDropdown(false);
                      }}
                      whileHover={{ x: 4 }}
                    >
                      <UserIcon />
                      Profile
                    </DropdownItem>
                    <DropdownItem
                      className="danger"
                      onClick={handleLogout}
                      whileHover={{ x: 4 }}
                    >
                      <LogoutIcon />
                      Logout
                    </DropdownItem>
                  </DropdownMenu>
                )}
              </AnimatePresence>
            </>
          ) : (
            <NavLinks>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </NavLinks>
          )}

          {/* Mobile Menu Button */}
          <MobileMenuButton
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            whileTap={{ scale: 0.95 }}
          >
            {showMobileMenu ? <CloseIcon /> : <MenuIcon />}
          </MobileMenuButton>
        </UserMenu>
      </NavContent>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <MobileMenu
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {isAuthenticated ? (
              <>
                {navigationLinks.map((link) => (
                  <MobileNavLink
                    key={link.path}
                    to={link.path}
                    className={isActive(link.path) ? 'active' : ''}
                  >
                    {link.label}
                  </MobileNavLink>
                ))}
                <MobileNavLink
                  as="button"
                  onClick={handleLogout}
                  style={{ 
                    width: '100%', 
                    textAlign: 'left',
                    background: 'transparent',
                    border: 'none',
                    color: 'inherit',
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                    fontWeight: 'inherit'
                  }}
                >
                  Logout
                </MobileNavLink>
              </>
            ) : (
              <>
                <MobileNavLink to="/login">Login</MobileNavLink>
                <MobileNavLink to="/register">Register</MobileNavLink>
              </>
            )}
          </MobileMenu>
        )}
      </AnimatePresence>

      {/* Click outside to close dropdowns */}
      {(showDropdown || showMobileMenu) && (
        <motion.div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -1,
          }}
          onClick={() => {
            setShowDropdown(false);
            setShowMobileMenu(false);
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </NavContainer>
  );
};

export default Navbar;
