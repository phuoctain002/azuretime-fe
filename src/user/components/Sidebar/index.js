import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { url } from '../../../api/url';
import { urnBrand, urnCate } from '../../../api/urn';
import { useTranslation } from 'react-i18next';

function Gender(props) {
    const gender = [1, 2];
    const { idCate } = props;
    const [currentIndex, setCurrentIndex] = useState(0);
    useEffect(() => {
        setCurrentIndex(JSON.parse(localStorage.getItem('onClickGenderId')));
    }, []);
    const handleClick = (i) => {
        return setCurrentIndex(i);
    };

    return (
        <>
            <ul className="sub-level-2 fade-sidebar-0dot3s">
                {gender &&
                    gender.map((item, i) => {
                        return (
                            <li key={i}>
                                {/* {console.log('index', item)} */}
                                <Link to={'/category/' + idCate + '/' + item}>
                                    <span
                                        className={`sub-level-2-heading ${i === currentIndex ? ' active' : ''}`}
                                        onClick={() => {
                                            localStorage.setItem('onClickGenderId', JSON.stringify(i));
                                            localStorage.setItem('onClickGender', JSON.stringify(item));
                                            handleClick(i);
                                        }}
                                    >
                                        {item === 1 ? 'Men' : 'Women'}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
            </ul>
        </>
    );
}

function CateList(props) {
    const { dataCate } = props;
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        setCurrentIndex(JSON.parse(localStorage.getItem('onClickCateId')));
    }, []);
    const handleClick = (i) => {
        return setCurrentIndex(i);
    };

    return (
        <>
            <ul className="sub-level fade-sidebar-0dot5s">
                {dataCate &&
                    dataCate.map((item, i) => {
                        return (
                            <li key={i}>
                                <Link to={'/category/' + item.idCategory + '/' + 0}>
                                    <span
                                        className={`sub-level-heading ${i === currentIndex ? ' active' : ''}`}
                                        onClick={() => {
                                            localStorage.setItem('onClickGenderId', JSON.stringify(-1));
                                            localStorage.setItem('onClickCateId', JSON.stringify(i));
                                            localStorage.setItem('onClickGender', JSON.stringify(0));
                                            localStorage.setItem('onClickCate', JSON.stringify(item));
                                            handleClick(i);
                                        }}
                                    >
                                        {item.nameCategory}
                                    </span>
                                </Link>
                                {i === currentIndex && Number(item.gender) === 1 && <Gender idCate={item.idCategory} />}
                            </li>
                        );
                    })}
            </ul>
        </>
    );
}

function Sidebar(props) {
    const { t, i18n } = useTranslation();
    const [brand, setBrand] = useState([
        {
            idBrand: 1,
            name: 'Maurice Lacroix',
        },
        {
            idBrand: 2,
            name: 'West End',
        },
        {
            idBrand: 3,
            name: 'Watch Accessories',
        },
        {
            idBrand: 4,
            name: 'Rolex',
        },
        {
            idBrand: 5,
            name: 'Hublot',
        },
        {
            idBrand: 6,
            name: 'Tudor',
        },
        {
            idBrand: 7,
            name: 'Jaeger LeCoultre',
        },
        {
            idBrand: 8,
            name: 'Versace',
        },
    ]);
    const [category, setCategory] = useState([]);
    useEffect(() => {
        // get Brands
        axios.get(url + urnBrand).then((res) => {
            setBrand(res.data);
        });
        // get All Category
        axios.get(url + urnCate).then((res) => {
            setCategory(res.data);
        });
    }, []);

    const [currentIndex, setCurrentIndex] = useState(0);
    useEffect(() => {
        setCurrentIndex(JSON.parse(localStorage.getItem('onClickBrandId')));
    }, []);

    const handleClick = (i) => {
        return setCurrentIndex(i);
    };
    console.log('onClickBrandId', currentIndex);
    return (
        <>
            <div className="sidebar">
                <div className="search">
                    <label className="search-label">{t('Search.1')}</label>
                    <div className="input-form">
                        <input className="search-input" />
                        <div className="search-btn">
                            <span>{t('Search.2')}</span>
                        </div>
                    </div>
                </div>

                <div className="produts">
                    <ul className="main-level fade-sidebar-0dot3s">
                        {brand &&
                            brand.map((item, i) => {
                                return (
                                    <li key={i}>
                                        <Link to={'/brand/' + item.idBrand}>
                                            <span
                                                onClick={() => {
                                                    localStorage.setItem('onClickGenderId', JSON.stringify(-1));
                                                    localStorage.setItem('onClickBrandId', JSON.stringify(i));
                                                    localStorage.setItem('onClickCateId', JSON.stringify(-1));
                                                    localStorage.setItem(
                                                        'cates',
                                                        JSON.stringify(
                                                            category.filter((x) => x.idBrand === item.idBrand),
                                                        ),
                                                    );
                                                    setCurrentIndex(i);
                                                }}
                                                className={`main-level-heading ${i === currentIndex ? ' active' : ''}`}
                                            >
                                                {item.nameBrand}
                                            </span>
                                        </Link>
                                        {i === currentIndex && (
                                            <CateList
                                                className="cate-list"
                                                dataCate={category.filter((x) => x.idBrand === item.idBrand)}
                                            />
                                        )}
                                    </li>
                                );
                            })}
                    </ul>
                </div>

                <hr className="hrSidebar" />

                <div className="online">
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
                </div>

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
