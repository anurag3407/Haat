// Test file to check Navbar export
try {
  const Navbar = require('./src/components/Navbar.jsx');
  console.log('Navbar imported successfully:', typeof Navbar);
} catch (error) {
  console.error('Import error:', error.message);
}
