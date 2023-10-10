import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { CommonUtils, CRUD_ACTIONS } from '../../../utils';
import * as actions from "../../../store/actions";
import { createNewBlogService, editBlogService } from '../../../services/userService';
import TableManageBlog from "./TableManageBlog";
import 'react-image-lightbox/style.css';
import { toast } from 'react-toastify';
import Lightbox from 'react-image-lightbox';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
const mdParser = new MarkdownIt(/* Markdown-it options */);
class ManageBlog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: '',
            image: '',
            previewImgURL: '',
            shortDes: '',
            contentMarkdown: '',
            contentHTML: '',
            action: '',
            id: '',
            subjectId: '',
            arrSubject: '',
            isOpen: false,
            errMessage: ""
        }
    }
    componentDidMount() {
        this.props.fetchAllBlogs({
            statusId: "ALL",
            subjectId: "ALL",
            valueSearch: "ALL"
        });
        this.props.fetchAllcodeSubjects()
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listBlogs !== this.props.listBlogs) {
            let subjectArr = this.props.listSubject
            this.setState({
                title: '',
                image: '',
                shortDes: '',
                previewImgURL: '',
                contentMarkdown: '',
                contentHTML: '',
                subjectId: subjectArr && subjectArr.length > 0 ? subjectArr[0].keyMap : '',
                action: CRUD_ACTIONS.CREATE
            })
        }
        if (prevProps.listSubject !== this.props.listSubject) {
            let subjectArr = this.props.listSubject
            this.setState({
                arrSubject: subjectArr,
                subjectId: subjectArr && subjectArr.length > 0 ? subjectArr[0].keyMap : ''
            })
        }
    }
    handleSaveUser = async () => {
        try {
            let isValid = this.checkValidateInput()
            if (isValid === false) {
                return;
            }
            let { action } = this.state
            if (action === CRUD_ACTIONS.CREATE) {
                let res = await createNewBlogService(this.state)
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
            }
            if (action === CRUD_ACTIONS.EDIT) {
                let res = await editBlogService(this.state)
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
    checkValidateInput = () => {
        let isValid = true
        let arrCheck = ["image", "title", "shortDes", "contentMarkdown", "contentHTML"]
        for (let i = 0; i < arrCheck.length; i++) {
            if (!this.state[arrCheck[i]]) {
                isValid = false;
                alert('Đây là trường bắt buộc: ' + arrCheck[i])
                break;
            }
        }
        return isValid;
    }
    onChangeInput = (event, id) => {
        let copyState = { ...this.state }
        copyState[id] = event.target.value
        this.setState({
            ...copyState
        })
    }
    handleEditBlogFromParent = (blog) => {
        this.setState({
            title: blog.title,
            image: blog.image,
            subjectId: blog.subjectId,
            previewImgURL: blog.image,
            shortDes: blog.shortDes,
            contentMarkdown: blog.contentMarkdown,
            contentHTML: blog.contentHTML,
            action: CRUD_ACTIONS.EDIT,
            id: blog.id,
        })
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
    openPreviewImage = () => {
        if (!this.state.previewImgURL) {
            return;
        }
        this.setState({
            isOpen: true
        })
    }
    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkdown: text,
            contentHTML: html,
        })
    }
    render() {
        let { title, shortDes, previewImgURL, isOpen, subjectId, arrSubject } = this.state
        return (
            <div className='manage-blog-container'>
                <div className="title" >
                    <FormattedMessage id={"manage-blog.title-manage"} />
                </div>
                <div className='manage-blog-body'>
                    <div className='container'>

                        <div className='row'>
                            <div className='col-12 my-3' style={{ fontWeight: '600' }}>
                                {this.state.action === CRUD_ACTIONS.EDIT ? <FormattedMessage id={"manage-blog.update"} /> : <FormattedMessage id={"manage-blog.add"} />}
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id={"manage-blog.title"} /></label>
                                <input type='text'
                                    className='form-control'
                                    value={title}
                                    onChange={(event) => this.onChangeInput(event, 'title')}
                                />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id={"manage-blog.subjectId"} /></label>
                                <select className="form-control"
                                    onChange={(event) => this.onChangeInput(event, 'subjectId')}
                                    value={subjectId}
                                >
                                    {arrSubject && arrSubject.length > 0 &&
                                        arrSubject.map((item, index) => {
                                            return (
                                                <option key={index} value={item.keyMap}>{item.value}</option>
                                            )
                                        })}
                                </select>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id={"manage-blog.image"} /></label>
                                <div className='preview-img-container'>
                                    <input id='previewImg' type='file' hidden
                                        onChange={(event) => this.handleOnChangeImage(event)} />
                                    <label htmlFor='previewImg' className='label-upload'>
                                        <FormattedMessage id={"manage-user.upload"} /> <i className='fas fa-upload'></i>
                                    </label>
                                    <div className='preview-image rounded'
                                        style={{ backgroundImage: `url(${previewImgURL})` }}
                                        onClick={() => this.openPreviewImage()}
                                    >
                                    </div>
                                </div>
                            </div>
                            <div className='col-12'>
                                <label><FormattedMessage id={"manage-blog.shortDes"} /></label>
                                <textarea
                                    className='form-control'
                                    onChange={(event) => this.onChangeInput(event, 'shortDes')}
                                    value={shortDes}
                                ></textarea>
                            </div>
                            <div className='col-12 my-2'>
                                <label><FormattedMessage id={"manage-blog.content"} /></label>
                                <MdEditor style={{ height: '300px' }} renderHTML={text => mdParser.render(text)} onChange={this.handleEditorChange} value={this.state.contentMarkdown} />
                            </div>

                            <div className='col-12 my-3'>
                                <button
                                    className={this.state.action === CRUD_ACTIONS.EDIT ? 'btn btn-warning px-3' : 'btn btn-primary px-3'}
                                    onClick={() => this.handleSaveUser()}
                                >
                                    {this.state.action === CRUD_ACTIONS.EDIT ? <FormattedMessage id={"manage-blog.edit"} /> : <FormattedMessage id={"manage-blog.save"} />}
                                </button>
                            </div>

                        </div>
                        <div className="card mb-4">
                            <div className="card-header font-weight-bold">
                                <i className="fas fa-table me-1" />
                                &nbsp;
                                <FormattedMessage id={"manage-blog.list"} />
                            </div>
                            <div className="card-body rounded">
                                <TableManageBlog
                                    handleEditBlogFromParentKey={this.handleEditBlogFromParent}
                                />
                            </div>
                        </div>
                        {
                            isOpen === true &&
                            <Lightbox
                                mainSrc={previewImgURL}
                                onCloseRequest={() => this.setState({ isOpen: false })}
                            />
                        }
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        listBlogs: state.admin.blogs,
        listSubject: state.admin.subjects
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllBlogs: (data) => dispatch(actions.fetchAllBlogs(data)),
        fetchAllcodeSubjects: () => dispatch(actions.fetchAllcodeSubjects())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageBlog);
