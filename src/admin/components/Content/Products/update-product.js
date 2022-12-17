import './product.css';
import { Button, Image, Table, Form, Select, Input, InputNumber, Col, Row, notification, Switch, Radio } from 'antd';
import { CheckCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import Upload from 'antd/lib/upload/Upload';
import { AiOutlineUpload } from 'react-icons/ai';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { path, url } from '../../../../api/url';
import {
    urnAddImages,
    urnAddProduct,
    urnBrand,
    urnCate,
    urnUploadImagesResized,
    urnUploadImagesFull,
    urnDetailProduct,
    urnDetailImgs,
} from '../../../../api/urn';
import Resizer from 'react-image-file-resizer';
import { Link, useParams } from 'react-router-dom';

function UpdateProduct(prop) {
    const [switchEn, setSwitchEn] = useState(false);
    const { TextArea } = Input;

    // SP: Save IMG PRODUCT
    const [upStatus, setUpStatus] = useState(true);
    const [avaId, setAvaId] = useState(null);

    const [productImgs, setProductImgs] = useState([]); //Dùng hiển thị trên table
    const [imgsSubmit, setImgsSubmit] = useState([]); //Dùng lưu lên DB
    const [filesFull, setFilesFull] = useState([]);
    const [filesResized, setFilesResized] = useState([]);

    const [deleteImgs, setDeleteImgs] = useState([]);

    // SP: PRODUCT
    const [descriptionEn, setDescriptionEn] = useState(''); //Dùng để hiển thị
    const [brands, setBrands] = useState([]); //Danh sách hiển thị select
    const [cates, setCates] = useState([]); //Danh sách chưa lọc
    const [catesByBrand, setCatesByBrand] = useState([]); //Danh sách hiển thị select
    const { idProduct } = useParams();
    const [product, setProduct] = useState({
        code: '',
        nameProduct: '',
        descriptionVi: '',
        descriptionEn: '',
        price: 1,
        urlVideo: '',
        gender: 2, //2: không xác định
        idBrand: -1,
        idCategory: -1,
    });

    // const [visibleDiscount, setVisibleDiscount] = useState(false); //Nếu dùng discount thì mở ra

    useEffect(() => {
        axios.get(url + urnBrand).then((res) => {
            setBrands(res.data);
        });
        axios.get(url + urnCate).then((res) => {
            setCates(res.data);
        });
        axios.get(url + urnDetailProduct(idProduct)).then((res) => {
            setProduct(res.data);
            setCatesByBrand(cates.filter((x) => x.idBrand === res.data.idBrand));
        });
        axios.get(url + urnDetailImgs(idProduct)).then((res) => {
            setProductImgs(
                res.data.map((item) => {
                    return { ...item, url: path + item.name };
                }),
            );
            console.log(res.data);
            setAvaId(res.data[0].uid);
        });
    }, []);

    //product type
    const handleSelectBrand = (value) => {
        setProduct({ ...product, idBrand: value });
        setCatesByBrand(cates.filter((x) => x.idBrand === value));
    };
    const handleSelectCate = (value) => {
        setProduct({ ...product, idCategory: value });
    };
    // get base64
    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };
    //resize image
    const handleResize = (size, quality, file) => {
        return new Promise((resolve) => {
            Resizer.imageFileResizer(
                file,
                size,
                size,
                'PNG',
                quality,
                0,
                (uri) => {
                    resolve(uri);
                },
                'file',
            );
        });
    };
    // Translate
    const handleTranslate = () => {
        const text = product.descriptionVi.replaceAll('\n', ' aaaaa ');
        const options = {
            method: 'POST',
            url: 'https://ai-translate.p.rapidapi.com/translate',
            headers: {
                'Content-Type': 'application/json',
                'X-RapidAPI-Key': '6c64d6bdfemshc1cb857b2c595a1p19d80bjsn704140f2e92b',
                'X-RapidAPI-Host': 'ai-translate.p.rapidapi.com',
            },
            data: { texts: [text], tl: 'en', sl: 'vi' },
        };

        axios
            .request(options)
            .then(function (response) {
                setProduct({ ...product, descriptionEn: response.data.texts.replaceAll(' a1b2c3d4 ', '\n') });
            })
            .catch(function (error) {
                console.error(error);
            });
    };

    //#region ---TABLE---
    const EditableContext = React.createContext(null);
    const EditableRow = ({ index, ...props }) => {
        const [form] = Form.useForm();
        return (
            <Form form={form} component={false}>
                <EditableContext.Provider value={form}>
                    <tr {...props} />
                </EditableContext.Provider>
            </Form>
        );
    };
    const columns = [
        {
            title: 'TT',
            width: '52px',
            className: 'col-numb-table',
            dataIndex: 'id=1',
            render: (id, record, index) => {
                ++index;

                return <span>{index}</span>;
            },
        },
        {
            title: 'Image',
            dataIndex: 'url',
            render: (url) => (
                <Image
                    preview={{
                        objectFit: 'content',
                        height: '100px',
                        display: 'inline',
                        verticalAlign: 'middle',
                    }}
                    width={200}
                    src={url}
                />
            ),
        },
        {
            title: 'Action',
            render: (_, record) => (
                <Button className="btnDel" danger onClick={() => handleDelete(record.key)}>
                    Delete
                </Button>
            ),
        },
    ];
    // Cho phép xóa rows
    const components = {
        body: {
            row: EditableRow,
        },
    };

    // Handle
    // handelDelete image
    const handleDelete = (key) => {
        setFilesFull(filesFull.filter((item) => item.uid !== key));
        setFilesResized(filesResized.filter((item) => item.uid !== key));
        setImgsSubmit(imgsSubmit.filter((item) => item.uid !== key));
        setProductImgs(productImgs.filter((item) => item.key !== key));
    };
    const handleClickRadio = (selectedRows) => {
        console.log('sl', selectedRows);
        setAvaId(selectedRows[0].file.uid);
        setImgsSubmit(
            imgsSubmit.map((item) => {
                return { ...item, isAvatar: item.uid === selectedRows[0].file.uid };
            }),
        );
        console.log('selectedRows: ', selectedRows[0].file.uid);
    };
    //#endregion

    const isValidator = () => {
        // const { name, description } = product;
        // if (name === '' || description === '' ) {
        //     notification.warning({ message: `Vui lòng nhập các ô có dấu (*)`, duration: 4 });
        //     return false;
        // }
        return true;
    };
    const handleSubmit = () => {
        // if (isValidator()) {
        //     if (productImgs.length > 0) {
        //         if (avaId === null) {
        //             notification.warning({
        //                 message: `Chưa chọn ảnh đại diện cho sản phẩm`,
        //                 duration: 10,
        //             });
        //         } else {
        //             axios
        //                 .post(url + urnAddProduct, product)
        //                 .then((res) => {
        //                     if (res.data) {
        //                         const time = Date.now();
        //                         axios.post(url + urnAddImages, {
        //                             idProduct: res.data,
        //                             imgsSubmit: imgsSubmit.map((item) => {
        //                                 return { ...item, name: time + '_' + item.name };
        //                             }),
        //                         });
        //                         axios.post(
        //                             url + urnUploadImagesFull(time),
        //                             { files: filesFull },
        //                             {
        //                                 headers: {
        //                                     'Content-Type': 'multipart/form-data',
        //                                 },
        //                             },
        //                         );
        //                         axios.post(
        //                             url + urnUploadImagesResized(time),
        //                             { files: filesResized },
        //                             {
        //                                 headers: {
        //                                     'Content-Type': 'multipart/form-data',
        //                                 },
        //                             },
        //                         );
        //                     }
        //                     notification.success({
        //                         icon: <CheckCircleOutlined />,
        //                         message: `Thành công`,
        //                         duration: 3,
        //                     });
        //                 })
        //                 .catch((err) => {
        //                     notification.error({
        //                         message: `Lỗi`,
        //                         duration: 3,
        //                     });
        //                     throw err;
        //                 });
        //         }
        //     } else {
        //         notification.warning({
        //             message: `Chưa chọn hình ảnh cho sản phẩm`,
        //             duration: 0,
        //         });
        //     }
        // }
        console.log(productImgs);
    };

    const ResetData = () => {
        setProduct({
            code: '',
            nameProduct: '',
            descriptionVi: '',
            descriptionEn: '',
            price: 1,
            urlVideo: '',
            gender: 2, //2: không xác định
            idBrand: -1,
            idCategory: -1,
        });
    };

    return (
        <div className="wrap-content-admin">
            <Row>
                <Col span={20}>
                    <Link to={'/admin/products/'}>
                        <Button type="text">
                            <ArrowLeftOutlined />
                            Back
                        </Button>
                    </Link>
                </Col>
            </Row>
            <Row>
                <Col span={20}>
                    <div className="heading-product-type">
                        <h1>Sửa sản phẩm</h1>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col span={10}>
                    <div className="form">
                        <label className="input-label">
                            Mã sản phẩm <span style={{ color: 'red' }}>*</span>
                        </label>
                        <Input
                            type="text"
                            className="form-input"
                            value={product.code}
                            placeholder="-- Nhập mã sản phẩm"
                            onChange={(e) => setProduct({ ...product, code: e.target.value })}
                        />
                        <label className="input-label">
                            Tên sản phẩm <span style={{ color: 'red' }}>*</span>
                        </label>
                        <Input
                            type="text"
                            className="form-input"
                            value={product.nameProduct}
                            placeholder="-- Nhập tên sản phẩm"
                            onChange={(e) => setProduct({ ...product, nameProduct: e.target.value })}
                        />

                        {/* <label className="input-label">
                            Mô tả sản phẩm (tiếng việt) <span style={{ color: 'red' }}>*</span>
                        </label>
                        <TextArea
                            type="textArea"
                            allowClear={true}
                            className="form-input"
                            rows={20}
                            placeholder="-- Mô tả sản phẩm bằng tiếng Việt"
                            onBlur={(e) => setProduct({ ...product, descriptionVi: e.target.value })}
                        />
                        <Button type="primary" onClick={handleTranslate}>
                            Dịch tự động
                        </Button>
                        <label className="input-label">
                            Mô tả sản phẩm (tiếng anh) <span style={{ color: 'red' }}>*</span>
                        </label>
                        <TextArea
                            type="textArea"
                            allowClear={true}
                            className="form-input"
                            rows={20}
                            placeholder="-- Mô tả sản phẩm bằng tiếng Anh"
                            value={descriptionEn}
                        /> */}

                        <label className="input-label">
                            Giá <span style={{ color: 'red' }}>*</span>
                        </label>
                        <InputNumber
                            className="form-input"
                            min={1}
                            max={1000000000}
                            type="number"
                            value={product.price}
                            placeholder="-- Nhập giá sản phẩm"
                            onChange={(e) => {
                                setProduct({ ...product, price: e.target.value });
                                // setVisibleDiscount(e.target.value !== 0);
                            }}
                        />
                        {/* {visibleDiscount ? (
                            <Row>
                                <Col span={4}>Discount {product.percentDiscount}%</Col>
                                <Col span={20}>
                                    <Slider
                                        defaultValue={0}
                                        onChange={(e) =>
                                            setProduct({
                                                ...product,
                                                percentDiscount: e,
                                                discountPrice: (product.price * e) / 100,
                                            })
                                        }
                                    />
                                </Col>
                            </Row>
                        ) : (
                            <div style={{ height: '36px' }}></div>
                        )} */}
                    </div>
                </Col>
                <Col span={10}>
                    <div className="form">
                        <label className="input-label">
                            Thương hiệu - Loại sản phẩm <span style={{ color: 'red' }}>*</span>
                        </label>
                        <div className="select-wapper">
                            <Select
                                className="form-input select"
                                value={product.idBrand}
                                placeholder="-- Chọn thương hiệu"
                                optionFilterProp="children"
                                onChange={handleSelectBrand}
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {brands &&
                                    brands.map((values, index) => (
                                        <Select.Option key={index} value={values.idBrand}>
                                            {values.nameBrand}
                                        </Select.Option>
                                    ))}
                            </Select>
                            <Select
                                className="form-input select"
                                placeholder="-- Chọn loại"
                                value={product.nameCategory}
                                optionFilterProp="children"
                                onChange={handleSelectCate}
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {catesByBrand &&
                                    catesByBrand.map((values, index) => (
                                        <Select.Option key={index} value={values.idCategory}>
                                            {values.nameCategory}
                                        </Select.Option>
                                    ))}
                            </Select>
                        </div>
                        <label className="input-label">
                            Giới tính <span style={{ color: 'red' }}>*</span>
                        </label>
                        <Radio.Group
                            className="radio-group"
                            value={product.gender}
                            onChange={(e) => {
                                console.log('radio checked', e.target.value);
                                setProduct({ ...product, gender: e.target.value });
                            }}
                        >
                            <Radio value={1}>Male</Radio>
                            <Radio value={0}>Female</Radio>
                            <Radio value={2}>Unisex</Radio>
                        </Radio.Group>
                        <label className="input-label">
                            Đường dẫn video<span style={{ color: 'red' }}> *</span>
                        </label>
                        <Input
                            type="text"
                            value={product.urlVideo}
                            className="form-input"
                            placeholder="-- Nhập Đường dẫn video cho sản phẩm"
                            onChange={(e) => setProduct({ ...product, urlVideo: e.target.value })}
                        />
                    </div>
                </Col>
            </Row>

            <Row className="description-row">
                <Col span={10}>
                    <div className="form">
                        <div className="heading-description">
                            <label className="input-label description">
                                Mô tả sản phẩm <span style={{ color: 'red' }}>*</span>
                            </label>
                            <Button className="admin-btn" type="primary" onClick={handleTranslate}>
                                Dịch
                            </Button>
                        </div>
                        <TextArea
                            type="textArea"
                            allowClear={true}
                            className="form-input description left"
                            rows={15}
                            placeholder="-- Mô tả sản phẩm bằng tiếng Việt"
                            value={product.descriptionVi}
                            onChange={(e) => setProduct({ ...product, descriptionVi: e.target.value })}
                            // onBlur={(e) => setProduct({ ...product, descriptionVi: e.target.value })}
                        />
                    </div>
                </Col>
                <Col span={10}>
                    <div className="form">
                        <TextArea
                            type="textArea"
                            allowClear={true}
                            className="form-input description right"
                            rows={15}
                            placeholder="-- Mô tả sản phẩm bằng tiếng Anh"
                            value={product.descriptionEn}
                            onChange={(e) => setProduct({ ...product, descriptionEn: e.target.value })}
                            // onBlur={(e) => setProduct({ ...product, descriptionEn: e.target.value })}
                        />
                    </div>
                </Col>
            </Row>
            <Row>
                <Col span={20}>
                    <div className="form">
                        <div className="heading-image">
                            <label className="input-label input-label-image">
                                Ảnh sản phẩm{' '}
                                <label style={{ fontWeight: 'normal', fontSize: 14, color: '#000', opacity: 0.8 }}>
                                    (<span style={{ color: 'red' }}>* </span>Bấm vào ô tròn để chọn ảnh đại diện cho sản
                                    phẩm){' '}
                                </label>
                            </label>
                            <Upload
                                showUploadList={false}
                                multiple={true}
                                beforeUpload={(file) => {
                                    const typeImg = ['image/png', 'image/jpeg', 'image/jpg'];
                                    if (!typeImg.includes(file.type)) {
                                        setUpStatus(false);
                                        notification.error({
                                            message: `"${file.name}" is not a png, jpeg file`,
                                            duration: 5,
                                        });
                                    } else if (typeImg.includes(file.type)) {
                                        setUpStatus(true);
                                    }
                                    //CHƯA SỬA
                                    // if (dataSubmitImgFir.length === 6) {
                                    //     notification.error({
                                    //         message: `Chỉ chọn tối đa 6 hình`,
                                    //         duration: 5,
                                    //     });
                                    // }
                                    return typeImg.includes(file.type) ? true : Upload.LIST_IGNORE;
                                }}
                                onChange={async (info) => {
                                    // Up false thì không setData
                                    if (upStatus) {
                                        if (info.file.percent === 100) {
                                            console.log(info.file.originFileObj);
                                            setFilesFull((oldData) => [...oldData, info.file.originFileObj]);
                                            var resized = await handleResize(400, 100, info.file.originFileObj);
                                            setFilesResized((oldData) => [...oldData, resized]);
                                            //  // Resize to 400px, get base64
                                            // const image400 = await handleResize(400, 100, info.file.originFileObj);

                                            setImgsSubmit((prev) => [
                                                ...prev,
                                                {
                                                    uid: info.file.uid,
                                                    name: info.file.originFileObj.name,
                                                    isAvatar: false,
                                                },
                                            ]);
                                            getBase64(info.file.originFileObj, (url) => {
                                                // Show table
                                                setProductImgs((oldData) => [
                                                    ...oldData,
                                                    { key: info.file.uid, url, file: info.file.originFileObj },
                                                ]);
                                            });
                                        }
                                    }
                                }}
                            >
                                <Button className="btn-upload">
                                    <span>Upload image</span>
                                </Button>
                            </Upload>
                        </div>
                        <div className="table-image">
                            <Table
                                pagination={false}
                                lineHeight="30"
                                tableLayout="-"
                                className="table"
                                components={components}
                                rowClassName={() => 'editable-row'}
                                rowSelection={{
                                    type: 'radio',
                                    // selectedRowKeys: [avaId],
                                    onChange: (selectedRowKeys, selectedRows) => handleClickRadio(selectedRows),
                                }}
                                bordered
                                columns={columns}
                                dataSource={productImgs}
                            />
                        </div>
                    </div>
                </Col>
            </Row>
            <Row className="row-bottom">
                <Col span={20}>
                    <div className="form">
                        <Button className="admin-btn save" type="primary" onClick={handleSubmit}>
                            Save
                        </Button>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default UpdateProduct;