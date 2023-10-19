import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as actions from "../../../store/actions";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { CommonUtils, CRUD_ACTIONS } from '../../../utils';
import { withRouter } from 'react-router';
import Lightbox from 'react-image-lightbox';
import { emitter } from "../../../utils/emitter"
import { createNewProductImageService, deleteProductImageService, editProductImageService } from '../../../services/userService';
import ModalImage from './ModalImage';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
class ProductImage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: '',
            image: '',
            previewImgURL: '',
            arrProductImage: '',
            isOpen: false,
            action: '',
            isOpenModalImage: false,
            id: '',
            errMessage: ""
        }
    }
    componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let productId = this.props.match.params.id;
            this.props.fetchProductImageRedux(productId);
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listProductImage !== this.props.listProductImage) {
            this.setState({
                arrProductImage: this.props.listProductImage
            })
        }
    }
    handleOnChangeInput = (event, id) => {
        let valueInput = event.target.value
        let copyState = { ...this.state }
        copyState[id] = valueInput
        this.setState({
            ...copyState
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
    openPreviewImage = (item) => {

        this.setState({
            isOpen: true,
            id: item.id
        })
    }
    handleEditProductImage = (item) => {
        if (item.image) {
            this.setState({
                id: item.id,
                previewImgURL: item.image,
                image: item.image,
                title: item.title,
                action: CRUD_ACTIONS.EDIT
            })
        }
    }
    handleDeleteProductImage = async (item) => {
        try {
            let res = await deleteProductImageService(item.id);
            if (res && res.errCode === 0) {
                if (this.props.match && this.props.match.params && this.props.match.params.id) {
                    let productId = this.props.match.params.id;
                    this.props.fetchProductImageRedux(productId);
                }
                toast.success(res.errMessage);
            } else {
                toast.error(res.errMessage);
            }
        } catch (error) {
            if (error.response) {
                if (error.response.data) {
                    this.setState({
                        errMessage: error.response.data.message
                    })
                }
            }
        }
    }
    handleSaveProductImage = async (item) => {
        try {
            if (this.props.match && this.props.match.params && this.props.match.params.id) {
                let productId = +this.props.match.params.id;
                let res = await editProductImageService({ productId, ...this.state });
                if (res && res.errCode === 0) {

                    this.props.fetchProductImageRedux(productId);

                    toast.success(res.errMessage);
                    this.setState({
                        action: CRUD_ACTIONS.READ
                    })
                } else {
                    toast.error(res.errMessage);
                }
            }
        } catch (error) {
            if (error.response) {
                if (error.response.data) {
                    this.setState({
                        errMessage: error.response.data.message
                    })
                }
            }
        }

    }
    createNewImage = async (data) => {
        try {
            if (this.props.match && this.props.match.params && this.props.match.params.id) {
                let productId = this.props.match.params.id;
                let req = { productId, ...data }
                let response = await createNewProductImageService(req)
                if (response && response.errCode !== 0) {
                    alert(response.errMessage)
                } else {
                    this.props.fetchProductImageRedux(productId);
                    this.setState({
                        isOpenModalImage: false
                    })
                    emitter.emit('EVENT_CLEAR_MODAL_DATA')
                }
            }
        } catch (error) {
            if (error.response) {
                if (error.response.data) {
                    this.setState({
                        errMessage: error.response.data.message
                    })
                }
            }
        }

    }
    handleAddNewImage = () => {
        this.setState({
            isOpenModalImage: true
        })
    }
    toggleImageModal = () => {
        this.setState({
            isOpenModalImage: !this.state.isOpenModalImage
        })
    }
    render() {
        let { arrProductImage, action, previewImgURL, id, image, title } = this.state
        return (
            <>
                <div className='container pt-5'>
                    <ModalImage
                        isOpen={this.state.isOpenModalImage}
                        toggleFromParent={this.toggleImageModal}
                        createNewImage={this.createNewImage}
                    />
                    <div className='row'>
                        <button className='btn btn-info my-3 px-3'
                            onClick={() => this.handleAddNewImage()}
                        >
                            <i className="fas fa-plus"></i> <FormattedMessage id={"product-image.add"} />
                        </button>
                        <table className="table table-hover table-bordered">
                            <thead>
                                <tr className="table-primary">
                                    <th className='col-1' scope="col">STT</th>
                                    <th className='col-4' scope="col"><FormattedMessage id={"product-image.nameImg"} /></th>
                                    <th className='col-4' scope="col"><FormattedMessage id={"product-image.img"} /></th>
                                    <th className='col-3' scope="col"><FormattedMessage id={"product-image.action"} /></th>
                                </tr>
                            </thead>
                            <tbody>
                                {arrProductImage && arrProductImage.length > 0 &&
                                    arrProductImage.map((item, index) => {
                                        return (
                                            <>
                                                <tr key={index}>
                                                    <th scope="row">{index + 1}</th>
                                                    <td>{action === CRUD_ACTIONS.EDIT && id === item.id ?
                                                        <input className="form-control"
                                                            onChange={(event) => { this.handleOnChangeInput(event, "title") }}
                                                            value={title}
                                                        />
                                                        :
                                                        item.title
                                                    }
                                                    </td>
                                                    <td>
                                                        <div className='preview-img-container'>
                                                            {action === CRUD_ACTIONS.EDIT && id === item.id ?
                                                                <>
                                                                    <input id='previewImg' type='file' hidden
                                                                        onChange={(event) => this.handleOnChangeImage(event)} />
                                                                    <label htmlFor='previewImg' className='label-upload'>
                                                                        <FormattedMessage id={"product-image.upload-img"} /> <i className='fas fa-upload'></i>
                                                                    </label>
                                                                    <div className='preview-image'
                                                                        style={{ backgroundImage: `url(${previewImgURL})` }}
                                                                        onClick={() => this.openPreviewImage(item)}
                                                                    >
                                                                    </div>
                                                                </>
                                                                :
                                                                <div className='preview-image'
                                                                    style={{ backgroundImage: `url(${item.image})` }}
                                                                    onClick={() => this.openPreviewImage(item)}
                                                                >
                                                                </div>
                                                            }
                                                        </div></td>
                                                    <td>
                                                        <div className='btn-table-product-image' style={{
                                                            display: "flex",
                                                            justifyContent: "space-evenly"
                                                        }}>
                                                            {action === CRUD_ACTIONS.EDIT && id === item.id ?
                                                                <button type="button" className="btn btn-warning px-2"
                                                                    onClick={() => this.handleSaveProductImage()}>
                                                                    <FormattedMessage id={"product-image.save"} />
                                                                </button>
                                                                :
                                                                <button type="button" className="btn btn-primary px-2 text-center"
                                                                    onClick={() => this.handleEditProductImage(item)}>
                                                                    <FormattedMessage id={"product-image.edit"} />
                                                                </button>
                                                            }
                                                            {/* &emsp;&emsp;&emsp;&emsp; */}
                                                            <button type="button" className="btn btn-danger px-2"
                                                                onClick={() => this.handleDeleteProductImage(item)}>
                                                                <FormattedMessage id={"product-image.delete"} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                {this.state.isOpen === true && id === item.id &&
                                                    <Lightbox
                                                        mainSrc={item.image}
                                                        onCloseRequest={() => this.setState({ isOpen: false })}
                                                    />
                                                }
                                            </>

                                        )
                                    })
                                }
                            </tbody>
                        </table>
                        {arrProductImage <= 0 &&
                            <div className='text-center'>
                                <FormattedMessage id={"product-image.no-data"} />
                            </div>
                        }
                    </div>
                    <div className='text-center mt-3'>
                        <Link to={"/admin/manage-product"} style={{ textDecoration: "none" }}><FormattedMessage id={"product-image.back"} /></Link>
                    </div>
                </div>
            </>
        );
    }

}

const mapStateToProps = state => {
    return {
        listProductImage: state.admin.productImage
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchProductImageRedux: (productId) => dispatch(actions.fetchAllProductImageFromProduct(productId)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductImage));
