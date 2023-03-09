import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Select } from 'antd';
import { Translator, Translate } from 'react-auto-translate';
import { url, path } from '../../../api/url';

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

    // example provider
    const cacheProvider = {
        get: (language, key) => ((JSON.parse(localStorage.getItem('translations')) || {})[key] || {})[language],
        set: (language, key, value) => {
            const existing = JSON.parse(localStorage.getItem('translations')) || {
                [key]: {},
            };
            existing[key] = { ...existing[key], [language]: value };
            localStorage.setItem('translations', JSON.stringify(existing));
        },
    };

    function handleClick(lang) {
        // console.log('lang', lang);
        i18n.changeLanguage(lang);
    }
    return (
        <>
            <div className="header">
                <div className="languageToggle">
                    <span className="language-btn" onClick={() => handleClick('en')}>
                        {t('English')}
                    </span>
                    <span className="language-btn" onClick={() => handleClick('vi')}>
                        {t('Vietnamese')}
                    </span>
                </div>

                <div className="navbar">
                    <ul className="navbar-list">
                        <Link to={'/'}>
                            <div className="chrono-logo">
                                <img className='chrono-logo-img' src={url + '/images/media/logo-chrono24.jpg'} alt="logo" />
                            </div>
                        </Link>
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
            </div>
        </>
    );
}

export default Header;
