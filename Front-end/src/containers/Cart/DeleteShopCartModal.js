import React, { Component } from 'react';
import { Modal, ModalHeader, ModalFooter, ModalBody, Button } from 'reactstrap';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useParams
} from "react-router-dom";
import * as actions from "../../store/actions";
import { connect } from 'react-redux';


class DeleteShopCartModal extends Component {

    handleCloseModal = () => {
        this.props.closeModal()
    }
    handleDelete = () => {
        this.props.handleDeleteShopCart()
    }
    render() {
        return (
            <div className="">
                <Modal isOpen={this.props.isOpenModal} className={'booking-modal-container'}
                    size="md" centered
                >
                    <div className="modal-header">
                        <h5 className="modal-title">Bạn chắc chắn muốn xoá sản phẩm này?</h5>
                        <button onClick={this.handleCloseModal} type="button" className="btn btn-time" aria-label="Close">X</button>
                    </div>
                    <ModalBody>
                        <div style={{ padding: '10px 20px', fontSize: '20px' }} className="row">
                            {this.props.name}
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="info"
                            onClick={this.handleDelete}
                            className='px-3'
                        >
                            Thực hiện
                        </Button>
                        {' '}
                        <Button onClick={this.handleCloseModal} className='px-3'>
                            Hủy
                        </Button>
                    </ModalFooter>
                </Modal>

            </div >
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

export default connect(mapStateToProps, mapDispatchToProps)(DeleteShopCartModal);