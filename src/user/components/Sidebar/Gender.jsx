const { useEffect, useState } = require('react');
const { Link } = require('react-router-dom');

export function Gender(props) {
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
