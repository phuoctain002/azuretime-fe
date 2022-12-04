import axios from 'axios';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactImageMagnify from 'react-image-magnify';
import { useParams } from 'react-router-dom';
import { url } from '../../../api/url';
import { urnDetail } from '../../../api/urn';

function DetailContent() {
    const { t } = useTranslation();
    const [mainImg, setMainImg] = useState('');
    const { idProduct } = useParams();
    const [product, setProduct] = useState({ price: 0 });
    console.log(product);
    useEffect(() => {
        axios.get('http://127.0.0.1:3003' + urnDetail(idProduct)).then((res) => {
            setProduct(res.data);
            setMainImg(res.data.urlResized[0].urlResized);
        });
        console.log('idProduct', idProduct);
        //getProductDetail
    }, [idProduct]);
    return (
        <>
            <div className="content-detail">
                <div className="heading">
                    <div className="heading-label">
                        <label>{product && product.nameProduct}</label>
                    </div>
                </div>
                <div className="card-wrap-detail">
                    <div className="card-wrap-image">
                        <div className="card-image-detail">
                            <ReactImageMagnify
                                {...{
                                    smallImage: {
                                        isFluidWidth: true,
                                        src: mainImg,
                                        sizes: 'max-width: 800px, max-width: 800px, 720px',
                                    },
                                    largeImage: {
                                        src: mainImg,
                                        width: 720,
                                        height: 720,
                                    },
                                    enlargedImageContainerDimensions: {
                                        width: '200%',
                                        height: '200%',
                                    },
                                }}
                            />
                        </div>
                        <div className="sub-images-list">
                            {product.urlResized &&
                                product.urlResized.map((item, index) => {
                                    return (
                                        <>
                                            <div className="sub-images-item">
                                                <img
                                                    src={item.urlResized}
                                                    alt=""
                                                    onClick={() => setMainImg(item.urlResized)}
                                                />
                                            </div>
                                        </>
                                    );
                                })}
                        </div>
                    </div>
                    <div className="card-wrap-info">
                        <h2 className="card-code-detail">
                            <span style={{ fontWeight: 'bold' }}>Code: #</span>
                            {product && product.code}
                        </h2>
                        <span className="card-price-detail">
                            <span style={{ color: '#fff' }}>Price per Unit (piece): </span>
                            {product.price === 0 ? 'Contact Seller' : product.price}
                        </span>
                        <h2 className="card-name-detail">{product && product.nameProduct}</h2>
                        <p className="card-description-detail">
                            {product &&
                                (t('key').localeCompare('en') === 0 ? product.descriptionEn : product.descriptionVi)}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DetailContent;
