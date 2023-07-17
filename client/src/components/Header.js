import logo from '../logo_final.png'; // Replace 'logo.png' with the actual filename and path of your logo

function Header() {
  return (
    <header className="header-box">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
    </header>
  );
}

export default Header;

  
  
  