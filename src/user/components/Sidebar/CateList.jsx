import { Gender } from "./Gender";

const { useState, useEffect } = require("react");
const { Link } = require("react-router-dom");

export function CateList(props) {
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