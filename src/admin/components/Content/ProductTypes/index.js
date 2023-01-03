import React, { useState } from 'react';
import {
    Form,
    Input,
    InputNumber,
    Popconfirm,
    Table,
    Typography,
    Row,
    Col,
    Button,
    notification,
    Space,
    Tooltip,
} from 'antd';
import './ptypes.css';
import '../../../../App.css';
import { useEffect } from 'react';
import axios from 'axios';
import { url } from '../../../../api/url';
import { urnBrand, urnCate, urnDeleteBrand, urnDeleteCate } from '../../../../api/urn';
import { Link } from 'react-router-dom';

function ProductTypes() {
    document.title = 'Admin - Thương hiệu - Loại';
    const [api, contextHolder] = notification.useNotification();
    const [brands, setBrands] = useState([]); //Danh sách hiển thị table brand
    const [cates, setCates] = useState([]); //Danh sách chưa lọc
    const [catesByBrand, setCatesByBrand] = useState([]); //Danh sách hiển thị table cate
    const [loadingBrand, setLoadingBrand] = useState(true); //show loading
    const [loadingCate, setLoadingCate] = useState(); //show loading

    //#region --Brand--
    // Form Brand
    const [formBrand] = Form.useForm();
    const [editingKeyBrand, setEditingKeyBrand] = useState('');
    const [pageBrand, setPageBrand] = useState(1);
    const isEditingBrand = (record) => record.idBrand === editingKeyBrand;

    const [brand, setBrand] = useState({ nameBrand: '' });
    const [cate, setCate] = useState({ nameCategory: '', idBrand: -1 });
    const [isHidden, setIsHidden] = useState(true);

    const handleAddBrand = async () => {
        if (brand.nameBrand !== '') {
            await axios
                .post(url + urnBrand, brand)
                .then((insertId) => {
                    do {
                        if (insertId)
                            axios.get(url + urnBrand).then((res) => {
                                setBrands(res.data);
                                setBrand({ nameBrand: '' });
                            });
                    } while (!insertId);
                    notification.success({ message: `Lưu thành công!`, duration: 2 });
                })
                .catch((err) => {
                    console.log(err);
                    notification.error({ message: `Lưu thất bại, vui lòng liên hệ quản trị viên!`, duration: 4 });
                });
        }
    };
    const handleDeleteBrand = (brand) => {
        axios.delete(url + urnDeleteBrand(brand.idBrand)).then((res) => {
            setBrands(brands.filter((x) => x.idBrand !== brand.idBrand));
            if (brand.idBrand === cate.idBrand) {
                setCatesByBrand([]);
                setCate({ ...cate, idBrand: -1 });
            }
        });
    };
    const confirmDelete = (brand) => {
        const btn = (
            <Space>
                <Button
                    type="link"
                    style={{ width: '40px', fontSize: '14px' }}
                    size="small"
                    onClick={() => api.destroy()}
                >
                    Hủy
                </Button>
                <Button type="primary" size="small" onClick={() => handleDeleteBrand(brand)}>
                    Xóa
                </Button>
            </Space>
        );
        api.open({
            message: 'Xác nhận',
            description: ' Các Loại sản phẩm của Thương hiệu này sẽ bị xóa theo. Có chắc bạn muốn xóa?',
            btn,
            duration: 0,
        });
    };
    const handleAddCate = async () => {
        if (cate.idBrand) {
            await axios
                .post(url + urnCate, cate)
                .then((insertId) => {
                    do {
                        axios.get(url + urnCate).then((res) => {
                            setCates(res.data);
                            setCatesByBrand(res.data.filter((x) => x.idBrand === cate.idBrand));
                            setCate({ nameBrand: '', idBrand: cate.idBrand });
                        });
                    } while (!insertId);
                    notification.success({ message: `Lưu thành công!`, duration: 2 });
                })
                .catch((err) => {
                    console.log(err);
                    notification.error({ message: `Lưu thất bại, vui lòng liên hệ quản trị viên!`, duration: 4 });
                });
        } else {
            notification.success({ message: `Hãy chọn thương hiệu muốn thêm loại sản phẩm!`, duration: 4 });
        }
    };
    const handleDeleteCate = (cate) => {
        console.log(cate);
        axios.delete(url + urnDeleteCate(cate.idCategory)).then((res) => {
            const result = cates.filter((x) => x.idCategory !== cate.idCategory);
            setCates(result);
            setCatesByBrand(result.filter((x) => x.idBrand === cate.idBrand));
        });
    };
    const handleAddProduct = () => {};

    const editBrand = (record) => {
        formBrand.setFieldsValue({
            nameBrand: '',
            ...record,
        });
        setEditingKeyBrand(record.idBrand);
    };
    const cancelBrand = () => {
        setEditingKeyBrand('');
    };
    const saveBrand = async (idBrand) => {
        try {
            const rowBrand = await formBrand.validateFields();
            const newDataBrand = [...brands];
            const indexBrand = newDataBrand.findIndex((item) => idBrand === item.idBrand);
            if (indexBrand > -1) {
                const itemBrand = newDataBrand[indexBrand];
                const itemUpdate = {
                    ...itemBrand,
                    ...rowBrand,
                };
                console.log(brand, indexBrand, newDataBrand[indexBrand], rowBrand, itemUpdate);
                newDataBrand.splice(indexBrand, 1, itemUpdate);

                let item = { idBrand, nameBrand: rowBrand.nameBrand };
                await axios.put(url + urnBrand, item).then((res) => {
                    notification.success({ message: `Lưu thành công!`, duration: 4 });
                    // newDataBrand.push(rowBrand);
                    setBrands(newDataBrand);
                    setEditingKeyBrand('');
                });
                await axios.get(url + urnCate).then((res) => {
                    setCates(res.data);
                    setCatesByBrand(res.data.filter((x) => x.idBrand === item.idBrand));
                });
            } else {
                newDataBrand.push(rowBrand);
                setBrands(newDataBrand);
                setEditingKeyBrand('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const columnsBrand = [
        {
            title: 'STT',
            width: '5%',
            editable: false,
            key: 'index',
            dataIndex: 'index=1',
            render: (id, record, index) => {
                // (page - 1) * (rows in 1 page) + (index + 1)
                return pageBrand === 1 ? pageBrand + index : (pageBrand - 1) * 10 + index + 1;
            },
        },
        {
            title: 'Tên thương hiệu',
            dataIndex: 'nameBrand',
            width: '60%',
            editable: true,
        },
        {
            title: 'Chức năng',
            dataIndex: 'operation',
            width: '35%',
            render: (_, record) => {
                const editableBrand = isEditingBrand(record);
                return editableBrand ? (
                    <span style={{ display: 'flex' }}>
                        <Typography.Link
                            onClick={() => saveBrand(record.idBrand)}
                            style={{
                                marginRight: 15,
                                fontWeight: 'bold',
                            }}
                        >
                            Lưu
                        </Typography.Link>

                        <div onClick={cancelBrand}>
                            <a style={{ fontWeight: 'bold' }}>Hủy</a>
                        </div>
                    </span>
                ) : (
                    <span style={{ display: 'flex' }}>
                        <div
                            onClick={() => rowSelection(record)}
                            style={{
                                marginRight: 15,
                                fontWeight: 'bold',
                            }}
                        >
                            <a>Xem</a>
                        </div>
                        <Typography.Link
                            disabled={editingKeyBrand !== ''}
                            onClick={() => editBrand(record)}
                            style={{
                                marginRight: 15,
                                fontWeight: 'bold',
                            }}
                        >
                            Sửa
                        </Typography.Link>
                        {contextHolder}
                        <div onClick={() => confirmDelete(record)}>
                            <a style={{ color: 'red', fontWeight: 'bold' }}>Xóa</a>
                        </div>
                    </span>
                );
            },
        },
    ];
    const mergedColumnsBrand = columnsBrand.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditingBrand(record),
            }),
        };
    });

    const EditableCellBrand = ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
        const inputNodeBrand = <Input />;
        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item
                        name={dataIndex}
                        style={{
                            margin: 0,
                        }}
                        rules={[
                            {
                                required: true,
                                message: `Please Input ${title}!`,
                            },
                        ]}
                    >
                        {inputNodeBrand}
                    </Form.Item>
                ) : (
                    children
                )}
            </td>
        );
    };

    const rowSelection = (item) => {
        setLoadingCate(true);
        setCatesByBrand(cates.filter((x) => x.idBrand === item.idBrand));
        setCate({ ...cate, idBrand: item.idBrand });
        setIsHidden(true);
        setLoadingCate(false);
    };
    //#endregion

    //#region --CATE--
    // Form Category
    const [formCate] = Form.useForm();
    const [editingKeyCate, setEditingKeyCate] = useState('');
    const [pageCate, setPageCate] = useState(1);
    const isEditingCate = (record) => record.idCategory === editingKeyCate;

    const editCate = (record) => {
        formCate.setFieldsValue({
            nameCategory: '',
            ...record,
        });
        setEditingKeyCate(record.idCategory);
    };
    const cancelCate = () => {
        setEditingKeyCate('');
    };
    const saveCate = async (idCategory) => {
        try {
            const rowCate = await formCate.validateFields();
            const newDataCate = [...cates];
            const indexCate = newDataCate.findIndex((item) => idCategory === item.idCategory);
            if (indexCate > -1) {
                const itemCate = newDataCate[indexCate];
                newDataCate.splice(indexCate, 1, {
                    ...itemCate,
                    ...rowCate,
                });
                setCates(newDataCate);
                setEditingKeyCate('');

                let item = { idCategory, nameCategory: rowCate.nameCategory };
                await axios.put(url + urnCate, item).then((res) => {
                    notification.success({ message: `Lưu thành công!`, duration: 4 });
                    newDataCate.push(rowCate);
                    setCates(newDataCate);
                    setEditingKeyCate('');
                });
                await axios.get(url + urnCate).then((res) => {
                    setCates(res.data);
                    console.log(res.data);
                    setCatesByBrand(res.data.filter((x) => x.idBrand === cate.idBrand));
                });
            } else {
                newDataCate.push(rowCate); //rowCate là value tư
                setCates(newDataCate);
                setEditingKeyCate('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };
    const columnsCate = [
        {
            title: 'STT',
            width: '4%',
            editable: false,
            key: 'index',
            dataIndex: 'index=1',
            render: (id, record, index) => {
                // (page - 1) * (rows in 1 page) + (index + 1)
                return pageCate === 1 ? pageCate + index : (pageCate - 1) * 10 + index + 1;
            },
        },
        {
            title: 'Tên loại sản phẩm',
            dataIndex: 'nameCategory',
            width: '34%',
            editable: true,
        },
        {
            title: 'Thương hiệu',
            dataIndex: 'nameBrand',
            width: '34%',
            editable: false,
        },
        {
            title: 'Chức năng',
            dataIndex: 'operation',
            width: '28%',
            render: (_, record) => {
                const editableCate = isEditingCate(record);
                return editableCate ? (
                    <span style={{ display: 'flex' }}>
                        <Typography.Link
                            onClick={() => saveCate(record.idCategory)}
                            style={{
                                marginRight: 15,
                                fontWeight: 'bold',
                            }}
                        >
                            Lưu
                        </Typography.Link>

                        <div onClick={cancelCate}>
                            <a style={{ fontWeight: 'bold' }}>Hủy</a>
                        </div>
                    </span>
                ) : (
                    <span style={{ display: 'flex' }}>
                        <div onClick={() => handleAddProduct(record)}>
                            <Tooltip placement="topLeft" title="Thêm sản phẩm">
                                <Link
                                    to={'/administrator/create-product/' + record.idBrand + '/' + record.idCategory}
                                    style={{ color: '#1677ff', marginRight: 10, fontWeight: 'bold' }}
                                >
                                    Thêm
                                </Link>
                            </Tooltip>
                        </div>
                        <Typography.Link
                            disabled={editingKeyCate !== ''}
                            onClick={() => editCate(record)}
                            style={{
                                marginRight: 10,
                                fontWeight: 'bold',
                            }}
                        >
                            Sửa
                        </Typography.Link>

                        <div onClick={() => handleDeleteCate(record)}>
                            <a style={{ color: 'red', fontWeight: 'bold' }}>Xóa</a>
                        </div>
                    </span>
                );
            },
        },
    ];
    const mergedColumnsCate = columnsCate.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditingCate(record),
            }),
        };
    });

    const EditableCellCate = ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
        const inputNodeCate = <Input />;
        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item
                        name={dataIndex}
                        style={{
                            margin: 0,
                        }}
                        rules={[
                            {
                                required: true,
                                message: `Please Input ${title}!`,
                            },
                        ]}
                    >
                        {inputNodeCate}
                    </Form.Item>
                ) : (
                    children
                )}
            </td>
        );
    };
    //#endregion

    useEffect(() => {
        axios.get(url + urnBrand).then((res) => {
            setBrands(res.data);
            setLoadingBrand(false);
        });
        axios.get(url + urnCate).then((res) => {
            setCates(res.data);
        });
    }, []);

    return (
        <div className="wrap-content-admin">
            <Row>
                <Col span={11}>
                    <div className="heading-product-type">
                        <h1>Thương hiệu</h1>
                    </div>
                    <div style={{ padding: '0 27px' }}>
                        <Input.Group compact>
                            <Input
                                style={{ width: 'calc(100% - 200px)' }}
                                placeholder="-- Nhập tên thương hiệu"
                                value={brand.nameBrand}
                                onChange={(e) => {
                                    setBrand({ ...brand, nameBrand: e.target.value });
                                }}
                            />
                            <Button type="primary" onClick={handleAddBrand}>
                                Thêm
                            </Button>
                        </Input.Group>
                    </div>

                    <div className="form">
                        <div className="form-product-type">
                            <Form form={formBrand} component={false}>
                                <Table
                                    loading={loadingBrand}
                                    components={{
                                        body: {
                                            cell: EditableCellBrand,
                                        },
                                    }}
                                    bordered
                                    dataSource={brands}
                                    columns={mergedColumnsBrand}
                                    rowClassName={(record, index) =>
                                        index % 2 === 0 ? 'table-row-light editable-row' : 'table-row-dark editable-row'
                                    }
                                    pagination={{
                                        onChange(current) {
                                            setPageBrand(current);
                                            cancelBrand();
                                        },
                                        pageSize: 10,
                                    }}
                                />
                            </Form>
                        </div>
                    </div>
                </Col>
                <Col span={13}>
                    <div className="heading-product-type">
                        <h1>Loại sản phẩm</h1>
                    </div>

                    {cate.idBrand >= 0 ? (
                        <div style={{ padding: '0 27px' }}>
                            <Input.Group compact>
                                <Input
                                    style={{ width: 'calc(100% - 200px)' }}
                                    placeholder="-- Nhập tên loại sản phẩm"
                                    value={cate.nameCategory}
                                    onChange={(e) => {
                                        setCate({ ...cate, nameCategory: e.target.value });
                                    }}
                                />
                                <Button type="primary" onClick={handleAddCate}>
                                    Thêm
                                </Button>
                            </Input.Group>
                        </div>
                    ) : (
                        <div style={{ height: '32px' }}></div>
                    )}

                    <div className="form">
                        <div className="form-product-type">
                            <Form form={formCate} component={false}>
                                <Table
                                    loading={loadingCate}
                                    components={{
                                        body: {
                                            cell: EditableCellCate,
                                        },
                                    }}
                                    bordered
                                    dataSource={catesByBrand}
                                    columns={mergedColumnsCate}
                                    rowClassName={(record, index) =>
                                        index % 2 === 0 ? 'table-row-light editable-row' : 'table-row-dark editable-row'
                                    }
                                    pagination={{
                                        onChange(current) {
                                            setPageCate(current);
                                            cancelCate();
                                        },
                                        pageSize: 10,
                                    }}
                                />
                            </Form>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default ProductTypes;
