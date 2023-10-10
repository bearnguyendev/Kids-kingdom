import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { createNewReceiverService, deleteReceiverService, editReceiverService, handleChangeStatusService } from '../../services/userService';
import * as actions from "../../store/actions";
import { emitter } from '../../utils/emitter';
import ReceiverModal from '../Cart/ReceiverModal';
class AddressUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrReceiver: '',
            isChangeAddress: false,
            isOpenModalReceiver: false,
            name: '',
            phoneNumber: '',
            address: '',
            id: ''
        }
    }
    async componentDidMount() {
        this.props.showAvatar()
        window.scrollTo(0, 0)
        let userId = this.props.userId
        if (userId) {
            this.props.fetchAllReceiverByUserId(userId);
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        window.scrollTo(0, 0)
        if (prevProps.receivers !== this.props.receivers) {
            this.setState({
                arrReceiver: this.props.receivers,
            })
        }
    }
    handleChangeStatus = async (id) => {
        await handleChangeStatusService({ id: id })
        let userId = this.props.userId
        if (userId) {
            this.props.fetchAllReceiverByUserId(userId);
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
        let isValid = true
        let arrCheck = ["name", "phoneNumber", "address"]
        for (let i = 0; i < arrCheck.length; i++) {
            if (!this.state[arrCheck[i]]) {
                isValid = false;
                alert('Đây là trường bắt buộc: ' + arrCheck[i])
                break;
            }
        }
        return isValid;
    }
    clickBtnChangeAddress = (item) => {
        this.setState({
            isChangeAddress: !this.state.isChangeAddress,
            name: item.name,
            phoneNumber: item.phoneNumber,
            address: item.address,
            id: item.id
        })
    }
    clickBtnSaveAddress = async (item) => {
        try {
            let isValid = this.checkValidateInput()
            if (isValid === false) {
                return;
            }
            let status = item.status
            let res = await editReceiverService({ ...this.state, status })
            if (res && res.errCode === 0) {
                toast.success(res.errMessage)
                this.setState({
                    isChangeAddress: !this.state.isChangeAddress,
                    name: '',
                    phoneNumber: '',
                    address: '',
                })
                let userId = this.props.userId
                if (userId) {
                    this.props.fetchAllReceiverByUserId(userId);
                }
            } else {
                toast.error(res.errMessage)
            }
        } catch (error) {
            console.log(error);
        }
    }
    handleDeleteReceiver = async (id) => {
        try {
            let res = await deleteReceiverService(id)
            if (res && res.errCode === 0) {
                toast.success(res.errMessage)
                let userId = this.props.userId
                if (userId) {
                    this.props.fetchAllReceiverByUserId(userId);
                }
            } else {
                toast.error(res.errMessage)
            }
        } catch (error) {
            console.log(error);
        }
    }
    toggleReceiverModal = () => {
        this.setState({
            isOpenModalReceiver: !this.state.isOpenModalReceiver
        })
    }
    sendDataFromModalReceiver = async (data) => {
        let userId = this.props.userId
        let res = await createNewReceiverService({
            name: data.name,
            address: data.address,
            email: data.email,
            phoneNumber: data.phoneNumber,
            userId: userId
        })
        if (res && res.errCode === 0) {
            toast.success(res.errMessage)
            this.toggleReceiverModal();
            emitter.emit('EVENT_CLEAR_MODAL_DATA')
            this.props.fetchAllReceiverByUserId(userId);
        } else {
            toast.error(res.errMessage)
        }
    }

    render() {
        let { arrReceiver, name, phoneNumber, address, isChangeAddress, id } = this.state
        return (
            <div className='address-user'>
                <div className='title-content'>
                    <div className='title-1'>
                        <i className="fas fa-map-marker-alt"></i> {' '}
                        <FormattedMessage id={"user.address-title"} />
                    </div>
                </div>
                <div className="add-new-address" onClick={() => this.toggleReceiverModal()}>
                    <span className='receiver' >
                        <i className="fas fa-plus " ></i> {' '}
                        <span><FormattedMessage id={"user.add-address"} /></span>
                    </span>
                </div>
                <div className='address'
                >
                    <>
                        {arrReceiver && arrReceiver.length > 0
                            ? arrReceiver.map((item, index) => {
                                return (
                                    <div className="form-receiver px-3 " key={index}>
                                        <div className='left'>
                                            <div className='name-receiver input-group'>
                                                <span className='title-receiver'>
                                                    <label ><FormattedMessage id={"user.name-receiver"} /></label>
                                                </span>
                                                {isChangeAddress === true && id === item.id ?
                                                    <input type="text" className="form-control col-8"
                                                        value={name}
                                                        onChange={(event) => this.handleOnChangeInput(event, 'name')}
                                                    />
                                                    :
                                                    <>
                                                        <span className='content-receiver'>
                                                            {item.name}
                                                        </span>
                                                        {item.status === 1 &&
                                                            <span className='content-default'><FormattedMessage id={"user.default-1"} /></span>
                                                        }
                                                    </>
                                                }

                                            </div>
                                            <div className='phone-number-receiver input-group '>
                                                <span className='title-receiver'>
                                                    <label><FormattedMessage id={"user.phone-number-receiver"} /></label>
                                                </span>
                                                {isChangeAddress === true && id === item.id ?
                                                    <input type="tel" className="form-control col-8"
                                                        value={phoneNumber}
                                                        onChange={(event) => this.handleOnChangeInput(event, 'phoneNumber')}
                                                    />
                                                    :
                                                    <span className='content-receiver'>{item.phoneNumber}</span>
                                                }
                                            </div>
                                            <div className='address-receiver input-group '>
                                                <span className='title-receiver'>
                                                    <label><FormattedMessage id={"user.address-receiver"} /></label>
                                                </span>
                                                {isChangeAddress === true && id === item.id ?
                                                    <input type="text" className="form-control col-8"
                                                        value={address}
                                                        onChange={(event) => this.handleOnChangeInput(event, 'address')}
                                                    />
                                                    :
                                                    <span className='content-receiver'>{item.address}</span>

                                                }
                                            </div>
                                        </div>
                                        <div className='right'>
                                            {isChangeAddress === true && id === item.id ?
                                                <div onClick={() => this.clickBtnSaveAddress(item)} className="text-change">
                                                    <FormattedMessage id={"user.save"} />
                                                </div>
                                                :
                                                <div onClick={() => this.clickBtnChangeAddress(item)} className="text-change">
                                                    <FormattedMessage id={"user.update"} />
                                                </div>
                                            }
                                            {item.status === 0 &&
                                                <div className="text-default" onClick={() => this.handleChangeStatus(item.id)}>
                                                    <FormattedMessage id={"user.default-receiver"} />
                                                </div>
                                            }
                                            <div className="text-delete" onClick={() => this.handleDeleteReceiver(item.id)}>
                                                <FormattedMessage id={"user.delete-receiver"} />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                            :
                            <div className='text-center'><FormattedMessage id={"user.no-data-address"} /></div>
                        }

                    </>
                </div>
                <ReceiverModal
                    isOpen={this.state.isOpenModalReceiver}
                    toggleFromParent={this.toggleReceiverModal}
                    sendDataFromModalReceiver={this.sendDataFromModalReceiver}
                />
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        receivers: state.admin.receivers,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllReceiverByUserId: (userId) => dispatch(actions.fetchAllReceiverByUserId(userId)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddressUser);
