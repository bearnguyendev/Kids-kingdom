import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './TableManageCategory.scss'
import * as actions from '../../../store/actions';
import { deleteAllCodeService, handleChangeStatusAllcode } from '../../../services/userService';
import { toast } from 'react-toastify';


class TableManageCategory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrCategory: [],
        }
    }

    async componentDidMount() {
        this.props.fetchAllcodeCategory()
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listCategory !== this.props.listCategory) {
            this.setState({
                arrCategory: this.props.listCategory
            })
        }
    }
    handleDeleteUser = async (id) => {
        try {
            let data = {
                id: id,
                type: "CATEGORY"
            }
            let res = await deleteAllCodeService(data);
            if (res && res.errCode === 0) {
                toast.success(res.errMessage);
                this.props.fetchAllcodeCategory();
            } else {
                toast.error(res.errMessage)
            }
        } catch (error) {
            toast.error(<FormattedMessage id={"error"} />)
        }

    }
    handleEditUser = (category) => {
        this.props.handleEditCategoryFromParentKey(category)
    }
    handleChangeStatus = async (category, type) => {
        try {
            await handleChangeStatusAllcode({
                id: category.id,
                type: type
            })
            if (type === 'BAN') {
                toast.success(`Ẩn danh mục ${category.value} thành công!`)
                this.props.fetchAllcodeCategory();
            }
            if (type === 'PERMIT') {
                toast.success(`Hiện danh mục ${category.value} thành công!`)
                this.props.fetchAllcodeCategory();
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
        let { arrCategory } = this.state
        return (
            <>
                <table id='TableManageCategory'>
                    <tbody>
                        <tr>
                            <th>STT</th>
                            <th>Mã danh mục</th>
                            <th>Tên danh mục</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                        {arrCategory && arrCategory.length > 0 &&
                            arrCategory.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.keyMap}</td>
                                        <td>{item.value}</td>
                                        <td>{item.status === 0 ? "Hiện" : "Ẩn"}</td>
                                        <td>
                                            <div className='btn-table-manage-category'>
                                                <button
                                                    className='btn-edit'
                                                    onClick={() => this.handleEditUser(item)}
                                                    title="Chỉnh sửa"
                                                ><i className="fas fa-pencil-alt"></i></button>
                                                <button
                                                    className='btn-delete'
                                                    onClick={() => this.handleDeleteUser(item.id)}
                                                    title="Xoá"
                                                ><i className="fas fa-trash"></i></button>
                                                {item.status === 0 ?
                                                    <button
                                                        className='btn-change-status-blog'
                                                        onClick={() => this.handleChangeStatus(item, "BAN")}
                                                    >
                                                        <i className='far fa-eye-slash' title='Ẩn mã'></i>
                                                    </button>
                                                    :
                                                    <button
                                                        className='btn-change-status-blog'
                                                        onClick={() => this.handleChangeStatus(item, "PERMIT")}
                                                    >
                                                        <i className='far fa-eye' title='Hiện mã'></i>
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
        listCategory: state.admin.category
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllcodeCategory: () => dispatch(actions.fetchAllcodeCategory())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageCategory);
