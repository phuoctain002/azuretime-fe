import './product.css';
import { Button, Image, Table, Form, Select, Input, InputNumber, Col, Row, notification, Radio } from 'antd';
import { CheckCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import Upload from 'antd/lib/upload/Upload';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { url } from '../../../../api/url';
import {
    urnAddImages,
    urnAddProduct,
    urnBrand,
    urnCate,
    urnUploadImagesResized,
    urnUploadImagesFull,
} from '../../../../api/urn';
import Resizer from 'react-image-file-resizer';
import { Link } from 'react-router-dom';

function CreateProduct() {
    const { TextArea } = Input;

    // SP: Save IMG PRODUCT
    const [upStatus, setUpStatus] = useState(true);
    const [avaId, setAvaId] = useState(null);

    const [productImgs, setProductImgs] = useState([]); //Dùng hiển thị trên table
    const [imgsSubmit, setImgsSubmit] = useState([]); //Dùng lưu lên DB
    const [filesFull, setFilesFull] = useState([]);
    const [filesResized, setFilesResized] = useState([]);

    // SP: PRODUCT
    const [brands, setBrands] = useState([]); //Danh sách hiển thị select
    const [cates, setCates] = useState([]); //Danh sách chưa lọc
    const [catesByBrand, setCatesByBrand] = useState([]); //Danh sách hiển thị select
    const [product, setProduct] = useState({
        code: '',
        nameProduct: '',
        descriptionVi: '',
        descriptionEn: '',
        price: 0,
        urlVideo: '',
        gender: 2, //2: không xác định
        idBrand: -1,
        idCategory: -1,
    });
    const [prodValidate, setProdValidate] = useState({
        code: { isValid: true, message: 'Mã sản phẩm không được để trống' },
        nameProduct: { isValid: true, message: 'Tên sản phẩm không được để trống' },
        descriptionVi: { isValid: true, message: 'Mô tả không được để trống' },
        descriptionEn: { isValid: true, message: 'Mô tả không được để trống' },
        idBrand: { isValid: true, message: 'Thương hiệu không được để trống' },
        idCategory: { isValid: true, message: 'Loại sản phẩm không được để trống' },
    });
    const [selectedBrand, setSelectedBrand] = useState();
    const [selectedCate, setSelectedCate] = useState();
    // const [visibleDiscount, setVisibleDiscount] = useState(false); //Nếu dùng discount thì mở ra

    useEffect(() => {
        axios.get(url + urnBrand).then((res) => {
            setBrands(res.data);
        });
        axios.get(url + urnCate).then((res) => {
            setCates(res.data);
        });
    }, []);

    //product type
    const handleSelectBrand = (value) => {
        setProduct({ ...product, idBrand: value });
        let a = cates.filter((x) => x.idBrand === value);
        setCatesByBrand(a);
        setSelectedBrand(value);
    };
    const handleSelectCate = (value) => {
        setProduct({ ...product, idCategory: value });
        setSelectedCate(value);
    };
    // get base64
    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };
    //resize image
    const handleResize = (size, quality, file, type) => {
        return new Promise((resolve) => {
            Resizer.imageFileResizer(
                file,
                size,
                size,
                type,
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
        setAvaId(selectedRows[0].file.uid);
        setImgsSubmit(
            imgsSubmit.map((item) => {
                return { ...item, isAvatar: item.uid === selectedRows[0].file.uid };
            }),
        );
    };
    //#endregion

    const isValidator = () => {
        // const { name, description } = product;
        // if (product.name === '' || description === '') {
        //     notification.warning({ message: `Vui lòng nhập các ô có dấu (*)`, duration: 4 });
        //     return false;
        // }
        return true;
    };

    const handleSubmit = () => {
        if (isValidator()) {
            if (productImgs.length > 0) {
                if (avaId === null) {
                    notification.warning({
                        message: `Chưa chọn ảnh đại diện cho sản phẩm`,
                        duration: 10,
                    });
                } else {
                    axios
                        .post(url + urnAddProduct, product)
                        .then((res) => {
                            if (res.data) {
                                const time = Date.now();
                                axios.post(url + urnAddImages, {
                                    idProduct: res.data,
                                    imgsSubmit: imgsSubmit.map((item) => {
                                        return { ...item, name: time + '_' + item.name };
                                    }),
                                });
                                axios.post(
                                    url + urnUploadImagesFull(time),
                                    { files: filesFull },
                                    {
                                        headers: {
                                            'Content-Type': 'multipart/form-data',
                                        },
                                    },
                                );
                                axios.post(
                                    url + urnUploadImagesResized(time),
                                    { files: filesResized },
                                    {
                                        headers: {
                                            'Content-Type': 'multipart/form-data',
                                        },
                                    },
                                );
                            }
                            notification.success({
                                icon: <CheckCircleOutlined />,
                                message: `Thành công`,
                                duration: 3,
                            });
                            // Làm mới hình ảnh
                            setFilesFull([]);
                            setFilesResized([]);
                            setImgsSubmit([]);
                            setProductImgs([]);
                        })
                        .catch((err) => {
                            notification.error({
                                message: `Lỗi`,
                                duration: 3,
                            });
                            throw err;
                        });
                }
            } else {
                notification.warning({
                    message: `Chưa chọn hình ảnh cho sản phẩm`,
                    duration: 0,
                });
            }
        }
    };

    const resetData = () => {
        //Làm mới product
        setProduct({
            code: '',
            nameProduct: '',
            descriptionVi: '',
            descriptionEn: '',
            price: 0,
            urlVideo: '',
            gender: 2, //2: không xác định
            idBrand: -1,
            idCategory: -1,
        });
        //Làm mới select
        setSelectedBrand();
        setCatesByBrand([]);
        setSelectedCate();
        // Làm mới hình ảnh
        setFilesFull([]);
        setFilesResized([]);
        setImgsSubmit([]);
        setProductImgs([]);
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
                        <h1>Tạo sản phẩm</h1>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col span={10}>
                    <div className="form">
                        <div style={{ display: 'flex' }}>
                            <label className="input-label">
                                Mã sản phẩm <span style={{ color: 'red' }}>*</span>
                            </label>
                            {!prodValidate?.code?.isValid && (
                                <label
                                    className="input-label"
                                    style={{ color: 'red', fontSize: '12px', fontStyle: 'italic' }}
                                >
                                    {prodValidate?.code?.message}
                                </label>
                            )}
                        </div>

                        <Input
                            type="text"
                            className="form-input"
                            value={product.code}
                            placeholder="-- Nhập mã sản phẩm"
                            onChange={(e) => {
                                setProdValidate({
                                    ...prodValidate,
                                    code: { ...prodValidate.code, isValid: e.target.value !== '' },
                                });
                                setProduct({ ...product, code: e.target.value });
                            }}
                        />

                        <div style={{ display: 'flex' }}>
                            <label className="input-label">
                                Tên sản phẩm <span style={{ color: 'red' }}>*</span>
                            </label>
                            {!prodValidate?.nameProduct?.isValid && (
                                <label
                                    className="input-label"
                                    style={{ lineHeight: '20px', color: 'red', fontSize: '12px', fontStyle: 'italic' }}
                                >
                                    {prodValidate?.nameProduct?.message}
                                </label>
                            )}
                        </div>
                        <Input
                            type="text"
                            className="form-input"
                            value={product.nameProduct}
                            placeholder="-- Nhập tên sản phẩm"
                            onChange={(e) => setProduct({ ...product, nameProduct: e.target.value })}
                        />
                        <label className="input-label">Giá</label>
                        <InputNumber
                            className="form-input"
                            min={1}
                            max={1000000000}
                            type="number"
                            value={product.price}
                            // defaultValue={0}
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
                        <div style={{ display: 'flex' }}>
                            <label className="input-label">
                                Thương hiệu - Loại sản phẩm <span style={{ color: 'red' }}>*</span>
                            </label>
                            {!prodValidate?.idCategory?.isValid && (
                                <label
                                    className="input-label"
                                    style={{ lineHeight: '20px', color: 'red', fontSize: '12px', fontStyle: 'italic' }}
                                >
                                    {prodValidate?.idCategory?.message}
                                </label>
                            )}
                        </div>

                        <div className="select-wapper" style={{ marginLeft: '0px' }}>
                            <Select
                                className="form-input select"
                                placeholder="-- Chọn thương hiệu"
                                optionFilterProp="children"
                                value={selectedBrand}
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
                                optionFilterProp="children"
                                value={selectedCate}
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
                        <label className="input-label">Giới tính</label>
                        <Radio.Group
                            className="radio-group"
                            value={2}
                            onChange={(e) => {
                                console.log('radio checked', e.target.value);
                                setProduct({ ...product, gender: e.target.value });
                            }}
                        >
                            <Radio value={1}>Male</Radio>
                            <Radio value={0}>Female</Radio>
                            <Radio value={2}>Unisex</Radio>
                        </Radio.Group>
                        <label className="input-label">Đường dẫn video</label>
                        <Input
                            type="text"
                            className="form-input"
                            value={product.urlVideo}
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
                            {(!prodValidate?.descriptionVi?.isValid || !prodValidate?.descriptionEn?.isValid) && (
                                <label
                                    className="input-label"
                                    style={{
                                        lineHeight: '20px',
                                        color: 'red',
                                        fontSize: '12px',
                                        fontStyle: 'italic',
                                    }}
                                >
                                    {prodValidate?.descriptionVi?.message || prodValidate?.descriptionEn?.message}
                                </label>
                            )}
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
                                            var fileName = info.file.originFileObj.name.split('.');
                                            setFilesFull((oldData) => [...oldData, info.file.originFileObj]);
                                            var resized = await handleResize(
                                                400,
                                                100,
                                                info.file.originFileObj,
                                                fileName[fileName.length - 1],
                                            );
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
                                // scroll={{ y: 300 }}
                                lineHeight="30"
                                tableLayout="-"
                                className="table"
                                components={components}
                                rowClassName={() => 'editable-row'}
                                rowSelection={{
                                    type: 'radio',
                                    onChange: (selectedRowKeys, selectedRows, e) =>
                                        handleClickRadio(selectedRows),
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
                    <div className="form admin-btn save">
                        <Button className="admin-btn save" type="primary" onClick={handleSubmit}>
                            Lưu
                        </Button>
                        <Button className="admin-btn save" type="primary" onClick={resetData}>
                            Làm mới
                        </Button>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default CreateProduct;
