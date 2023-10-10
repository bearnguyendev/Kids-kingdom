import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './TableManageBrand.scss'
import * as actions from '../../../store/actions';
import { deleteAllCodeService } from '../../../services/userService';
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
            let res = await deleteAllCodeService(id);
            if (res && res.errCode === 0) {
                toast.success(res.errMessage);
                this.props.fetchAllcodeBrands();
            } else {
                toast.error(res.errMessage)
            }
        } catch (error) {
            toast.error("Thao tác thất bại! Vui lòng thử lại sau.")
        }

    }
    handleEditBrand = (brand) => {
        this.props.handleEditBrandFromParentKey(brand)
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
                            <th>Hành động</th>
                        </tr>
                        {arrBrands && arrBrands.length > 0 &&
                            arrBrands.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.keyMap}</td>
                                        <td>{item.value}</td>
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
