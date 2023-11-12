import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { emitter } from '../../utils/emitter';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import "./ReviewOrderUser.scss"
import { CommonUtils, requiredField } from '../../utils';
import HomeFooter from '../HomePage/HomeFooter';
import HomeNav from '../HomePage/HomeNav';
import * as actions from "../../store/actions";
import Select from "react-select";
import Lightbox from 'react-image-lightbox';
import { toast } from 'react-toastify';
import { createNewCommentService } from '../../services/userService';
class CommentModalUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeStar: '',
            image: '',
            content: '',
            isOpenPreview: false,
            previewImgSendComment: '',
            selectedProduct: '',
            dataProduct: '',
            productId: ''
        }
        this.listenToEmitter();
    }
    listenToEmitter() {
        emitter.on('EVENT_CLEAR_MODAL_DATA', () => {
            //reset state
            this.setState({
                activeStar: '',
                previewImgSendComment: '',
                image: '',
                content: '',
            })
        })
    }

    componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let orderId = this.props.match.params.id
            this.props.fetchDetailOrderById(orderId)
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.dataOrderRedux !== this.props.dataOrderRedux) {
            let data = this.buildDataInputSelect(this.props.dataOrderRedux.OrderDetailData && this.props.dataOrderRedux.OrderDetailData)
            this.setState({
                dataProduct: data,
            })
        }
    }

    buildDataInputSelect = (inputData) => {
        let result = []
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};
                object.label = item.name
                object.value = item.id;
                result.push(object)
            })
        }
        return result;
    }
    handleChangeSelect = (selectedOption, name) => {
        let stateName = name.name;
        let stateCopy = { ...this.state }
        stateCopy[stateName] = selectedOption;
        this.setState({
            ...stateCopy,
            productId: selectedOption.value
        })
    }

    handleChooseStart = (number) => {
        let copyState = this.state;
        copyState.activeStar = number
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
            let copyState = this.state
            copyState.previewImgSendComment = objectUrl
            copyState.image = base64
            console.log("check copyStarte: ", copyState);
            this.setState({
                ...copyState
            })
        }
    }
    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        })
    }
    checkValidateInput = () => {
        let isValid = true;
        let arrInput = ['content', 'image'];
        for (let i = 0; i < arrInput.length; i++) {
            if (!this.state[arrInput[i]]) {
                isValid = false;
                toast.error(requiredField + arrInput[i])
                break;
            }
        }
        return isValid;
    }
    openPreviewImage = () => {
        if (!this.state.previewImgSendComment) {
            return;
        }
        this.setState({
            isOpenPreview: true
        })
    }
    createNewComment = async (data) => {
        try {
            let isValid = this.checkValidateInput()
            if (isValid === true) {
                let userId = this.props.match && this.props.match.params && this.props.match.params.userId
                let { productId, content, activeStar: star, selectedProduct } = this.state

                let response = await createNewCommentService({
                    productId,
                    content,
                    userId,
                    star,
                    nameProduct: selectedProduct.label
                })
                if (response && response.errCode !== 0) {
                    toast.error(response.errMessage)
                } else {
                    emitter.emit('EVENT_CLEAR_MODAL_DATA')
                    toast.success(`Đánh giá sản phẩm ${selectedProduct.label} thành công!`)
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
    render() {
        let { isOpenPreview, content, activeStar, previewImgSendComment, selectedProduct, dataProduct, image } = this.state;
        console.log("check state: ", this.state);
        return (
            <>
                <HomeNav />
                <div className='col-12 font-weight-bold text-uppercase text-center text-primary text-lg'>
                    <FormattedMessage id={"order.write-cmt"} />
                </div>
                <div className='review-container'>
                    <Select
                        value={selectedProduct}
                        onChange={this.handleChangeSelect}
                        options={dataProduct}
                        name={'selectedProduct'}
                        placeholder='Chọn sản phẩm trong đơn hàng vừa chọn...'
                        className="select-product"
                    />
                    <div className='review_item'>
                        <div className='my-3'>Nhập nội dung đánh giá</div>
                        <textarea name="content" value={content}
                            onChange={(event) => this.handleOnChangeInput(event, 'content')} rows="3"
                            className="form-control"></textarea>
                        <div className="content-review">
                            <div className="content-left">
                                <label style={{ marginBottom: '0', cursor: 'pointer' }} htmlFor="cmtImg"><i className="fas fa-camera" ></i></label>
                                <input type="file" id="cmtImg"
                                    hidden onChange={(event) => this.handleOnChangeImage(event)}
                                />
                                <div className={activeStar === 1 ? 'box-star active' : 'box-star'} onClick={() => this.handleChooseStart(1)}><i className="fa fa-star" /></div>
                                <div className={activeStar === 2 ? 'box-star active' : 'box-star'} onClick={() => this.handleChooseStart(2)} ><i className="fa fa-star" /><i className="fa fa-star" /></div>
                                <div className={activeStar === 3 ? 'box-star active' : 'box-star'} onClick={() => this.handleChooseStart(3)}><i className="fa fa-star" /><i className="fa fa-star" /><i className="fa fa-star" /></div>
                                <div className={activeStar === 4 ? 'box-star active' : 'box-star'} onClick={() => this.handleChooseStart(4)}><i className="fa fa-star" /><i className="fa fa-star" /><i className="fa fa-star" /><i className="fa fa-star" /></div>
                                <div className={activeStar === 5 ? 'box-star active' : 'box-star'} onClick={() => this.handleChooseStart(5)}><i className="fa fa-star" /><i className="fa fa-star" /><i className="fa fa-star" /><i className="fa fa-star" /><i className="fa fa-star" /></div>
                            </div>
                            <div className="content-right">
                                <button onClick={() => this.createNewComment()} className="btn btn-primary px-3">Gửi đánh giá</button>
                            </div>
                        </div>
                        <div style={{ backgroundImage: `url(${previewImgSendComment})` }} className="preview-cmt-img"
                            onClick={() => this.openPreviewImage()}
                        >
                        </div>
                    </div>
                    {isOpenPreview === true &&
                        <Lightbox
                            mainSrc={image}
                            onCloseRequest={() => this.setState({ isOpenPreview: false })}
                        />
                    }
                </div>

                <HomeFooter />
            </>

        )
    }



}

const mapStateToProps = state => {
    return {
        dataOrderRedux: state.admin.orderById
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchDetailOrderById: (id) => dispatch(actions.fetchDetailOrderById(id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CommentModalUser);




