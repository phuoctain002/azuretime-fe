import { Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { url, path } from '../../../api/url';
import { urnPros } from '../../../api/urn';
import { Translator, Translate } from 'react-auto-translate';
function Products(props) {
    const [pros, setPros] = useState([]);
    useEffect(() => {
        axios.get(url + urnPros(props.idCate)).then((res) => {
            setPros(res.data);
        });
    }, [props.idCate]);
    return (
        <>
            {pros.length > 0 && (
                <div className="heading">
                    <div className="heading-label">
                        <label>{props.nameCate}</label>
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
                                                    <img src={path + item.name} alt={item.name} />
                                                </div>
                                                <h2 className="card-name">{item.code}</h2>
                                            </Link>

                                            <span className="card-price">
                                                {item.price === 0 ? 'Contact Seller' : item.price}
                                            </span>

                                            <Link to={'/detail/' + item.idProduct}>
                                                <span className="card-more-detail">More Detail</span>
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

    useEffect(() => {
        setCates(JSON.parse(localStorage.getItem('cates')));
    }, [idBrand]);

    return (
        <Translator from="en" to="vi" googleApiKey="API_KEY">
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
        </Translator>
    );
}

export default BrandContent;
