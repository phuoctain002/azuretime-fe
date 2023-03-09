import './product.css';
import {
    Button,
    Image,
    Table,
    Form,
    Select,
    Input,
    InputNumber,
    Col,
    Row,
    notification,
    Radio,
    Steps,
    theme,
    Result,
} from 'antd';
import { CheckCircleOutlined, ArrowLeftOutlined, LoadingOutlined } from '@ant-design/icons';
import Upload from 'antd/lib/upload/Upload';
import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
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
import { BrowserRouter, Link, useParams } from 'react-router-dom';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useTranslation } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

function CreateProduct() {
    document.title = 'Admin - Thêm sản phẩm';
    const { TextArea } = Input;
    const { token } = theme.useToken();
    const { t, i18n } = useTranslation();
    const refEn = useRef();
    const refVi = useRef();
    const [loading, setLoading] = useState(false);
    // SP: Save IMG PRODUCT
    const [upStatus, setUpStatus] = useState(true);
    const [avaId, setAvaId] = useState(null);

    const [productImgs, setProductImgs] = useState([]); //Dùng hiển thị trên table
    const [imgsSubmit, setImgsSubmit] = useState([]); //Dùng lưu lên DB
    const [filesFull, setFilesFull] = useState([]);
    const [filesResized, setFilesResized] = useState([]);

    // SP: PRODUCT
    const { idBrand, idCategory } = useParams();
    const [brands, setBrands] = useState([]); //Danh sách hiển thị select
    const [cates, setCates] = useState([]); //Danh sách chưa lọc
    const [catesByBrand, setCatesByBrand] = useState([]); //Danh sách hiển thị select
    const [product, setProduct] = useState({
        code: '',
        nameProduct: '',
        descriptionEn: '',
        descriptionVi: '',
        price: 0,
        urlVideo: '',
        gender: 2, //2: không xác định
        idBrand: -1,
        idCategory: -1,
        idMenu: 0,
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
    const [current, setCurrent] = useState(0);
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
    // const [visibleDiscount, setVisibleDiscount] = useState(false); //Nếu dùng discount thì mở ra
    useEffect(() => {
        axios.get(url + urnBrand).then((res) => {
            setBrands(res.data);
        });
        axios.get(url + urnCate).then((res) => {
            setCates(res.data);
            if (idBrand && idCategory) {
                setSelectedBrand(Number(idBrand));
                setCatesByBrand(res.data.filter((x) => x.idBrand === Number(idBrand)));
                setSelectedCate(Number(idCategory));
            }
        });
    }, []);
    // text-editor
    // Add fonts to whitelist
    let Font = Quill.import('formats/font');
    // We do not add Sans Serif since it is the default
    Font.whitelist = ['monospace', 'serif', 'sans-serif'];
    Quill.register(Font, true);
    //product type
    const handleSelectBrand = (value) => {
        setProduct({ ...product, idBrand: value });
        let a = cates.filter((x) => x.idBrand === value);
        setCatesByBrand(a);
        setSelectedBrand(value);
        setSelectedCate();
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
        // setLoading(true);
        let countEn = refEn.current.unprivilegedEditor.getText().length;
        let countVi = refVi.current.unprivilegedEditor.getText().length;
        console.log('descriptionEn', countEn);
        console.log('descriptionVi', countVi);
        if ((countEn > 1 && countVi > 1) || (countEn <= 1 && countVi <= 1)) {
            notification.warning({
                message: `Không có nội dung cần dịch`,
                duration: 4,
            });
            return;
        } else if (countEn <= 1 && countVi > 1) {
            handleTranslateToEn();
            // setLoading(false);
            // console.log('false');
        } else if (countEn > 1 && countVi <= 1) {
            handleTranslateToVi();
            // setLoading(false);
            // console.log('false');
        }
    };
    const handleTranslateToVi = () => {
        const text = product.descriptionEn.replaceAll('\n', ' a1b2c3d4 ');
        const options = {
            method: 'POST',
            url: 'https://ai-translate.p.rapidapi.com/translate',
            headers: {
                'Content-Type': 'application/json',
                'X-RapidAPI-Key': '4ac5dc1462msh54b5291a85bb08dp13d741jsn956c8de38d96',
                'X-RapidAPI-Host': 'ai-translate.p.rapidapi.com',
            },
            data: { texts: [text], tl: 'vi', sl: 'en' },
        };
        axios
            .request(options)
            .then(function (response) {
                setProduct({ ...product, descriptionVi: response.data.texts.replaceAll(' a1b2c3d4', '\n') });
                notification.success({
                    message: `Đã dịch xong`,
                    duration: 4,
                });
            })
            .catch(function (error) {
                console.error(error);
            });
    };
    const handleTranslateToEn = () => {
        console.log('descriptionVi', product.descriptionVi);
        const text = product.descriptionVi.replaceAll('\n', ' a1b2c3d4 ');
        const options = {
            method: 'POST',
            url: 'https://ai-translate.p.rapidapi.com/translate',
            headers: {
                'Content-Type': 'application/json',
                'X-RapidAPI-Key': '4ac5dc1462msh54b5291a85bb08dp13d741jsn956c8de38d96',
                'X-RapidAPI-Host': 'ai-translate.p.rapidapi.com',
            },
            data: { texts: [text], tl: 'en', sl: 'vi' },
        };
        axios
            .request(options)
            .then(function (response) {
                setProduct({ ...product, descriptionEn: response.data.texts.replaceAll(' a1b2c3d4', '\n') });
                notification.success({
                    message: `Đã dịch xong`,
                    duration: 4,
                });
            })
            .catch(function (error) {
                console.error(error);
            });
    };

    const handleDescriptionEn = (value) => {
        setProduct({ ...product, descriptionEn: value });
    };
    const handleDescriptionVi = (value) => {
        setProduct({ ...product, descriptionVi: value });
    };

    const isValidator = () => {
        console.log('product', product);
        if (
            product.code === '' ||
            product.nameProduct === '' ||
            product.descriptionEn === '' ||
            product.descriptionVi === '' ||
            product.idBrand < 0 ||
            product.idCategory < 0
        ) {
            return false;
        }
        return true;
    };
    const handleUrlVideo = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        const idVideo = match && match[2].length === 11 ? match[2] : null;
        setProduct({ ...product, urlVideo: 'https://www.youtube.com/embed/' + idVideo });
    };

    const handleSubmit = () => {
        if (productImgs.length > 0) {
            if (avaId === null) {
                notification.warning({
                    message: `Chưa chọn ảnh đại diện cho sản phẩm`,
                    duration: 4,
                });
            } else {
                console.log('SERVER ĐANG DÙNG', url);
                console.log('product', product);
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
                        // Chuyển step
                        setCurrent(current + 1);
                        // Reset data
                        resetData();
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
                duration: 2,
            });
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
            idMenu: 0,
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
    // ===STEP===
    const next = () => {
        const isValid = isValidator();
        if (isValid) {
            console.log('product', product);
            setCurrent(current + 1);
        } else {
            notification.warning({ message: `Vui lòng nhập các ô có dấu (*)`, duration: 4 });
        }
    };
    const prev = () => {
        setCurrent(current - 1);
    };
    const itemsStep = [
        {
            title: 'Sản phẩm',
            style: { margin: '20px' },
            status: 'process',
            content: (
                <>
                    <Row className="row-info-prouct">
                        <Col span={10}>
                            <div className="form">
                                <div style={{ display: 'flex' }}>
                                    <label className="input-label">
                                        Mã sản phẩm <span style={{ color: 'red' }}>*</span>
                                    </label>
                                </div>

                                <Input
                                    type="text"
                                    className="form-input"
                                    value={product.code}
                                    placeholder="-- Nhập mã sản phẩm"
                                    onChange={(e) => {
                                        setProduct({ ...product, code: e.target.value });
                                    }}
                                />

                                <div style={{ display: 'flex' }}>
                                    <label className="input-label">
                                        Tên sản phẩm <span style={{ color: 'red' }}>*</span>
                                    </label>
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
                                    min={0}
                                    max={1000000000}
                                    type="number"
                                    value={product.price}
                                    // defaultValue={0}
                                    placeholder="-- Nhập giá sản phẩm"
                                    onChange={(e) => {
                                        setProduct({ ...product, price: Number(e.target.value) });
                                    }}
                                />
                            </div>
                        </Col>
                        <Col span={10}>
                            <div className="form">
                                <div style={{ display: 'flex' }}>
                                    <label className="input-label">
                                        Thương hiệu - Loại sản phẩm <span style={{ color: 'red' }}>*</span>
                                    </label>
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
                                <label className="input-label">Đường dẫn video</label>
                                <Input
                                    type="text"
                                    className="form-input"
                                    value={product.urlVideo}
                                    placeholder="-- Nhập Đường dẫn video cho sản phẩm"
                                    onChange={(e) => handleUrlVideo(e.target.value)}
                                />
                            </div>
                        </Col>
                    </Row>

                    <Row className="row-info-prouct" style={{ marginTop: '-26px' }}>
                        <Col span={21}>
                            <div className="form">
                                <div className="heading-description">
                                    <label className="input-label description">
                                        Mô tả sản phẩm <span style={{ color: 'red' }}>*</span>
                                    </label>
                                </div>
                            </div>
                        </Col>
                    </Row>

                    {/* DESCRIPTION EN */}
                    <Row className="row-info-prouct" style={{ marginTop: '-26px' }}>
                        <Col span={10}>
                            {/* <CustomToolbar theme="snow" /> */}
                            <ReactQuill
                                className="editor"
                                theme="snow"
                                ref={refVi}
                                value={product.descriptionVi}
                                onChange={handleDescriptionVi}
                                placeholder="-- Mô tả sản phẩm bằng tiếng Việt"
                                modules={{
                                    toolbar: [
                                        ['bold', 'italic', 'underline'], // toggled buttons

                                        [{ list: 'ordered' }, { list: 'bullet' }],
                                        [{ align: [] }],

                                        [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown

                                        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
                                        [{ font: Font.whitelist }],
                                    ],
                                }}
                            />
                        </Col>
                        <Col span={10}>
                            {/* <CustomToolbar theme="snow" /> */}
                            <ReactQuill
                                className="editor"
                                theme="snow"
                                ref={refEn}
                                value={product.descriptionEn}
                                onChange={handleDescriptionEn}
                                placeholder="-- Mô tả sản phẩm bằng tiếng Anh"
                                modules={{
                                    toolbar: [
                                        ['bold', 'italic', 'underline'], // toggled buttons

                                        [{ list: 'ordered' }, { list: 'bullet' }],
                                        [{ align: [] }],

                                        [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown

                                        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
                                        [{ font: Font.whitelist }],
                                    ],
                                }}
                            />
                        </Col>
                    </Row>
                </>
            ),
        },
        {
            title: 'Hình ảnh',
            status: 'wait',
            content: (
                <>
                    <Row className="row-info-prouct">
                        <Col span={20}>
                            <div className="form">
                                <div className="heading-image">
                                    <label className="input-label input-label-image">
                                        Ảnh sản phẩm{' '}
                                        <label
                                            style={{
                                                fontWeight: 'normal',
                                                fontSize: 14,
                                                color: '#000',
                                                opacity: 0.8,
                                            }}
                                        >
                                            (<span style={{ color: 'red' }}>* </span>Bấm vào ô tròn để chọn ảnh đại diện
                                            cho sản phẩm){' '}
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
                                            return typeImg.includes(file.type) ? true : Upload.LIST_IGNORE;
                                        }}
                                        onChange={async (info) => {
                                            // Up false thì không setData
                                            if (upStatus) {
                                                // console.log(info);
                                                // if (info.file.status === 'done' && info.file.percent === 100) {
                                                if (info.file.status === 'uploading' && info.file.percent === 0) {
                                                    console.log('dô rồi');
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
                                                            idImg: info.file.uid,
                                                            uid: info.file.uid,
                                                            name: info.file.originFileObj.name,
                                                            isAvatar: false,
                                                        },
                                                    ]);
                                                    getBase64(info.file.originFileObj, (url) => {
                                                        // Show table
                                                        if (
                                                            productImgs.some((element) => element.key === info.file.uid)
                                                        ) {
                                                            console.log('Có hình này rồi');
                                                        } else {
                                                            setProductImgs((oldData) => [
                                                                ...oldData,
                                                                {
                                                                    key: info.file.uid,
                                                                    url,
                                                                    file: info.file.originFileObj,
                                                                },
                                                            ]);
                                                        }
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
                </>
            ),
        },
        {
            title: 'Hoàn tất',
            status: 'wait',
            content: (
                <>
                    <Result
                        status="success"
                        title="Thêm sản phẩm thành công"
                        extra={[
                            <Link to={'/administrator/'}>
                                <Button onClick={() => setCurrent(0)}>Trang chủ</Button>
                            </Link>,
                            <Button
                                type="primary"
                                onClick={() => {
                                    resetData();
                                    setCurrent(0);
                                }}
                            >
                                Thêm sản phẩm
                            </Button>,
                        ]}
                    />
                </>
            ),
        },
    ];
    const items = itemsStep.map((item) => ({
        key: item.title,
        title: item.title,
    }));
    const contentStyle = {
        textAlign: 'center',
        color: token.colorTextTertiary,
        backgroundColor: token.colorFillAlter,
        marginTop: 16,
    };

    return (
        <div className="wrap-content-admin">
            {loading && <LoadingOutlined id="loading-icon" />}
            <div className="btn-back">
                <Link to={'/administrator/products/'}>
                    <Button type="text">
                        <ArrowLeftOutlined />
                        Back
                    </Button>
                </Link>
            </div>
            <div className="heading-product-type">
                <h1>Tạo sản phẩm</h1>
            </div>

            <Steps current={current} items={items} />
            <hr style={{ border: '1px dashed rgb(217, 217, 217)' }} />
            <div style={contentStyle}>{itemsStep[current].content}</div>
            <div className="btn-row">
                {current === 1 && (
                    <Button
                        className="btnStep"
                        style={{
                            margin: '0 8px',
                        }}
                        onClick={() => prev()}
                    >
                        Previous
                    </Button>
                )}
                {current === 0 && (
                    <>
                        <Button type="primary" className="btnStep" onClick={handleTranslate}>
                            Translate
                        </Button>
                        <Button type="primary" className="btnStep" onClick={() => next()}>
                            Next
                        </Button>
                    </>
                )}
                {current === 1 && (
                    <Button className="btnStep" type="primary" onClick={handleSubmit}>
                        Save
                    </Button>
                )}
            </div>
        </div>
    );
}

export default CreateProduct;
