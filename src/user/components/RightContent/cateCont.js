import { Row } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { url, path } from '../../../api/url';
import { urnPros } from '../../../api/urn';
import { useSelector } from 'react-redux';
function CategoryContent() {
    const paramsIdCate = Number(useParams().idCate);
    const paramsGender = Number(useParams().gender);
    const [pros, setPros] = useState([]);
    const cate = useSelector((state) => state.sidebar.cate);
    useEffect(() => {
        axios.get(url + urnPros(cate.idCate)).then((res) => {
            if (paramsGender === 0) {
                setPros(res.data);
            } else if (paramsGender > 0) {
                setPros(res.data.filter((x) => x.gender === paramsGender));
            }
        });
    }, [/** Cus change url so reload component */ paramsIdCate, paramsGender]);
    // console.log('gender', paramsGender);
    return (
        <>
            <div className="content-category">
                <div className="heading">
                    <div className="heading-label">
                        <label>{cate.nameCate}</label>
                    </div>
                    {/* {paramsGender !== 0 && (
                        <div className="heading-label">
                            {paramsGender === 1 ? <label>Men</label> : <label>Women</label>}
                        </div>
                    )} */}
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
                                                    <img
                                                        className="card-image-img"
                                                        src={path + item.name}
                                                        alt="item.name"
                                                    />
                                                    <img
                                                        className="card-image-border"
                                                        src={url + '/images/FrameVintageWebOK-1.png'}
                                                        alt=""
                                                    />
                                                    <div class="overlay">
                                                        <div class="overlay-text">More Detail</div>
                                                    </div>
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
