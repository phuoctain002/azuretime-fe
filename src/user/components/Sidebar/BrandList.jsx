import { useDispatch, useSelector } from 'react-redux';
import { CateList } from './CateList';
import { clickBrand, clickCate } from '../../../redux/slice/sidebar';
import axios from 'axios';
import { url } from '../../../api/url';
import { urnCate } from '../../../api/urn';
const { useState, useEffect } = require('react');
const { Link } = require('react-router-dom');

export function BrandList(props) {
    const dispatch = useDispatch();
    const { dataBrand } = props;
    const [category, setCategory] = useState([]);
    const currentIndex = useSelector((state) => state.sidebar.brand.index);

    useEffect(() => {
        // get All Category
        axios.get(url + urnCate).then((res) => {
            setCategory(res.data);
        });
    }, []);

    return (
        <>
            <ul className="sub-level fade-sidebar-0dot5s">
                {dataBrand &&
                    dataBrand.map((item, i) => {
                        return (
                            <li key={i}>
                                <Link to={'/category/' + item.idBrand + '/' + 0}>
                                    <span
                                        className={`sub-level-heading ${i === currentIndex ? ' active' : ''}`}
                                        onClick={() => {
                                            dispatch(
                                                clickBrand({
                                                    index: i,
                                                    idBrand: item.idBrand,
                                                    nameBrand: item.nameBrand,
                                                }),
                                            );
                                            let catesByBrand = category.filter((x) => x.idBrand === item.idBrand);
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
                                        }}
                                    >
                                        {item.nameBrand}
                                    </span>
                                </Link>
                                {i === currentIndex && <CateList idBrand={item.idBrand} />}
                            </li>
                        );
                    })}
            </ul>
        </>
    );
}
