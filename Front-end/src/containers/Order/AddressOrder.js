import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { createNewReceiverService, handleChangeStatusService } from '../../services/userService';
import * as actions from "../../store/actions";
import { emitter } from '../../utils/emitter';
import ReceiverModal from '../Cart/ReceiverModal';
class AddressOrder extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrReceiver: '',
            isChangeAddress: false,
            receiverId: '',
            key: 0,
            isOpenModalReceiver: false
        }
    }
    async componentDidMount() {
        let userId = this.props.userId
        if (userId) {
            this.props.fetchAllReceiverByUserId(userId);
            let { receivers } = this.props
            this.setState({
                key: receivers && receivers.length > 0 && receivers.findIndex(item => item.status === 1)
            })
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.receivers !== this.props.receivers) {
            let { receivers } = this.props
            this.setState({
                arrReceiver: this.props.receivers,
                key: receivers && receivers.length > 0 && receivers.findIndex(item => item.status === 1),
                receiverId: receivers && receivers.length > 0 && receivers.find(item => item.status === 1).id
            })
        }
        if (prevState.receiverId !== this.state.receiverId) {
            this.props.getReceiverId(this.state.receiverId)
        }
    }

    handleOnChange = async (id, index) => {
        await handleChangeStatusService({ id: id })
        this.setState({
            key: index,
            receiverId: id
        })
    }
    ClickBtnChangeAddress = () => {
        this.setState({
            isChangeAddress: !this.state.isChangeAddress,
        })
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
        let { arrReceiver, isChangeAddress, receiverId, key } = this.state
        return (
            <div className='address-order my-3'>
                <div className='content-up'>
                    <div className='content-left'>
                        <i className="fas fa-map-marker-alt"></i> {' '}
                        <FormattedMessage id={"order.address-title"} />
                    </div>
                    {isChangeAddress === true &&
                        <div className="content-right">
                            <span className='receiver'>
                                <i className="fas fa-plus " ></i> {' '}
                                <span onClick={() => this.toggleReceiverModal()}
                                ><FormattedMessage id={"order.add-address"} /></span>
                            </span>
                            {' '}
                            <span className='receiver'><FormattedMessage id={"order.setting-address"} /></span>
                        </div>
                    }
                </div>
                <div className={isChangeAddress === true ? 'address active-change' : 'address'}
                >
                    {isChangeAddress === false ?
                        <>
                            {arrReceiver && arrReceiver.length > 0
                                &&
                                <>
                                    <div className='left'>
                                        <span>
                                            {arrReceiver[key].name} ({arrReceiver[key].phoneNumber})
                                        </span>
                                    </div>
                                    <div className='center'>
                                        {arrReceiver[key].address}
                                    </div>
                                </>
                            }
                        </>
                        :
                        <>
                            {arrReceiver && arrReceiver.length > 0
                                && arrReceiver.map((item, index) => {
                                    return (
                                        <div key={index} className="form-check" >
                                            <input className="form-check-input" checked={item.id === receiverId ? true : false} onChange={() => this.handleOnChange(item.id, index)} type="radio" name="addressRadios" id={`addressRadios${index}`} />
                                            <label className="form-check-label wrap-radio-address" htmlFor={`addressRadios${index}`}>
                                                <div className="left">
                                                    {key === index &&
                                                        <span style={{ color: '#999' }}>(<FormattedMessage id={"order.default"} />) </span>
                                                    }
                                                    <span>{item.name} ({item.phoneNumber})</span>
                                                </div>
                                                <div className="center">
                                                    {item.address}
                                                </div>
                                            </label>
                                        </div>
                                    )
                                })
                            }
                        </>
                    }
                    <div className='right'>
                        {isChangeAddress === false &&
                            <>
                                <span className="text-default"><FormattedMessage id={"order.default"} /></span>
                                <span onClick={() => this.ClickBtnChangeAddress()} className="text-change px-3">
                                    <FormattedMessage id={"order.change"} />
                                </span>
                            </>
                        }
                    </div>
                </div>
                {isChangeAddress === true &&
                    <div className="box-action">
                        <div onClick={() => this.ClickBtnChangeAddress()} className="wrap-back">
                            <button >
                                <FormattedMessage id={"order.back"} />
                            </button>
                        </div>
                    </div>
                }
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

export default connect(mapStateToProps, mapDispatchToProps)(AddressOrder);
