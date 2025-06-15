import { Link, useLocation } from 'react-router-dom';
import logo from "../../images/logo.svg";
import '../../blocks/header.css';

function Header({ loggedIn, userEmail, onLogout }) {
    const location = useLocation();

    return (
        <header className="header">
            <img
                src={logo}
                alt="Logo de la pagina"
                className="header__logo"
            />
            <nav className="header__nav">
                {loggedIn ? (
                    <div className="header__user-info">
                        <p className="header__email">{userEmail}</p>
                        <button 
                            className="header__logout-button" 
                            onClick={onLogout}
                        >
                            Encerrar sessão
                        </button>
                    </div>
                ) : (
                    <div className="header__auth-links">
                        {location.pathname === '/signin' && (
                            <Link 
                                to="/signup" 
                                className="header__link"
                            >
                                Cadastre-se
                            </Link>
                        )}
                        {location.pathname === '/signup' && (
                            <Link 
                                to="/signin" 
                                className="header__link"
                            >
                                Iniciar sessão
                            </Link>
                        )}
                    </div>
                )}
            </nav>
        </header>
    );
}

export default Header;