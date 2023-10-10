import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './TableManageUser.scss'
import * as actions from '../../../store/actions';
import { handleChangeStatusUser } from '../../../services/userService';
import MarkdownIt from 'markdown-it';

import moment from 'moment';
import { toast } from 'react-toastify';
import { CommonUtils } from '../../../utils';
// import style manually

// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);

// Finish!
function handleEditorChange({ html, text }) {
    console.log('handleEditorChange', html, text);
}



class TableManageUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userRedux: [],
            errMessage: "",
            dataExport: []
        }
    }

    async componentDidMount() {
        this.props.fetchUserRedux()
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listUsers !== this.props.listUsers) {
            this.setState({
                userRedux: this.props.listUsers,
                dataExport: this.buildDataExport(this.props.listUsers)
            })
        }
    }
    handleDeleteUser = (user) => {
        this.props.deleteAUserRedux(user.id);
    }
    handleEditUser = (user) => {
        this.props.handleEditUserFromParentKey(user)
    }
    handleChangeStatusUser = async (user, type) => {
        try {
            await handleChangeStatusUser({
                id: user.id,
                type: type
            })
            if (type === 'BAN') {
                toast.success(`Vô hiệu hoá tài khoản ${user.email} thành công!`)
                this.props.fetchUserRedux()
            }
            if (type === 'PERMIT') {
                toast.success(`Mở khoá tài khoản ${user.email} thành công!`)
                this.props.fetchUserRedux()
            }
        } catch (error) {
            if (error.response) {
                if (error.response.data) {
                    this.setState({
                        errMessage: error.response.data.message
                    })
                }
            }
            toast.error("Thao tác thất bại! Vui lòng thử lại sau.")
        }
    }
    buildDataExport = (data) => {
        let result = data && data.length > 0 && data.map(item => ({
            Id: item.id,
            Email: item.email,
            Address: item.address,
            Birthday: moment.unix(item.birthday / 1000).format('DD/MM/YYYY'),
            Name: `${item.lastName} ${item.firstName}`,
            PhoneNumber: item.phoneNumber,
            Gender: item.genderData.value,
            Role: item.roleData.value,
            Status: item.statusId === 'S1' ? "Đang hoạt động" : "Vô hiệu hoá"
        }))
        return result
    }
    handleExportExcel = async () => {
        let { dataExport } = this.state
        let nameFile = `ListUser-${new Date().getTime()}`
        await CommonUtils.exportExcel(dataExport, "Danh sách người dùng", nameFile)
    }
    render() {
        let arrUsers = this.state.userRedux
        const { userInfo } = this.props
        console.log("check props: ", this.props);
        return (
            <>
                <div>
                    <button className='btn btn-success btn-lg mb-3'
                        style={{ float: "right", width: "11rem", height: "3rem" }}
                        onClick={() => this.handleExportExcel()}
                    >
                        Xuất
                        &nbsp;
                        <i style={{ fontSize: "18px" }} className="fas fa-file-excel"></i>
                    </button>
                </div>
                <table id='TableManageUser'>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Email</th>
                            <th>Họ và tên</th>
                            <th>Ngày sinh</th>
                            <th>Địa chỉ</th>
                            <th>Vai trò</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {arrUsers && arrUsers.length > 0 &&
                            arrUsers.map((item, index) => {
                                let date = moment.unix(item.birthday / 1000).format('DD/MM/YYYY')
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.email}</td>
                                        <td>{`${item.lastName} ${item.firstName}`}</td>
                                        <td>{date}</td>
                                        <td>{item.address}</td>
                                        <td>{item.roleData.value}</td>
                                        <td>{item.statusId === 'S1' ? "Đang hoạt động" : "Vô hiệu hoá"} </td>
                                        <td>
                                            <div className='btn-manage'
                                                style={item.id === userInfo.id ? { visibility: "hidden", pointerEvents: "none" } : { visibility: "visible" }}
                                            >
                                                <button
                                                    className='btn-edit'
                                                    onClick={() => this.handleEditUser(item)}
                                                ><i className="fas fa-pencil-alt"></i></button>
                                                <button
                                                    className='btn-delete'
                                                    onClick={() => this.handleDeleteUser(item)}
                                                ><i className="fas fa-trash"></i></button>
                                                {item.statusId === 'S1' ?
                                                    <button
                                                        className='btn-change-status'
                                                        onClick={() => this.handleChangeStatusUser(item, "BAN")}
                                                    >
                                                        <i className='fas fa-user-times' title='Vô hiệu hoá tài khoản'></i>
                                                    </button>
                                                    :
                                                    <button
                                                        className='btn-change-status'
                                                        onClick={() => this.handleChangeStatusUser(item, "PERMIT")}
                                                    >
                                                        <i className='fas fa-user-check' title='Mở khoá tài khoản'></i>
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
        listUsers: state.admin.users,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchUserRedux: () => dispatch(actions.fetchAllUserStart()),
        deleteAUserRedux: (id) => dispatch(actions.deleteAUser(id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);
