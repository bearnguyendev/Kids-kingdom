import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { emitter } from '../../utils/emitter';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import * as actions from "../../store/actions";
import { CommonUtils } from '../../utils';
class ReceiverModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            address: '',
            phoneNumber: '',
            isActionUpdate: false
        }
        this.listenToEmitter();
    }
    listenToEmitter() {
        emitter.on('EVENT_CLEAR_MODAL_DATA', () => {
            //reset state
            this.setState({
                name: '',
                address: '',
                phoneNumber: '',
                isActionUpdate: false
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
        let arrInput = ['name', 'address', 'phoneNumber'];
        for (let i = 0; i < arrInput.length; i++) {
            if (!this.state[arrInput[i]]) {
                isValid = false;
                alert('Đây là trường bắt buộc: ' + arrInput[i])
                break;
            }
        }
        return isValid;
    }
    sendDataFromModalReceiver = () => {
        let isValid = this.checkValidateInput()
        if (isValid === true) {
            this.props.sendDataFromModalReceiver(this.state)
        }
    }
    render() {
        return (
            <Modal
                isOpen={this.props.isOpen}
                toggle={() => { this.toggle() }}
                className={'modal-receiver-container'}
                size="md"
                centered
            >
                <ModalHeader toggle={() => { this.toggle() }}>
                    <FormattedMessage id={"receiver.add"} />
                </ModalHeader>
                <ModalBody>
                    <div className='modal-receiver-body'>
                        <div className='row'>
                            <div className='col-6'>
                                <label style={{ fontWeight: '600' }}>
                                    <FormattedMessage id={"receiver.name"} /></label>
                                <div className='input-group'>
                                    <input type='text' className='form-control'
                                        onChange={(event) => this.handleOnChangeInput(event, "name")}
                                        value={this.state.name} />
                                </div>
                            </div>
                            <div className='col-6'>
                                <label style={{ fontWeight: '600' }}>
                                    <FormattedMessage id={"receiver.phoneNumber"} /></label>
                                <div className='input-group'>
                                    <input type='tel' className='form-control'
                                        onChange={(event) => this.handleOnChangeInput(event, "phoneNumber")}
                                        value={this.state.phoneNumber} />
                                </div>
                            </div>
                            <div className='col-12'>
                                <label style={{ fontWeight: '600' }}>
                                    <FormattedMessage id={"receiver.address"} /></label>
                                <div className='input-group'>
                                    <input type='text' className='form-control'
                                        onChange={(event) => this.handleOnChangeInput(event, "address")}
                                        value={this.state.address} />
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="info" className='px-3' onClick={() => { this.sendDataFromModalReceiver() }}>
                        <FormattedMessage id={"receiver.save"} />
                    </Button>{' '}
                    <Button color="secondary" className='px-3' onClick={() => { this.toggle() }}>
                        <FormattedMessage id={"receiver.close"} />
                    </Button>
                </ModalFooter>
            </Modal>
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(ReceiverModal);
