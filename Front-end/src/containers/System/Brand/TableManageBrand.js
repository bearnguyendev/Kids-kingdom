import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './TableManageBrand.scss'
import * as actions from '../../../store/actions';
import { deleteAllCodeService, handleChangeStatusAllcode } from '../../../services/userService';
import { toast } from 'react-toastify';


class TableManageBrand extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrBrands: [],
        }
    }

    async componentDidMount() {
        this.props.fetchAllcodeBrands()
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listBrands !== this.props.listBrands) {
            this.setState({
                arrBrands: this.props.listBrands
            })
        }
    }
    handleDeleteBrand = async (id) => {
        try {
            let data = {
                id: id,
                type: "BRAND"
            }
            let res = await deleteAllCodeService(data);
            if (res && res.errCode === 0) {
                toast.success(res.errMessage);
                this.props.fetchAllcodeBrands();
            } else {
                toast.error(res.errMessage)
            }
        } catch (error) {
            toast.error(<FormattedMessage id={"error"} />)
        }

    }
    handleEditBrand = (brand) => {
        this.props.handleEditBrandFromParentKey(brand)
    }
    handleChangeStatus = async (brand, type) => {
        try {
            await handleChangeStatusAllcode({
                id: brand.id,
                type: type
            })
            if (type === 'BAN') {
                toast.success(`Ẩn thương hiệu ${brand.value} thành công!`)
                this.props.fetchAllcodeBrands();
            }
            if (type === 'PERMIT') {
                toast.success(`Hiện thương hiệu ${brand.value} thành công!`)
                this.props.fetchAllcodeBrands();
            }
        } catch (error) {
            if (error.response) {
                if (error.response.data) {
                    this.setState({
                        errMessage: error.response.data.message
                    })
                }
            }
            toast.error(<FormattedMessage id={"error"} />)
        }
    }
    render() {
        let { arrBrands } = this.state
        return (
            <>
                <table id='TableManageBrand'>
                    <tbody>
                        <tr>
                            <th>STT</th>
                            <th>Mã thương hiệu</th>
                            <th>Tên thương hiệu</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                        {arrBrands && arrBrands.length > 0 &&
                            arrBrands.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.keyMap}</td>
                                        <td>{item.value}</td>
                                        <td>{item.status === 0 ? "Hiện" : "Ẩn"}</td>
                                        <td>
                                            <div className='btn-table-manage-brand'>
                                                <button
                                                    className='btn-edit'
                                                    onClick={() => this.handleEditBrand(item)}
                                                    title="Chỉnh sửa"
                                                ><i className="fas fa-pencil-alt"></i></button>
                                                <button
                                                    className='btn-delete'
                                                    onClick={() => this.handleDeleteBrand(item.id)}
                                                    title="Xoá"
                                                ><i className="fas fa-trash"></i></button>
                                                {item.status === 0 ?
                                                    <button
                                                        className='btn-change-status-blog'
                                                        onClick={() => this.handleChangeStatus(item, "BAN")}
                                                    >
                                                        <i className='far fa-eye-slash' title='Ẩn thương hiệu'></i>
                                                    </button>
                                                    :
                                                    <button
                                                        className='btn-change-status-blog'
                                                        onClick={() => this.handleChangeStatus(item, "PERMIT")}
                                                    >
                                                        <i className='far fa-eye' title='Hiện thương hiệu'></i>
                                                    </button>
                                                }
                                            </div>

                                        </td>
                                    </tr>
                                )
                            })}
                    </tbody>
                </table>
            </>
        );
    }

}

const mapStateToProps = state => {
    return {
        listBrands: state.admin.brands
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllcodeBrands: () => dispatch(actions.fetchAllcodeBrands())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageBrand);
