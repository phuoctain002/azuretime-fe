import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Select } from 'antd';
import { Translator, Translate } from 'react-auto-translate';

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
                <Select
                    className="languageToggle"
                    defaultValue="en"
                    style={{
                        width: 120,
                    }}
                    onChange={(e) => handleClick(e)}
                    options={[
                        {
                            value: 'en',
                            label: 'English',
                        },
                        {
                            value: 'vi',
                            label: 'Vietnamese',
                        },
                    ]}
                />

                <div className="navbar">
                    <ul className="navbar-list">
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
                        <Link to={'/'}>
                            <li className="navbar-list-item">{t('HOME')}</li>
                        </Link>
                        {posts &&
                            posts.map((item, index) => {
                                // return (
                                //     <Link to={'/posts/' + item.idPost}>
                                //         <li className="navbar-list-item" key={index}>
                                //             {t(`${item.title}`)}
                                //         </li>
                                //     </Link>
                                // );
                                return (
                                    <Translator
                                        // cacheProvider={cacheProvider}
                                        from="en"
                                        to="vi"
                                        googleApiKey="AIzaSyBhemOOqODaAMIlIozyrOWkiNUf98SkXNM"
                                    >
                                        <Link to={'/posts/' + item.idPost}>
                                            <li className="navbar-list-item" key={index}>
                                                <Translate>HOME</Translate>
                                            </li>
                                        </Link>
                                    </Translator>
                                );
                            })}
                    </ul>
                </div>
            </div>
        </>
    );
}

export default Header;
