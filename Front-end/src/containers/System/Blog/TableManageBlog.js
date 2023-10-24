import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './TableManageBlog.scss'
import * as actions from '../../../store/actions';
import { toast } from 'react-toastify';
import { deleteBlogService, handleChangeStatusBlog } from '../../../services/userService';
import Lightbox from 'react-image-lightbox';
import { CommonUtils } from '../../../utils';


class TableManageBlog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrBlogs: [],
            isOpen: false,
            errMessage: ""
        }
    }

    async componentDidMount() {
        this.props.fetchAllBlogs({
            statusId: "ALL",
            subjectId: "ALL",
            valueSearch: "ALL"
        });
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listBlogs !== this.props.listBlogs) {
            this.setState({
                arrBlogs: this.props.listBlogs
            })
        }
    }
    handleDeleteBlog = async (id) => {
        try {
            let res = await deleteBlogService(id);
            if (res && res.errCode === 0) {
                toast.success(res.errMessage);
                this.props.fetchAllBlogs({
                    statusId: "ALL",
                    subjectId: "ALL",
                    valueSearch: "ALL"
                });
            } else {
                toast.error(res.errMessage)
            }
        } catch (error) {
            toast.error("Thao tác thất bại! Vui lòng thử lại sau.")
            if (error.response) {
                if (error.response.data) {
                    this.setState({
                        errMessage: error.response.data.message
                    })
                }
            }
        }

    }
    handleEditBlog = (blog) => {
        this.props.handleEditBlogFromParentKey(blog)
    }
    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file)
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewImgURL: objectUrl,
                image: base64
            })
        }
    }
    openPreviewImage = (item) => {

        this.setState({
            isOpen: true,
        })
    }
    handleChangeStatusBlog = async (blog, type) => {
        try {
            await handleChangeStatusBlog({
                id: blog.id,
                type: type
            })
            if (type === 'BAN') {
                toast.success(`Ẩn bài đăng ${blog.title} thành công!`)
                this.props.fetchAllBlogs({
                    statusId: "ALL",
                    subjectId: "ALL",
                    valueSearch: "ALL"
                });
            }
            if (type === 'PERMIT') {
                toast.success(`Hiện bài đăng ${blog.title} thành công!`)
                this.props.fetchAllBlogs({
                    statusId: "ALL",
                    subjectId: "ALL",
                    valueSearch: "ALL"
                });
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
    render() {
        let { arrBlogs, isOpen } = this.state
        return (
            <>
                <table id='TableManageBlog'>
                    <thead>
                        <tr>
                            <th className='col-0.5'>STT</th>
                            <th className='col-3'><FormattedMessage id={"manage-blog.title"} /></th>
                            <th className='col-3'><FormattedMessage id={"manage-blog.subjectId"} /></th>
                            <th className='col-2.5'><FormattedMessage id={"manage-blog.image"} /></th>
                            <th className='col-1'><FormattedMessage id={"manage-blog.status"} /></th>
                            <th className='col-2'><FormattedMessage id={"manage-blog.action"} /></th>
                        </tr>
                    </thead>
                    <tbody>
                        {arrBlogs && arrBlogs.length > 0 &&
                            arrBlogs.map((item, index) => {
                                return (
                                    <>
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.title}</td>
                                            <td>{item.subjectData.value}</td>
                                            <td><div className='preview-img-container'>
                                                <div className='preview-image'
                                                    style={{ backgroundImage: `url(${item.image})` }}
                                                    onClick={() => this.openPreviewImage(item)}
                                                >
                                                </div>
                                            </div>
                                            </td>
                                            <td>{item.statusId === 'S1' ? "Hiện" : "Ẩn"} </td>
                                            <td>
                                                <div className='btn-table-manage-blog'>
                                                    <button
                                                        className='btn-edit'
                                                        onClick={() => this.handleEditBlog(item)}
                                                        title="Chỉnh sửa"
                                                    ><i className="fas fa-pencil-alt"></i></button>
                                                    <button
                                                        className='btn-delete'
                                                        onClick={() => this.handleDeleteBlog(item.id)}
                                                        title="Xoá"
                                                    ><i className="fas fa-trash"></i></button>
                                                    {item.statusId === 'S1' ?
                                                        <button
                                                            className='btn-change-status-blog'
                                                            onClick={() => this.handleChangeStatusBlog(item, "BAN")}
                                                        >
                                                            <i className='far fa-eye-slash' title='Ẩn bài đăng'></i>
                                                        </button>
                                                        :
                                                        <button
                                                            className='btn-change-status-blog'
                                                            onClick={() => this.handleChangeStatusBlog(item, "PERMIT")}
                                                        >
                                                            <i className='far fa-eye' title='Hiện bài đăng'></i>
                                                        </button>
                                                    }
                                                </div>

                                            </td>
                                        </tr>
                                        {isOpen === true &&
                                            <Lightbox
                                                mainSrc={item.image}
                                                onCloseRequest={() => this.setState({ isOpen: false })}
                                            />
                                        }
                                    </>
                                )
                            })}
                    </tbody>
                </table>
                {arrBlogs <= 0 &&
                    <div className='text-center mt-3'><FormattedMessage id={"manage-blog.no-data"} /></div>
                }
            </>
        );
    }

}

const mapStateToProps = state => {
    return {
        listBlogs: state.admin.blogs
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllBlogs: (data) => dispatch(actions.fetchAllBlogs(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageBlog);
