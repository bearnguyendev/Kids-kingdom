import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { CRUD_ACTIONS } from '../../../utils';
import * as actions from "../../../store/actions";
import { editTypeShipService, createNewTypeShipService } from '../../../services/userService';
import TableManageTypeShip from "./TableManageTypeShip";
import 'react-image-lightbox/style.css';
import { toast } from 'react-toastify';
class ManageTypeShip extends Component {

    constructor(props) {
        super(props);
        this.state = {
            type: '',
            price: '',
            action: '',
            editId: '',
        }
    }
    componentDidMount() {
        this.props.fetchAllTypeShips()
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listTypeShips !== this.props.listTypeShips) {
            this.setState({
                type: '',
                price: '',
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
            let { action, type, price } = this.state
            if (action === CRUD_ACTIONS.CREATE) {
                // fire redux create typeShip
                let res = await createNewTypeShipService({
                    type: type,
                    price: price,
                })
                if (res && res.errCode === 0) {
                    toast.success("Thêm phương thức vận chuyển thành công!");
                    this.props.fetchAllTypeShips();
                } else {
                    toast.error(res.errMessage)
                }
            }
            if (action === CRUD_ACTIONS.EDIT) {
                // fire redux edit typeShip
                let res = await editTypeShipService({
                    id: this.state.editId,
                    type: type,
                    price: price,
                })
                if (res && res.errCode === 0) {
                    toast.success("Chỉnh sửa phương thức vận chuyển thành công!");
                    this.props.fetchAllTypeShips();
                } else {
                    toast.error(res.errMessage)
                }
            }
        } catch (error) {
            toast.error("Thao tác thất bại! Vui lòng thử lại sau.")
        }
    }
    checkValidateInput = () => {
        let isValid = true
        let arrCheck = ["price", "type"]
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
    handleEditTypeShipFromParent = (typeShip) => {
        this.setState({
            type: typeShip.type,
            price: typeShip.price,
            action: CRUD_ACTIONS.EDIT,
            editId: typeShip.id,
        })
    }
    render() {
        let { type, price } = this.state
        return (
            <div className='manage-type-ship-container'>
                <div className="title" >
                    <FormattedMessage id={"manage-type-ship.title"} />
                </div>
                <div className='manage-type-ship-body'>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-12 my-3' style={{ fontWeight: '600' }}>
                                {this.state.action === CRUD_ACTIONS.EDIT ? <FormattedMessage id={"manage-type-ship.update"} /> : <FormattedMessage id={"manage-type-ship.add"} />}
                            </div>
                            <div className='col-6'>
                                <label><FormattedMessage id={"manage-type-ship.type"} /></label>
                                <input type='text'
                                    className='form-control'
                                    value={type}
                                    onChange={(event) => this.onChangeInput(event, 'type')}
                                />
                            </div>
                            <div className='col-6'>
                                <label><FormattedMessage id={"manage-type-ship.price"} /></label>
                                <div className="input-group ">
                                    <input type="text" class="form-control"
                                        aria-label="Amount (to the nearest dollar)"
                                        value={price}
                                        onChange={(event) => this.onChangeInput(event, 'price')} />
                                    <div className="input-group-append">
                                        <span className="input-group-text">VND</span>
                                    </div>
                                </div>
                            </div>

                            <div className='col-12 my-3'>
                                <button
                                    className={this.state.action === CRUD_ACTIONS.EDIT ? 'btn btn-warning px-3' : 'btn btn-primary px-3'}
                                    onClick={() => this.handleSaveUser()}
                                >
                                    {this.state.action === CRUD_ACTIONS.EDIT ? <FormattedMessage id={"manage-type-ship.edit"} /> : <FormattedMessage id={"manage-type-ship.save"} />}
                                </button>
                            </div>
                        </div>
                        <div className="card mb-4">
                            <div className="card-header font-weight-bold">
                                <i className="fas fa-table me-1" />
                                &nbsp;
                                <FormattedMessage id={"manage-type-ship.list"} />
                            </div>
                            <div className="card-body rounded">
                                <TableManageTypeShip
                                    handleEditTypeShipFromParentKey={this.handleEditTypeShipFromParent}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        listTypeShips: state.admin.typeShips
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllTypeShips: () => dispatch(actions.fetchAllTypeShips())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageTypeShip);
