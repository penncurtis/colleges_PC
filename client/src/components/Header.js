import logo from '../athena_transparent.png'; // Replace 'logo.png' with the actual filename and path of your logo

function Header() {
    const handleLogoClick = () => {
      // Redirect logic here
      window.location.href = "/";
    };
  
    return (
      <header className="header-box">
        <div className="logo-container">
          <a href="/" onClick={handleLogoClick}>
            <img src={logo} alt="Logo" className="logo" />
          </a>
        </div>
      </header>
    );
}
  
export default Header;
