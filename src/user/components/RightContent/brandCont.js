import { Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { url, path } from '../../../api/url';
import { urnPros, urnCate } from '../../../api/urn';
import { Translator, Translate } from 'react-auto-translate';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
function Products(props) {
    const [pros, setPros] = useState([]);
    const { idCate, nameCate } = props;
    const { t } = useTranslation();
    document.title = nameCate;
    useEffect(() => {
        axios.get(url + urnPros(idCate)).then((res) => {
            console.log('pros', res.data);
            setPros(res.data);
        });
    }, [idCate]);
    // console.log('pros', pros);
    return (
        <>
            {pros.length > 0 && (
                <div className="heading">
                    <div className="heading-label">
                        <label>{nameCate}</label>
                    </div>
                </div>
            )}

            <div className="list-product">
                <Row className="row-pros" gutter={24} collapsible={true}>
                    {pros &&
                        pros.map((item, index) => {
                            return (
                                <div key={index}>
                                    <Col className="gutter-row" span={5}>
                                        <div className="card-wrap-brand">
                                            <Link to={'/detail/' + item.idProduct}>
                                                <div className="card-image">
                                                    <img
                                                        className="card-image-img"
                                                        src={path + item.name}
                                                        alt={item.name}
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
                                                <h2 className="card-name">{item.code}</h2>
                                            </Link>

                                            <span className="card-price">
                                                {item.price === 0 ? t('Contact Seller') : item.price}
                                            </span>

                                            <Link to={'/detail/' + item.idProduct}>
                                                <span className="card-more-detail">{t('More Detail')}</span>
                                            </Link>
                                        </div>
                                    </Col>
                                    {pros && props.index !== pros.length - 1 && <hr className="hrPros" />}
                                </div>
                            );
                        })}
                </Row>
            </div>
        </>
    );
}

function BrandContent() {
    const { idBrand } = useParams();
    const [cates, setCates] = useState([]);
    // const cates = useSelector((state) => state.content.cates);

    useEffect(() => {
        axios.get(url + urnCate).then((res) => {
            setCates(res.data.filter((x) => x.idBrand == idBrand));
        });
    }, [idBrand]);
    return (
        <div className="content-brand">
            {cates &&
                cates.map((item, index) => {
                    return (
                        <div key={index}>
                            
                            <Products idCate={item.idCategory} nameCate={item.nameCategory} index={index} />
                        </div>
                    );
                })}
        </div>
    );
}

export default BrandContent;
