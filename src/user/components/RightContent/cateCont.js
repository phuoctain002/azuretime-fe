import { Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { url } from '../../../api/url';
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

    // const products = [
    //     {
    //         idProduct: 1,
    //         url: 'https://firebasestorage.googleapis.com/v0/b/firjewelry-871f7.appspot.com/o/Image-Watch%2FMaurice_LacroixP_52087dab9b953_160x160.jpg?alt=media&token=442effed-f134-45b9-91ec-fea020504cd6',
    //         code: 'Maurice Lacroix Pontos No. PT6188-SS001-331',
    //         name: 'Maurice Lacroix Pontos Automatic Chronograph No. PT6188-SS001-331',
    //         price: 'Contact Seller',
    //         description: `Case: Stainless Steel Black PVD Coating
    // Bezel: Stainless Steel Black Coating
    // Movement: Automatic
    // Crystal: Sapphire
    // Bracelet: Rubber
    // Dial: Black
    // Certificate: Certificate of Authenticity
    // Warranty: Lifetime Warranty
    // Resistance: 5ATM
    // Size: 43mm`,
    //     },
    //     {
    //         idProduct: 2,
    //         url: 'https://firebasestorage.googleapis.com/v0/b/firjewelry-871f7.appspot.com/o/Image-Watch%2FMaurice_Lacroix__520879fdc9f3c_160x160.jpg?alt=media&token=bca8573f-645e-42ef-9ae8-30a0d6e438ca',
    //         code: 'Maurice Lacroix Pontos Day & Date PT6158-SS001-43E',
    //         name: 'Maurice Lacroix Pontos Day & Date',
    //         price: 'Contact Seller',
    //         description: `Case: Stainless Steel Black PVD Coating
    // Bezel: Stainless Steel Black Coating
    // Movement: Automatic
    // Crystal: Sapphire
    // Bracelet: Rubber
    // Dial: Black
    // Certificate: Certificate of Authenticity
    // Warranty: Lifetime Warranty
    // Resistance: 5ATM
    // Size: 43mm`,
    //     },
    //     {
    //         idProduct: 3,
    //         url: 'https://firebasestorage.googleapis.com/v0/b/firjewelry-871f7.appspot.com/o/Image-Watch%2FMaurice_Lacroix__520891c6ad62f_160x160.jpg?alt=media&token=79df38ba-35d4-4b43-934a-ecf5d30c2361',
    //         code: 'Maurice Lacroix Pontos PT6188-TT031-330',
    //         name: 'Maurice Lacroix Pontos PT6188-TT031-330',
    //         price: 'Contact Seller',
    //         description: `Case: Stainless Steel Black PVD Coating
    // Bezel: Stainless Steel Black Coating
    // Movement: Automatic
    // Crystal: Sapphire
    // Bracelet: Rubber
    // Dial: Black
    // Certificate: Certificate of Authenticity
    // Warranty: Lifetime Warranty
    // Resistance: 5ATM
    // Size: 43mm`,
    //     },
    //     {
    //         idProduct: 4,
    //         url: 'https://firebasestorage.googleapis.com/v0/b/firjewelry-871f7.appspot.com/o/Image-Watch%2FMaurice_Lacroix__5208bb68b69d0_160x160.jpg?alt=media&token=a4c98e95-71ab-4dbc-94a2-45f5cb6bc092',
    //         code: 'Maurice Lacroix Pontos PT6008-SS002-332',
    //         name: 'Maurice Lacroix Pontos PT6008-SS002-332',
    //         price: 'Contact Seller',
    //         description:
    //             'Case: Stainless Steel Black PVD Coating  Bezel: Stainless Steel Black Coating Movement: Automatic Crystal: Sapphire Bracelet: Rubber Dial: Black Certificate: Certificate of Authenticity Warranty: Lifetime Warranty Resistance: 5ATM Size: 43mm',
    //     },
    // ];
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
                                                    <img src={item.urlResized} alt="" />
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
