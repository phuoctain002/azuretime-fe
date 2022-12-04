import './product.css';
import {
    Button,
    Image,
    message,
    Table,
    Form,
    Select,
    Input,
    InputNumber,
    Col,
    Row,
    Slider,
    Alert,
    notification,
    Menu,
    Switch,
} from 'antd';
import Upload from 'antd/lib/upload/Upload';
import { AiOutlineUpload } from 'react-icons/ai';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { url } from '../../../../api/url';
import { urnImageByProductId, urnAddProduct, urnBrand, urnCate } from '../../../../api/urn';
import Resizer from 'react-image-file-resizer';

function Products() {
    const [switchEn, setSwitchEn] = useState(false);
    const pluck = (key, array) =>
        array.reduce((values, current) => {
            values.push(current[key]);
            return values;
        }, []);

    const { TextArea } = Input;

    // SP: Save IMG PRODUCT
    const [upStatus, setUpStatus] = useState(true);
    const [avaId, setAvaId] = useState(null);
    const [productImgs, setProductImgs] = useState([]);

    // SP: PRODUCT
    const [descriptionEn, setDescriptionEn] = useState('');
    const [brands, setBrands] = useState([]);
    const [cates, setCates] = useState([]);
    const [catesByBrand, setCatesByBrand] = useState([]);
    const [product, setProduct] = useState({
        name: '',
        descriptionVi: '',
        descriptionEn: '',
        price: 1,
        productTypeId: 0,
        special: '',
        status: 1,
        percentDiscount: 0,
    });
    const [visibleDiscount, setVisibleDiscount] = useState(false);

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
    };
    const handleSelectCate = (value) => {
        setProduct({ ...product, idCategory: value });
    };
    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const handleResize = (size, quality, file) => {
        new Promise((resolve) => {
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
                'base64',
            );
        });
    };

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
                console.log(response.data.texts.replaceAll(' aaaaa ', '\n'));
                setDescriptionEn(response.data.texts.replaceAll(' aaaaa ', '\n'));
                setProduct({ ...product, descriptionEn: response.data.texts.replaceAll(' aaaaa ', '\n') });
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
    // handelDelete image
    const handleDelete = (key) => {
        // const newData = dataSubmitImgFir.filter((item) => item.key !== key);
        // setDataSubmitImgFir(newData);
    };
    const columns = [
        {
            title: 'TT',
            width: '50',
            dataIndex: 'id=1',
            render: (id, record, index) => {
                ++index;
                return index;
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
            // render: () => <Button danger>DEL</Button>,
            render: (_, record) => (
                <Button className="btnDel" danger onClick={() => handleDelete(record.key)}>
                    Delete
                </Button>
            ),
        },
    ];

    const components = {
        body: {
            row: EditableRow,
        },
    };

    const handleClickRadio = (selectedRows) => {
        setAvaId(selectedRows[0].file.uid);
        console.log('selectedRows: ', selectedRows[0].file.uid);
    };
    //#endregion

    const handleSubmitImage = (dataSubmitImgBe, imageFail) => {
        // axios.post(url + urnImageByProductId, dataSubmitImgBe).catch((err) => {
        //     imageFail.push({
        //         name: dataSubmitImgBe.fileName,
        //         urlFir: dataSubmitImgBe.name,
        //     });
        //     // var a = .name.join(' ,');
        //     // notification.warning({
        //     //     message: `Đã thêm sản phẩm`,
        //     //     description: 'Có lỗi khi thêm ảnh ' + dataSubmitImgBe.fileName,
        //     //     duration: 30,
        //     // });
        // });
        // console.log('SO 1', imageFail);
        // console.log(dataSubmitImgBe);
    };

    const isValidator = () => {
        const { name, description, productTypeId } = product;
        if (name === '' || description === '' || productTypeId === 0) {
            notification.warning({ message: `Vui lòng nhập các ô có dấu (*)`, duration: 4 });
            return false;
        }
        return true;
    };

    const SuccessNotify = () => {
        notification.success({
            message: `Thêm sản phẩm thành công`,
            duration: 4,
        });
    };

    const ErrNotify = (imagesFail) => {
        var result = pluck('name', imagesFail).join(', ');
        console.log('SO 2', pluck('name', imagesFail));
        notification.warning({
            message: `Đã thêm sản phẩm`,
            description: 'Có lỗi khi thêm ảnh ' + result,
            duration: 10,
        });

        // var resultUrl = pluck('url', imagesFail);
        // resultUrl.map((item) => {
        //     storage.refFromURL(item).delete();
        // });
    };
    const handleSubmit = async () => {
        if (isValidator()) {
            let imageFail = [];
            let imgsSubmit = [];
            let resultSuccess = 0;
            let resultFail = 0;

            if (productImgs.length > 0) {
                if (avaId === null) {
                    notification.warning({
                        message: `Chưa chọn ảnh đại diện cho sản phẩm`,
                        duration: 10,
                    });
                } else {
                    await axios
                        .post(url + urnAddProduct, product)
                        .then((res) => {
                            if (res.data) {
                                const productId = res.data;

                                productImgs.map(async (item, index) => {
                                    var name = Date.now() + '_' + item.file.name;

                                    // Resize to 400px, get base64
                                    const image400 = await handleResize(400, 100, item.file);
                                    imgsSubmit.push({
                                        name: name,
                                        urlResized: image400,
                                        urlFull: item.urlFull,
                                        isAvatar: item.file.uid === avaId,
                                        productId,
                                    });
                                });
                                // axios.post(url + urnAddImages, imgsSubmit);
                            }
                        })
                        .catch((err) => {
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

    const ResetData = () => {};

    return (
        <div className="wrap-content-admin">
            <div className="heading-product-type">
                <h1>Chỉnh sửa sản phẩm</h1>
            </div>
            <Row>
                <Col span={12}>
                    <div className="form">
                        <label className="input-label">
                            Mã sản phẩm <span style={{ color: 'red' }}>*</span>
                        </label>
                        <Input
                            type="text"
                            className="form-input"
                            placeholder="-- Nhập mã sản phẩm"
                            onBlur={(e) => setProduct({ ...product, code: e.target.value })}
                        />
                        <label className="input-label">
                            Tên sản phẩm <span style={{ color: 'red' }}>*</span>
                        </label>
                        <Input
                            type="text"
                            className="form-input"
                            placeholder="-- Nhập tên sản phẩm"
                            onBlur={(e) => setProduct({ ...product, nameProduct: e.target.value })}
                        />
                        <label className="input-label">
                            Thương hiệu - Loại sản phẩm <span style={{ color: 'red' }}>*</span>
                        </label>
                        <div className="select-wapper">
                            <Select
                                className="form-input select"
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
                            Mô tả sản phẩm ({switchEn ? 'tiếng anh' : 'tiếng việt'}){' '}
                            <span style={{ color: 'red' }}>*</span>
                            <Switch
                                checkedChildren="En"
                                unCheckedChildren="Vi"
                                checked={switchEn}
                                onChange={() => setSwitchEn(!switchEn)}
                            />
                        </label>
                        {!switchEn ? (
                            <TextArea
                                type="textArea"
                                allowClear={true}
                                className="form-input"
                                rows={20}
                                placeholder="-- Mô tả sản phẩm bằng tiếng Việt"
                                value={product.descriptionVi}
                                onChange={(e) => setProduct({ ...product, descriptionVi: e.target.value })}
                                // onBlur={(e) => setProduct({ ...product, descriptionVi: e.target.value })}
                            />
                        ) : (
                            <TextArea
                                type="textArea"
                                allowClear={true}
                                className="form-input"
                                rows={20}
                                placeholder="-- Mô tả sản phẩm bằng tiếng Anh"
                                value={product.descriptionEn}
                                // onChange={(e) => setProduct({ ...product, descriptionEn: e.target.value })}
                                onBlur={(e) => setProduct({ ...product, descriptionEn: e.target.value })}
                            />
                        )}
                        <Button type="primary" onClick={handleTranslate}>
                            Dịch tự động
                        </Button>
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
                        <label className="input-label">Điểm nổi bật</label>
                        <Input
                            type="text"
                            className="form-input"
                            placeholder="-- Điểm nổi bật (nếu có)"
                            onBlur={(e) => setProduct({ ...product, special: e.target.value })}
                        />
                        <label className="input-label">
                            Giá <span style={{ color: 'red' }}>*</span>
                        </label>
                        <InputNumber
                            className="form-input"
                            min={1}
                            max={1000000000}
                            type="number"
                            defaultValue={0}
                            placeholder="-- Nhập giá sản phẩm"
                            onBlur={(e) => {
                                setProduct({ ...product, price: e.target.value });
                                setVisibleDiscount(e.target.value !== 0);
                            }}
                        />
                        {visibleDiscount ? (
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
                        )}
                    </div>
                </Col>
                <Col span={12}>
                    <label className="input-label input-label-image">
                        Ảnh sản phẩm{' '}
                        <label style={{ fontWeight: 'normal', fontSize: 14, color: '#000', opacity: 0.8 }}>
                            (<span style={{ color: 'red' }}>*</span>Bấm vào ô tròn để chọn ảnh đại diện cho sản phẩm){' '}
                        </label>
                    </label>
                    <Table
                        pagination={false}
                        scroll={{ y: 300 }}
                        lineHeight="30"
                        tableLayout="-"
                        className="table"
                        components={components}
                        rowClassName={() => 'editable-row'}
                        rowSelection={{
                            type: 'radio',
                            onChange: (selectedRowKeys, selectedRows) => handleClickRadio(selectedRows),
                        }}
                        bordered
                        columns={columns}
                        dataSource={productImgs}
                    />
                </Col>
            </Row>
            <Row className="row-bottom">
                <Col span={12}>
                    <Button type="primary" onClick={handleSubmit}>
                        Save
                    </Button>
                </Col>
                <Col span={12}>
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
                        onChange={(info) => {
                            // Up false thì không setData
                            if (upStatus) {
                                if (info.file.percent === 100) {
                                    getBase64(info.file.originFileObj, (url) => {
                                        setProductImgs((oldData) => [
                                            ...oldData,
                                            { key: info.file.uid, url, file: info.file.originFileObj },
                                        ]);
                                    });
                                }
                            }
                        }}
                    >
                        <Button className="btn-upload" icon={<AiOutlineUpload />}>
                            <span>Upload image</span>
                        </Button>
                    </Upload>
                </Col>
            </Row>
        </div>
    );
}

export default Products;
