import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { url } from '../../../api/url';
import { urnBrand, urnCate } from '../../../api/urn';
import { useTranslation } from 'react-i18next';
import '../../../App.css';
import { CateList } from './CateList';
import { useDispatch, useSelector } from 'react-redux';
import { clickBrand, clickCate } from 'src/redux/slice/sidebar';

function Sidebar(props) {
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const [brand, setBrand] = useState([]);
    const [category, setCategory] = useState([]);
    const currentIndex = useSelector((state) => state.sidebar.brand.index);

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
                                                    // localStorage.setItem('onClickGenderId', JSON.stringify(-1));
                                                    // localStorage.setItem('onClickBrandId', JSON.stringify(i));
                                                    // localStorage.setItem('onClickCateId', JSON.stringify(-1));
                                                    // localStorage.setItem(
                                                    //     'cates',
                                                    //     JSON.stringify(
                                                    //         category.filter((x) => x.idBrand === item.idBrand),
                                                    //     ),
                                                    // );
                                                    dispatch(
                                                        clickBrand({
                                                            index: i,
                                                            idBrand: item.idBrand,
                                                            nameBrand: item.nameBrand,
                                                        }),
                                                    );
                                                    let catesByBrand = category.filter(
                                                        (x) => x.idBrand === item.idBrand,
                                                    );
                                                    if (
                                                        catesByBrand.length === 0 ||
                                                        (catesByBrand.length === 1 &&
                                                            catesByBrand[0].nameCategory === item.nameCategory)
                                                    ) {
                                                        dispatch(
                                                            clickCate({
                                                                index: i,
                                                                idCate: catesByBrand[0].idCategory,
                                                                nameCate: item.nameBrand,
                                                            }),
                                                        );
                                                    }
                                                    // setCurrentIndex(i);
                                                }}
                                                className={`main-level-heading ${i === currentIndex ? ' active' : ''}`}
                                            >
                                                {item.nameBrand}
                                            </span>
                                        </Link>
                                        {i === currentIndex && (
                                            <CateList
                                                className="cate-list"
                                                dataCate={category.filter(
                                                    (x) =>
                                                        x.idBrand === item.idBrand && x.nameCategory !== item.nameBrand,
                                                )}
                                            />
                                        )}
                                    </li>
                                );
                            })}
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
