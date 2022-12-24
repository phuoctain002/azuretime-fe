import React from 'react';
import { Space, Table, Tag, Col, Row, Form, Button, Select, Popconfirm, Input, Icon } from 'antd';
import { CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import { url } from '../../../../api/url';
import { urnProsAdmin, urnBrand, urnCate, urnDeleteProduct, urnGetImgsName } from '../../../../api/urn';
import './product.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Product() {
    document.title = 'Admin - Sản phẩm';
    const [products, setProducts] = useState([]); //Danh sách hiển thị theo filter
    const [productsAll, setProductsAll] = useState([]); //Danh sách tất cả products
    const [page, setPage] = useState(1);
    const [brands, setBrands] = useState([]); //Danh sách hiển thị select
    const [selectedBrand, setSelectedBrand] = useState(); //Danh sách hiển thị select
    const [cates, setCates] = useState([]); //Danh sách chưa lọc
    const [catesByBrand, setCatesByBrand] = useState([]); //Danh sách hiển thị select
    const [selectedCate, setSelectedCate] = useState(); //Danh sách hiển thị select
    const [loading, setLoading] = useState(true); //show loading

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
    const components = {
        body: {
            row: EditableRow,
        },
    };
    const columns = [
        {
            title: 'STT',
            width: '52px',
            key: 'index',
            dataIndex: 'index=1',
            render: (id, record, index) => {
                // (page - 1) * (rows in 1 page) + (index + 1)
                return page === 1 ? page + index : (page - 1) * 10 + index + 1;
            },
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'nameProduct',
            width: '32vw',
            key: 'nameProduct',
            render: (_, row) => {
                return (
                    <div>
                        <Link to={'/admin/update-product/' + row.idProduct}>{_}</Link>
                    </div>
                );
            },
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            width: '10vw',
            key: 'price',
            render: (text) => (text === 0 ? 'Contact shop' : text),
        },
        {
            title: 'G.Tính',
            dataIndex: 'gender',
            width: '82px',
            key: 'gender',
            render: (gender) => <>{gender === 0 ? 'Nữ' : gender === 1 ? 'Nam' : 'Unisex'}</>,
        },
        {
            title: 'Thương hiệu',
            dataIndex: 'nameBrand',
            key: 'nameBrand',
        },
        {
            title: 'Loại',
            dataIndex: 'nameCategory',
            key: 'nameCategory',
        },
        {
            title: 'Xử lý',
            key: 'action',
            render: (_, record, ìndex) => (
                <Space size="middle">
                    <Link to={'/admin/update-product/' + record.idProduct}>
                        <a>Sửa</a>
                    </Link>

                    <Popconfirm title="Sure to delete?" onConfirm={() => handleDeleteRow(record.idProduct)}>
                        <a style={{ color: 'red' }}>Xóa</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];
    useEffect(() => {
        axios.get(url + urnProsAdmin).then((res) => {
            setProductsAll(res.data);
            setProducts(res.data);
            setLoading(false);
        });
        axios.get(url + urnBrand).then((res) => {
            setBrands(res.data);
        });
        axios.get(url + urnCate).then((res) => {
            setCates(res.data);
        });
    }, []);
    //product type
    const handleSelectBrand = (value) => {
        setProducts(productsAll.filter((x) => x.idBrand === value));
        setCatesByBrand(cates.filter((x) => x.idBrand === value));
        setSelectedBrand(value);
        setSelectedCate();
    };
    const handleSelectCate = (value) => {
        setProducts(productsAll.filter((x) => x.idCategory === value));
        setSelectedCate(value);
    };
    const handleClearFilter = () => {
        setSelectedBrand();
        setCatesByBrand([]);
        setSelectedCate();
        setProducts(productsAll);
    };
    const handleDeleteRow = (idProduct) => {
        axios.delete(url + urnDeleteProduct(idProduct)).then((res) => {
            axios.get(url + urnProsAdmin).then((res) => {
                setProductsAll(res.data);
                setProducts(res.data);
                setPage((productsAll.length - 1) / 10 < page && (productsAll.length - 1) % 10 === 0 ? page - 1 : page);
            });
        });
    };

    return (
        <div className="wrap-content-admin">
            <Row>
                <Col span={24}>
                    <div className="heading-product-type">
                        <h1>Danh sách sản phẩm</h1>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col span={20}>
                    <div className="select-wapper">
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
                            width="200"
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
                        <Button className="btnClear" type="text" onClick={handleClearFilter}>
                            Bỏ lọc <CloseOutlined />
                        </Button>
                    </div>
                </Col>
                <Col span={4}>
                    <Link to={'/admin/create-product/'}>
                        <Button type="primary" style={{ backgroundColor: '#44bd32' }}>
                            Tạo sản phẩm
                        </Button>
                    </Link>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <div className="table-products">
                        <Table
                            loading={loading}
                            components={components}
                            rowClassName={(record, index) =>
                                index % 2 === 0 ? 'table-row-light editable-row' : 'table-row-dark editable-row'
                            }
                            pagination={{
                                onChange(current) {
                                    setPage(current);
                                },
                                position: ['bottomCenter'],
                                pageSize: 10,
                            }}
                            style={{ minHeight: '100vh' }}
                            columns={columns}
                            dataSource={products}
                        />
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default Product;
