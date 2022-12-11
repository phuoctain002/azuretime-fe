import { Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { url, pathImgResized } from '../../../api/url';
import { urnPros } from '../../../api/urn';
function CategoryContent() {
    const paramsIdCate = Number(useParams().idCate);
    const paramsGender = Number(useParams().gender);
    const [pros, setPros] = useState([]);
    const [Cate, setCate] = useState({});
    const [Gender, setGender] = useState({});
    useEffect(() => {
        // console.log('paramsIdCate, paramsGender', paramsIdCate, paramsGender.typeOf);
        setCate(JSON.parse(localStorage.getItem('onClickCate')));
        setGender(JSON.parse(localStorage.getItem('onClickGender')));
        // console.log('param', Gender);
        axios.get(url + urnPros(JSON.parse(localStorage.getItem('onClickCate')).idCategory)).then((res) => {
            // console.log(res.data);
            if (paramsGender === 0) {
                setPros(res.data);
            } else if (paramsGender > 0) {
                setPros(res.data.filter((x) => x.gender === paramsGender));
            }
            // console.log('pros', pros);
        });
    }, [/** Cus change url so reload component */ paramsIdCate, paramsGender]);

    return (
        <>
            <div className="content-category">
                <div className="heading">
                    <div className="heading-label">
                        <label>{Cate.nameCategory}</label>
                    </div>
                    {Gender !== 0 && (
                        <div className="heading-label">
                            <label>{Gender === 1 ? 'Men' : 'Women'}</label>
                        </div>
                    )}
                </div>
                <div className="list-product">
                    {pros.length > 0 &&
                        pros.map((item, index) => {
                            return (
                                <div key={index}>
                                    <Row className="row-pros" gutter={16}>
                                        <div className="card-wrap-category">
                                            <Link to={'/detail/' + item.idProduct}>
                                                <div className="card-image">
                                                    <img src={pathImgResized + item.name} alt="" />
                                                </div>
                                            </Link>
                                            <div className="card-info-category">
                                                <Link to={'/detail/' + item.idProduct}>
                                                    <h2 className="card-code-category">{item.code}</h2>
                                                    <h2 className="card-name-category">{item.nameProduct}</h2>
                                                </Link>

                                                <p className="card-description-category">{item.descriptionEn}</p>
                                                <span className="card-price-category">
                                                    {item.price === 0 ? 'Contact Seller' : item.price}
                                                </span>
                                                <Link to={'/detail/' + item.idProduct}>
                                                    <span className="card-more-detail-category">More Detail</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </Row>
                                    {pros && index !== pros.length - 1 && <hr className="hrPros-cate" />}
                                </div>
                            );
                        })}
                </div>
            </div>
        </>
    );
}

export default CategoryContent;
