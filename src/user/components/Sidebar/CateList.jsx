import { useSelector, useDispatch } from 'react-redux';
import { clickCate } from 'src/redux/slice/sidebar';
import { Gender } from './Gender';

const { useState, useEffect } = require('react');
const { Link } = require('react-router-dom');

export function CateList(props) {
    const dispatch = useDispatch();
    const { idBrand, dataCate } = props;
    const currentIndex = useSelector((state) => state.sidebar.cate.index);
    console.log('dataCate', dataCate);
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
                                            dispatch(
                                                clickCate({
                                                    index: i,
                                                    idCate: item.idCategory,
                                                    nameCate: item.nameCategory,
                                                }),
                                            );
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
