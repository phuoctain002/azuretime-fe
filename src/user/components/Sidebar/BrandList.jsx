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
    const [catesByBrand, setCatesByBrand] = useState([]);
    useEffect(() => {
        // get All Category
        axios.get(url + urnCate).then((res) => {
            setCategory(res.data);
        });
    }, []);
    const isShowCategory = (item) => {
        console.log(item.nameBrand, catesByBrand[0].nameCategory);
        if (catesByBrand.length === 1) {
            if (item.nameBrand === catesByBrand[0].nameCategory) {
                return false;
            }
        }
    };

    return (
        <>
            <ul className="sub-level fade-sidebar-0dot5s">
                {dataBrand &&
                    dataBrand.map((item, i) => {
                        return (
                            <li key={i}>
                                <Link to={'/brand/' + item.idBrand}>
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
                                            let cates = category.filter((x) => x.idBrand === item.idBrand);
                                            setCatesByBrand(cates);
                                            if (
                                                cates.length === 0 ||
                                                (cates.length === 1 && cates[0].nameCategory === item.nameCategory)
                                            ) {
                                                dispatch(
                                                    clickCate({
                                                        index: i,
                                                        idCate: cates[0].idCategory,
                                                        nameCate: item.nameBrand,
                                                    }),
                                                );
                                            }
                                        }}
                                    >
                                        {item.nameBrand}
                                    </span>
                                </Link>
                                {i === currentIndex &&
                                    ((catesByBrand.length === 1 && item.nameBrand !== catesByBrand[0].nameCategory) ||
                                        catesByBrand.length > 1) && (
                                        <CateList idBrand={item.idBrand} dataCate={catesByBrand} />
                                    )}
                            </li>
                        );
                    })}
            </ul>
        </>
    );
}
