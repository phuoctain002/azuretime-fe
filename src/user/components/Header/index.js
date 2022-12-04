import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

function Header() {
    const { t, i18n } = useTranslation();
    const posts = [
        {
            idPost: 1,
            title: 'about us',
        },
        {
            idPost: 2,
            title: 'how to buy',
        },
        {
            idPost: 3,
            title: 'terms of us',
        },
    ];

    function handleClick(lang) {
        i18n.changeLanguage(lang);
    }
    return (
        <>
            <div className="header">
                <div className="languageToggle">
                    <div className="btnLang" onClick={() => handleClick('en')}>
                        English
                    </div>
                    <div className="btnLang" onClick={() => handleClick('vi')}>
                        Vietnamese
                    </div>
                </div>
                <div className="navbar">
                    <ul className="navbar-list">
                        <Link to={'/'}>
                            <li className="navbar-list-item">{t('HOME')}</li>
                        </Link>
                        {posts &&
                            posts.map((item, index) => {
                                return (
                                    <Link to={'/posts/' + item.idPost}>
                                        <li className="navbar-list-item" key={index}>
                                            {t(`${item.title}`)}
                                        </li>
                                    </Link>
                                );
                            })}
                    </ul>
                </div>
                <Link to={'/'}>
                    <div className="azure-logo">
                        <img
                            src={
                                'https://firebasestorage.googleapis.com/v0/b/firjewelry-871f7.appspot.com/o/Watch-Logo%2Flogo.png?alt=media&token=9c5b4894-5e64-49d7-a069-29df3bd6b315'
                            }
                            alt="logo"
                        />
                    </div>
                </Link>
            </div>
        </>
    );
}

export default Header;
