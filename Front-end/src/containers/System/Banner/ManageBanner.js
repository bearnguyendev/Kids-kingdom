import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { CommonUtils, CRUD_ACTIONS } from '../../../utils';
import * as actions from "../../../store/actions";
import { createNewBannerService, editBannerService } from '../../../services/userService';
import TableManageBanner from "./TableManageBanner";
import 'react-image-lightbox/style.css';
import { toast } from 'react-toastify';
import Lightbox from 'react-image-lightbox';
class ManageBanner extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bannerArr: [],
            name: '',
            image: '',
            previewImgURL: '',
            description: '',
            action: '',
            editId: '',
            isOpen: false,
            errMessage: ""
        }
    }
    componentDidMount() {
        this.props.fetchAllBanners()
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listBanners !== this.props.listBanners) {
            this.setState({
                name: '',
                image: '',
                description: '',
                previewImgURL: '',
                action: CRUD_ACTIONS.CREATE
            })
        }
    }
    handleSaveUser = async () => {
        try {
            let isValid = this.checkValidateInput()
            if (isValid === false) {
                return;
            }
            let { action, name, image, description } = this.state
            if (action === CRUD_ACTIONS.CREATE) {
                let res = await createNewBannerService({
                    name: name,
                    image: image,
                    description: description
                })
                if (res && res.errCode === 0) {
                    toast.success(res.errMessage);
                    this.props.fetchAllBanners();
                } else {
                    toast.error(<FormattedMessage id={"manage-banner.fail-add"} />)
                }
            }
            if (action === CRUD_ACTIONS.EDIT) {
                let res = await editBannerService({
                    id: this.state.editId,
                    name: name,
                    image: image,
                    description: description
                })
                if (res && res.errCode === 0) {
                    toast.success(res.errMessage);
                    this.props.fetchAllBanners();
                } else {
                    toast.error(res.errMessage)
                    this.setState({
                        name: '',
                        image: '',
                        description: '',
                        previewImgURL: '',
                        action: CRUD_ACTIONS.CREATE
                    })
                    this.props.fetchAllBanners();
                }
            }
        } catch (error) {
            toast.error(<FormattedMessage id={"error"} />)
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
        let arrCheck = ["image", "name", "description"]
        for (let i = 0; i < arrCheck.length; i++) {
            if (!this.state[arrCheck[i]]) {
                isValid = false;
                toast.error(<FormattedMessage id={"required-field"} /> + arrCheck[i])
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
    handleEditBannerFromParent = (banner) => {
        this.setState({
            name: banner.name,
            image: banner.image,
            previewImgURL: banner.image,
            description: banner.description,
            action: CRUD_ACTIONS.EDIT,
            editId: banner.id,
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
    render() {
        let { name, image, description, previewImgURL, isOpen } = this.state
        return (
            <div className='manage-banner-container'>

                <div className="title" >
                    <FormattedMessage id={"manage-banner.title"} />
                </div>
                <div className='manage-banner-body'>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-12 my-3' style={{ fontWeight: '600' }}>
                                {this.state.action === CRUD_ACTIONS.EDIT ? <FormattedMessage id={"manage-banner.update"} /> : <FormattedMessage id={"manage-banner.add"} />}
                            </div>
                            <div className='col-6'>
                                <label><FormattedMessage id={"manage-banner.name"} /></label>
                                <input type='text'
                                    className='form-control'
                                    value={name}
                                    onChange={(event) => this.onChangeInput(event, 'name')}
                                />
                            </div>
                            <div className='col-6'>
                                <label><FormattedMessage id={"manage-banner.image"} /></label>
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
                                <label><FormattedMessage id={"manage-banner.description"} /></label>
                                <textarea
                                    rows={4}
                                    className='form-control'
                                    onChange={(event) => this.onChangeInput(event, 'description')}
                                    value={description}
                                ></textarea>
                            </div>


                            <div className='col-12 my-3'>
                                <button
                                    className={this.state.action === CRUD_ACTIONS.EDIT ? 'btn btn-warning px-3' : 'btn btn-primary px-3'}
                                    onClick={() => this.handleSaveUser()}
                                >
                                    {this.state.action === CRUD_ACTIONS.EDIT ? <FormattedMessage id={"manage-banner.edit"} /> : <FormattedMessage id={"manage-banner.save"} />}
                                </button>
                            </div>
                        </div>
                        <div className="card mb-4">
                            <div className="card-header font-weight-bold">
                                <i className="fas fa-table me-1" />
                                &nbsp;
                                <FormattedMessage id={"manage-banner.list"} />
                            </div>
                            <div className="card-body rounded">
                                <TableManageBanner
                                    handleEditBannerFromParentKey={this.handleEditBannerFromParent}
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
        listBanners: state.admin.banners
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllBanners: () => dispatch(actions.fetchAllBanners())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageBanner);
