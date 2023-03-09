import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { url } from '../../../api/url';
import { urnBrand } from '../../../api/urn';
import { useTranslation } from 'react-i18next';
import '../../../App.css';
import { BrandList } from './BrandList';
import { useDispatch, useSelector } from 'react-redux';
import { clickMainMenu } from 'src/redux/slice/sidebar';

function Sidebar(props) {
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const [brand, setBrand] = useState([]);
    const [wristWatches, setWristWatches] = useState([]);
    const [accessories, setAccessories] = useState([]);
    const [searchInput, setSearchInput] = useState('');

    const currentIndex = useSelector((state) => state.sidebar.mainMenu.index);

    useEffect(() => {
        // get Brands
        axios.get(url + urnBrand).then((res) => {
            setBrand(res.data);
            setWristWatches(res.data.filter((w) => w.idMenu === 1));
            setAccessories(res.data.filter((w) => w.idMenu === 3));
        });
    }, []);
    console.log(currentIndex);

    return (
        <>
            <div className="sidebar">
                <div className="search">
                    <label className="search-label">{t('Search.1')}</label>
                    <div className="input-form">
                        <input className="search-input" onChange={(e) => setSearchInput(e.target.value)} />
                        {searchInput !== '' ? (
                            <Link to={'/search/' + searchInput}>
                                <div className="search-btn">
                                    <span>{t('Search.2')}</span>
                                </div>
                            </Link>
                        ) : (
                            <Link to={'/'}>
                                <div className="search-btn">
                                    <span>{t('Search.2')}</span>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>

                <div className="produts">
                    <ul className="main-level fade-sidebar-0dot3s">
                        <li>
                            <span
                                className={`main-level-heading ${currentIndex === 0 ? ' active' : ''}`}
                                onClick={() => {
                                    dispatch(
                                        clickMainMenu({
                                            index: 0,
                                            idMenu: 0,
                                            nameMenu: 'WRIST WATCHES',
                                        }),
                                    );
                                }}
                            >
                                {t('WRIST WATCHES')}
                            </span>
                            {currentIndex === 0 && <BrandList className="brand-list" dataBrand={wristWatches} />}
                        </li>
                        <li>
                            <span
                                className={`main-level-heading ${currentIndex === 1 ? ' active' : ''}`}
                                onClick={() => {
                                    dispatch(
                                        clickMainMenu({
                                            index: 1,
                                            idMenu: 1,
                                            nameMenu: 'WATCHES ACCESSORIES',
                                        }),
                                    );
                                }}
                            >
                                {t('WATCHES ACCESSORIES')}
                            </span>
                            {currentIndex === 1 && <BrandList className="brand-list" dataBrand={accessories} />}
                        </li>
                        <li>
                            <Link>
                                <span
                                    className={`main-level-heading ${currentIndex === 2 ? ' active' : ''}`}
                                    onClick={() => {
                                        dispatch(
                                            clickMainMenu({
                                                index: 2,
                                                idMenu: 2,
                                                nameMenu: 'POCKET WATCHES',
                                            }),
                                        );
                                    }}
                                >
                                    {t('POCKET WATCHES')}
                                </span>
                            </Link>
                        </li>

                        <li>
                            <Link>
                                <span
                                    className={`main-level-heading ${currentIndex === 4 ? ' active' : ''}`}
                                    onClick={() => {
                                        dispatch(
                                            clickMainMenu({
                                                index: 3,
                                                idMenu: 3,
                                                nameMenu: 'CLOCK',
                                            }),
                                        );
                                    }}
                                >
                                    {t('CLOCK')}
                                </span>
                            </Link>
                        </li>
                    </ul>
                </div>

                <hr className="hrSidebar" />

                {/* <div className="online">
                    <div>
                        <h3 className="whoonline">WHO'S ONLINE</h3>
                    </div>
                    <div>
                        <span id="counter-online" className="counter-online">
                            0
                        </span>
                    </div>
                    <div className="counter-visitor">
                        <h3 className="counter-heading">VISITORS COUNTER</h3>
                        <div className="powr-hit-counter" id="a1c9800e_1667897893"></div>
                    </div>
                </div> */}

                <div className="chrono24-logo">
                    <a href="https://www.chrono24.com" target="_blank" rel="noreferrer">
                        <img
                            src={'https://www.chrono24.com/others/trusted-seller-icon.htm?format=180&id=420'}
                            alt="logo"
                        />
                    </a>
                </div>
            </div>
        </>
    );
}

export default Sidebar;
