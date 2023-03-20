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
    Spin,
    Radio,
    Steps,
    Result,
    theme,
} from 'antd';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { LoadingOutlined, ArrowLeftOutlined } from '@ant-design/icons';
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
    urnUpdateProduct,
    urnUpdateAvaImage,
    urnDeleteImages,
} from '../../../../api/urn';
import Resizer from 'react-image-file-resizer';
import { Link, useParams } from 'react-router-dom';

function UpdateProduct(prop) {
    document.title = 'Admin - Sửa sản phẩm';
    const [current, setCurrent] = useState(0);
    const { token } = theme.useToken();
    const [loading, setLoading] = useState(true); //show loading

    // SP: Save IMG PRODUCT
    const [upStatus, setUpStatus] = useState(true);
    const [avaIdDisplay, setAvaIdDisplay] = useState(null);
    const [avaIdSubmit, setAvaIdSubmit] = useState(null);

    const [productImgs, setProductImgs] = useState([]); //Dùng hiển thị trên table
    const [imgsSubmit, setImgsSubmit] = useState([]); //Dùng lưu lên DB
    const [filesFull, setFilesFull] = useState([]);
    const [filesResized, setFilesResized] = useState([]);

    // SP: PRODUCT
    const [selectedBrand, setSelectedBrand] = useState();
    const [selectedCate, setSelectedCate] = useState();
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

    useEffect(() => {
        axios.get(url + urnBrand).then((res) => {
            setBrands(res.data);
        });
        axios.get(url + urnCate).then((res) => {
            setCates(res.data);
        });
        axios.get(url + urnDetailProduct(idProduct)).then((res) => {
            console.log('res.data', res.data);
            setProduct(res.data);
            setCatesByBrand(cates.filter((x) => x.idBrand === res.data.idBrand));
            setLoading(false);
        });
        axios.get(url + urnDetailImgs(idProduct)).then((res) => {
            setProductImgs(
                res.data.map((item) => {
                    return { ...item, url: path + item.name };
                }),
            );
            setAvaIdDisplay(res.data[0].key);
            setAvaIdSubmit({ ...avaIdSubmit, oldId: res.data[0].key, case: 1 }); // case 1 là không có gì thay đổi
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
        console.log('product', product);
        // const text = product.descriptionVi;
        // const options = {
        //     method: 'POST',
        //     url: 'https://ai-translate.p.rapidapi.com/translate',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'X-RapidAPI-Key': '4ac5dc1462msh54b5291a85bb08dp13d741jsn956c8de38d96',
        //         'X-RapidAPI-Host': 'ai-translate.p.rapidapi.com',
        //     },
        //     data: { texts: [text], tl: 'en', sl: 'vi' },
        // };

        // axios
        //     .request(options)
        //     .then(function (response) {
        //         setProduct({ ...product, descriptionEn: response.data.texts });
        //     })
        //     .catch(function (error) {
        //         console.error(error);
        //     });
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
        // console.log(key);
        // console.log(filesFull, imgsSubmit, productImgs);
        if (productImgs.find((item) => item.key === key).isAvatar) {
            return notification.error({
                message: `Không thể xóa ảnh đại diện`,
                duration: 3,
            });
        }
        if (imgsSubmit.find((item) => item.idImg === key)) {
            // xóa hình mới: chỉ cần xóa trên UI của các nơi: filesFull, setFilesResized, imgsSubmit, productImgs
            setFilesFull(filesFull.filter((item) => item.uid !== key));
            setFilesResized(filesResized.filter((item) => item.uid !== key));
            setImgsSubmit(imgsSubmit.filter((item) => item.uid !== key));
            setProductImgs(productImgs.filter((item) => item.key !== key));
        } else {
            // xóa hình cũ: ko cần xóa trong filesFull, setFilesResized, imgsSubmit; chỉ xóa trong productImgs và xóa trên DB
            setProductImgs(productImgs.filter((item) => item.key !== key));
            axios.delete(url + urnDeleteImages(productImgs.find((item) => item.key === key).name));
        }
    };
    const handleClickRadio = (selectedRows) => {
        //#region -- cập nhật isAvatar hỗ trợ cho xóa ảnh --
        setProductImgs(
            productImgs.map((item) =>
                item.key === selectedRows[0].key ? { ...item, isAvatar: true } : { ...item, isAvatar: false },
            ),
        );
        //#endregion

        if (!selectedRows[0].file) {
            console.log('Cũ');
            // Trường hợp set cho hình cũ
            setAvaIdDisplay(selectedRows[0].key);
            setAvaIdSubmit({ ...avaIdSubmit, newId: selectedRows[0].key, case: 2 });
            setImgsSubmit(
                // Xóa ava của hình mới
                imgsSubmit.map((item) => {
                    return { ...item, isAvatar: false };
                }),
            );
        } else {
            console.log('Mới');
            console.log(
                productImgs.find((e) => {
                    return e.key === selectedRows[0].file.uid;
                }),
            );
            // Trường hợp set cho hình mới
            setAvaIdDisplay(selectedRows[0].file.uid);
            setAvaIdSubmit({ ...avaIdSubmit, case: 3 });
            setImgsSubmit(
                imgsSubmit.map((item) => {
                    return { ...item, isAvatar: item.uid === selectedRows[0].file.uid };
                }),
            );
        }
    };
    //#endregion
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
        console.log('PRODUCT', product);
        console.log('imgsSubmit', imgsSubmit.length);
        let isErr = 0;
        if (isValidator()) {
            axios
                .put(url + urnUpdateProduct, product)
                .then((res) => {
                    // Nếu có thêm hình mới
                    if (imgsSubmit.length > 0) {
                        console.log('LƯU HÌNH');
                        // Lưu hình vào db
                        const time = Date.now();
                        axios
                            .post(url + urnAddImages, {
                                idProduct: idProduct,
                                imgsSubmit: imgsSubmit.map((item) => {
                                    return { ...item, name: time + '_' + item.name };
                                }),
                            })
                            .catch((err) => {
                                console.log(err);
                                isErr++;
                            });
                        // Lưu hình vào be
                        axios
                            .post(
                                url + urnUploadImagesFull(time),
                                { files: filesFull },
                                {
                                    headers: {
                                        'Content-Type': 'multipart/form-data',
                                    },
                                },
                            )
                            .catch((err) => {
                                console.log(err);
                                isErr++;
                            });
                        axios
                            .post(
                                url + urnUploadImagesResized(time),
                                { files: filesResized },
                                {
                                    headers: {
                                        'Content-Type': 'multipart/form-data',
                                    },
                                },
                            )
                            .catch((err) => {
                                console.log(err);
                                isErr++;
                            });
                    }
                    // console.log(avaId);
                    if (avaIdSubmit.newId) {
                        if (avaIdSubmit.case !== 1) {
                            console.log('old khac new');
                            axios.put(url + urnUpdateAvaImage, avaIdSubmit).catch((err) => {
                                console.log(err);
                                isErr++;
                            });
                        }
                    }

                    isErr === 0
                        ? notification.success({
                              message: `Lưu thành công`,
                              duration: 3,
                          })
                        : notification.error({
                              message: `Lưu ảnh thất bại`,
                              duration: 3,
                          });
                })
                .catch((err) => {
                    notification.error({
                        message: `Lưu sản phẩm thất bại. Vui lòng thử lại!`,
                        duration: 3,
                    });
                    console.log(err);
                });
        }
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

    // ===STEP===
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
                            <CKEditor
                                editor={Editor}
                                data={product.descriptionEn}
                                onReady={(editor) => {
                                    // You can store the "editor" and use when it is needed.
                                    console.log('Editor is ready to use!', editor);
                                }}
                                onChange={(event, editor) => {
                                    handleDescriptionEn(editor.getData());
                                }}
                            />
                        </Col>
                        <Col span={10}>
                            <CKEditor
                                editor={Editor}
                                data={product.descriptionVi}
                                onReady={(editor) => {
                                    // You can store the "editor" and use when it is needed.
                                    console.log('Editor is ready to use!', editor);
                                }}
                                onChange={(event, editor) => {
                                    handleDescriptionVi(editor.getData());
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
                        title="Sửa sản phẩm thành công"
                        extra={[
                            <Link to={'/administrator/'}>
                                <Button onClick={() => setCurrent(0)}>Trang chủ</Button>
                            </Link>,
                            <Button
                                type="primary"
                                onClick={() => {
                                    // resetData();
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

    return (
        <div className="wrap-content-admin">
            <Row>
                <Col span={20}>
                    <Link to={'/administrator/products/'}>
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
            <Steps current={current} items={items} />
            <hr style={{ border: '1px dashed rgb(217, 217, 217)' }} />
            {loading ? (
                <LoadingOutlined id="loading-icon" />
            ) : (
                <>
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
                                {product.descriptionEn.length > 0 && product.descriptionVi.length > 0 && (
                                    <Button type="primary" className="btnStep" onClick={() => next()}>
                                        Next
                                    </Button>
                                )}
                            </>
                        )}
                        {current === 1 && (
                            <Button className="btnStep" type="primary" onClick={handleSubmit}>
                                Save
                            </Button>
                        )}
                    </div>
                </>
            )}

            {/* {loading ? (
                <LoadingOutlined id="loading-icon" />
            ) : (
                <>
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
                                        <label
                                            style={{ fontWeight: 'normal', fontSize: 14, color: '#000', opacity: 0.8 }}
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
                                            selectedRowKeys: [avaIdDisplay],
                                            onChange: (selectedRowKeys, selectedRows) => handleClickRadio(selectedRows),
                                        }}
                                        bordered
                                        columns={columns}
                                        dataSource={productImgs}
                                        rowKey={'key'}
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
                </>
            )} */}
        </div>
    );
}

export default UpdateProduct;
