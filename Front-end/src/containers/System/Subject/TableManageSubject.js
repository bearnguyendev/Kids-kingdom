import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './TableManageSubject.scss'
import * as actions from '../../../store/actions';
import { deleteAllCodeService } from '../../../services/userService';
import { toast } from 'react-toastify';

class TableManageSubject extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrSubjects: [],
        }
    }

    async componentDidMount() {
        this.props.fetchAllcodeSubjects()
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listSubjects !== this.props.listSubjects) {
            this.setState({
                arrSubjects: this.props.listSubjects
            })
        }
    }
    handleDeleteSubject = async (id) => {
        try {
            let res = await deleteAllCodeService(id);
            if (res && res.errCode === 0) {
                toast.success(res.errMessage);
                this.props.fetchAllcodeSubjects();
            } else {
                toast.error(res.errMessage)
            }
        } catch (error) {
            toast.error("Thao tác thất bại! Vui lòng thử lại sau.")
        }

    }
    handleEditSubject = (subject) => {
        this.props.handleEditSubjectFromParentKey(subject)
    }
    render() {
        let { arrSubjects } = this.state
        return (
            <>
                <table id='TableManageSubject'>
                    <tbody>
                        <tr>
                            <th>STT</th>
                            <th>Mã chủ đề</th>
                            <th>Tên chủ đề</th>
                            <th>Hành động</th>
                        </tr>
                        {arrSubjects && arrSubjects.length > 0 &&
                            arrSubjects.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.keyMap}</td>
                                        <td>{item.value}</td>
                                        <td>
                                            <div className='btn-table-manage-subject'>
                                                <button
                                                    className='btn-edit'
                                                    onClick={() => this.handleEditSubject(item)}
                                                    title="Chỉnh sửa"
                                                ><i className="fas fa-pencil-alt"></i></button>
                                                <button
                                                    className='btn-delete'
                                                    onClick={() => this.handleDeleteSubject(item.id)}
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
        listSubjects: state.admin.subjects
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllcodeSubjects: () => dispatch(actions.fetchAllcodeSubjects())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageSubject);
