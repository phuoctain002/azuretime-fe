import axios from 'axios';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactImageMagnify from 'react-image-magnify';
import { useParams } from 'react-router-dom';
import { url, path } from '../../../api/url';
import { urnDetailProduct, urnDetailImgs } from '../../../api/urn';

function DetailContent() {
    const { t } = useTranslation();
    const [mainImg, setMainImg] = useState('');
    const { idProduct } = useParams();
    const [subImgs, setSubImgs] = useState([]);
    const [product, setProduct] = useState({ price: 0 });
    const [lang, setLang] = useState(t('key').localeCompare('en'));
    // const [htmlDescriptionEn, setHtmlDescriptionEn] = useState(document.createElement('div'));
    // const [htmlDescriptionVi, setHtmlDescriptionVi] = useState(document.createElement('div'));
    useEffect(() => {
        axios.get(url + urnDetailProduct(idProduct)).then((res) => {
            // htmlDescriptionVi.innerHTML = res.data.descriptionVi;
            setProduct(res.data);
            if (t('key').localeCompare('en') === 0) {
                document.getElementById('description').innerHTML = res.data.descriptionEn;
            } else {
                document.getElementById('description').innerHTML = res.data.descriptionVi;
            }
            // setHtmlDescriptionEn(htmlDescriptionEn)
            // setHtmlDescriptionVi(htmlDescriptionVi)
        });
        axios.get(url + urnDetailImgs(idProduct)).then((res) => {
            setSubImgs(res.data);
            setMainImg(path + res.data[0].name);
        });
        //getProductDetail
    }, [idProduct, t('key')]);
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
                            <img className="card-image-border" src={url + '/images/FrameVintageWebOK-1.png'} alt="" />
                            <ReactImageMagnify
                                className="card-image-magnify"
                                {...{
                                    smallImage: {
                                        isFluidWidth: true,
                                        src: mainImg,
                                        sizes: 'max-width: 800px, max-width: 800px, 720px',
                                        className: 'card-image-magnify-img',
                                    },
                                    largeImage: {
                                        src: mainImg,
                                        width: 720,
                                        height: 720,
                                        className: 'card-image-magnify-large',
                                    },
                                    enlargedImageContainerDimensions: {
                                        width: '200%',
                                        height: '200%',
                                    },
                                }}
                            />
                        </div>
                        <div className="sub-images-list">
                            {subImgs &&
                                subImgs.map((item, index) => {
                                    return (
                                        <>
                                            <div className="sub-images-item">
                                                <img
                                                    className="card-image-border"
                                                    src={url + '/images/FrameVintageWebOK-1.png'}
                                                    alt=""
                                                    onClick={() => setMainImg(path + item.name)}
                                                />
                                                <img src={path + item.name} alt="" />
                                            </div>
                                        </>
                                    );
                                })}
                        </div>
                    </div>
                    <div className="card-wrap-info">
                        <h2 className="card-code-detail">
                            <span style={{ fontWeight: 'bold' }}>{t('Code')}: #</span>
                            {product && product.code}
                        </h2>
                        <span className="card-price-detail">
                            <span style={{ color: '#fff' }}> {t('Price per Unit (piece)')}: </span>
                            {product.price === 0 ? t('Contact Seller') : product.price}
                        </span>
                        <h2 className="card-name-detail">{product && product.nameProduct}</h2>
                        <p id="description" className="card-description-detail">
                            {/* {product &&
                                (t('key').localeCompare('en') === 0
                                    ? { handleDescriptionEn }
                                    : { handleDescriptionVi })} */}
                            {/* {handleDescriptionEn} */}
                        </p>
                    </div>
                </div>
                {product.urlVideo && (
                    <div className="video-frame">
                        <iframe src={product.urlVideo} width={600} height={340} title={product.idProduct}></iframe>
                    </div>
                )}
            </div>
        </>
    );
}

export default DetailContent;
