import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { emitter } from '../../../utils/emitter';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import "./ModalImage.scss"
import Lightbox from 'react-image-lightbox';
import { CommonUtils } from '../../../utils';
import { toast } from 'react-toastify';
class ModalImage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: '',
            image: '',
            previewImgURL: '',
            isOpenPreview: false,
        }
        this.listenToEmitter();
    }
    listenToEmitter() {
        emitter.on('EVENT_CLEAR_MODAL_DATA', () => {
            //reset state
            this.setState({
                title: '',
                image: '',
                previewImgURL: '',
            })
        })
    }

    componentDidMount() {
    }

    toggle = () => {
        this.props.toggleFromParent()
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
        let arrInput = ['title', 'image'];
        for (let i = 0; i < arrInput.length; i++) {
            if (!this.state[arrInput[i]]) {
                isValid = false;
                toast.error('Đây là trường bắt buộc: ' + arrInput[i])
                break;
            }
        }
        return isValid;
    }
    handleAddNewImage = () => {
        let isValid = this.checkValidateInput()
        if (isValid === true) {
            this.props.createNewImage(this.state)
        }
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
        let { previewImgURL, isOpenPreview } = this.state;
        return (
            <Modal
                isOpen={this.props.isOpen}
                toggle={() => { this.toggle() }}
                className={'modal-image-container'}
                size="md"
            >
                <ModalHeader toggle={() => { this.toggle() }}>
                    <FormattedMessage id={"product-image.add"} />
                </ModalHeader>
                <ModalBody>
                    <div className='modal-image-body'>
                        <div className='row'>
                            <div className='col-6'>
                                <label style={{ fontWeight: '600' }}>
                                    <FormattedMessage id={"product-image.nameImg"} /></label>
                                <input type='text' className='input'
                                    onChange={(event) => this.handleOnChangeInput(event, "title")}
                                    value={this.state.title} />
                            </div>
                            <div className='col-6'>
                                <label style={{ fontWeight: '600' }}>
                                    <FormattedMessage id={"product-image.img"} />
                                </label>
                                <div className='preview-img-container'>
                                    <input id='previewImg' type='file' hidden
                                        onChange={(event) => this.handleOnChangeImage(event)} />
                                    <label htmlFor='previewImg' className='label-upload'>
                                        <FormattedMessage id={"product-image.upload-img"} />
                                        <i className='fas fa-upload'></i>
                                    </label>
                                    <div className='preview-image rounded'
                                        style={{ backgroundImage: `url(${previewImgURL})` }}
                                        onClick={() => this.openPreviewImage()}
                                    >
                                    </div>
                                </div>
                            </div>
                        </div>
                        {
                            isOpenPreview === true &&
                            <Lightbox
                                mainSrc={previewImgURL}
                                onCloseRequest={() => this.setState({ isOpenPreview: false })}
                            />
                        }
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" className='px-3' onClick={() => { this.handleAddNewImage() }}>
                        <FormattedMessage id={"product-image.save"} />
                    </Button>{' '}
                    <Button color="secondary" className='px-3' onClick={() => { this.toggle() }}>
                        <FormattedMessage id={"product-image.close"} />
                    </Button>
                </ModalFooter>
            </Modal>
        )
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalImage);




