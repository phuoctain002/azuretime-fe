import { useSelector } from 'react-redux';

const { useEffect, useState } = require('react');
const { Link } = require('react-router-dom');

export function Gender(props) {
    const gender = [1, 2];
    const { idCate } = props;
    useEffect(() => {}, []);
    const currentIndex = useSelector((state) => state.sidebar.gender.index);
    console.log('gender', currentIndex);
    return (
        <>
            <ul className="sub-level-2 fade-sidebar-0dot3s">
                {gender &&
                    gender.map((item, i) => {
                        return (
                            <li key={i}>
                                {/* {console.log('index', item)} */}
                                <Link to={'/category/' + idCate + '/' + item}>
                                    <span className={`sub-level-2-heading ${i === currentIndex ? ' active' : ''}`}>
                                        {item === 1 ? 'Men' : item === 2 ? 'Women' : <></>}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
            </ul>
        </>
    );
}
