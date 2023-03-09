import { Row } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { url, path } from '../../../api/url';
import { urnSearch } from '../../../api/urn';
import { useTranslation } from 'react-i18next';
import { LoadingOutlined } from '@ant-design/icons';
function SearchContent() {
    const { searchInput } = useParams();
    const [pros, setPros] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();

    useEffect(() => {
        axios.get(url + urnSearch(searchInput)).then((res) => {
            console.log('search', res.data);
            setPros(res.data);
            setLoading(false);
        });
    }, [searchInput]);
    return (
        <>
            <div className="content-category">
                <div className="heading">
                    <div className="heading-label">
                        <label>
                            {t('Search result')}: "{searchInput}"
                        </label>
                    </div>
                    {/* {paramsGender !== 0 && (
                        <div className="heading-label">
                            {paramsGender === 1 ? <label>Men</label> : <label>Women</label>}
                        </div>
                    )} */}
                </div>
                {loading ? (
                    <LoadingOutlined id="loading-icon" />
                ) : (
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
                )}
            </div>
        </>
    );
}

export default SearchContent;
