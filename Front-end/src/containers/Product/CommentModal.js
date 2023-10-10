import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as actions from "../../store/actions";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { emitter } from '../../utils/emitter';
class CommentModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            content: ''
        }
        this.listenToEmitter();
    }
    listenToEmitter() {
        emitter.on('EVENT_CLEAR_MODAL_DATA', () => {
            //reset state
            this.setState({
                content: ''
            })
        })
    }
    componentDidMount() {
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
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
    sendDataFromModalComment = () => {
        if (this.state.content) {
            this.props.sendDataFromModalComment(this.state.content)
        }
    }
    render() {
        return (
            <Modal
                isOpen={this.props.isOpen}
                toggle={() => { this.toggle() }}
                className={'modal-comment-container'}
                size="md"
                centered
            >
                <ModalHeader toggle={() => { this.toggle() }}>
                    <FormattedMessage id={"comment.reply-comment"} />
                </ModalHeader>
                <ModalBody>
                    <div className='modal-comment-body'>
                        <div className='row'>
                            <div className='col-12'>
                                <label style={{ fontWeight: '600' }}>
                                    <FormattedMessage id={"comment.content"} /></label>
                                <div className='input-group'>
                                    <textarea type='text' className='form-control'
                                        onChange={(event) => this.handleOnChangeInput(event, "content")}
                                        value={this.state.content} />
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="info" className='px-3' onClick={() => { this.sendDataFromModalComment() }}>
                        <FormattedMessage id={"comment.save"} />
                    </Button>{' '}
                    <Button color="secondary" className='px-3' onClick={() => { this.toggle() }}>
                        <FormattedMessage id={"comment.close"} />
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

export default connect(mapStateToProps, mapDispatchToProps)(CommentModal);
