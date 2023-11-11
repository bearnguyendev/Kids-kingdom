import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { CRUD_ACTIONS } from '../../../utils';
import * as actions from "../../../store/actions";
import { editAllCodeService, createANewAllCode } from '../../../services/userService';
import TableManageBrand from "./TableManageBrand";
import 'react-image-lightbox/style.css';
import { toast } from 'react-toastify';
class ManageBrand extends Component {

    constructor(props) {
        super(props);
        this.state = {
            brandArr: [],
            keyMap: '',
            value: '',
            action: '',
            editId: '',
        }
    }
    componentDidMount() {
        this.props.fetchAllcodeBrands()
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listBrands !== this.props.listBrands) {
            this.setState({
                keyMap: '',
                value: '',
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
            let { action, keyMap, value } = this.state
            if (action === CRUD_ACTIONS.CREATE) {
                // fire redux create brand
                let res = await createANewAllCode({
                    type: 'BRAND',
                    keyMap: keyMap ? keyMap : new Date().getTime(),
                    value: this.state.value,
                })
                if (res && res.errCode === 0) {
                    toast.success(<FormattedMessage id={"manage-brand.add-brand"} />);
                    this.props.fetchAllcodeBrands();
                } else {
                    toast.error(res.errMessage)
                }
            }
            if (action === CRUD_ACTIONS.EDIT) {
                // fire redux edit brand
                let res = await editAllCodeService({
                    id: this.state.editId,
                    keyMap: keyMap,
                    value: value,
                })
                if (res && res.errCode === 0) {
                    toast.success(<FormattedMessage id={"manage-brand.up-brand"} />);
                    this.props.fetchAllcodeBrands();
                } else {
                    toast.error(res.errMessage)
                    this.setState({
                        keyMap: '',
                        value: '',
                        action: CRUD_ACTIONS.CREATE
                    })
                    this.props.fetchAllcodeBrands()
                }
            }
        } catch (error) {
            toast.error(<FormattedMessage id={"error"} />)
        }
    }
    checkValidateInput = () => {
        let isValid = true
        let arrCheck = ["value"]
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
    handleEditBrandFromParent = (brand) => {
        this.setState({
            keyMap: brand.keyMap,
            value: brand.value,
            action: CRUD_ACTIONS.EDIT,
            editId: brand.id,
        })
    }
    render() {
        let { keyMap, value } = this.state
        return (
            <div className='manage-brand-container'>
                <div className="title" >
                    <FormattedMessage id={"manage-brand.title"} />
                </div>
                <div className='manage-brand-body'>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-12 my-3' style={{ fontWeight: '600' }}>
                                {this.state.action === CRUD_ACTIONS.EDIT ? <FormattedMessage id={"manage-brand.update"} /> : <FormattedMessage id={"manage-brand.add"} />}
                            </div>
                            <div className='col-6'>
                                <label><FormattedMessage id={"manage-brand.keyMap"} /></label>
                                <input type='text'
                                    className='form-control'
                                    value={keyMap}
                                    onChange={(event) => this.onChangeInput(event, 'keyMap')}
                                    readOnly={this.state.action === CRUD_ACTIONS.EDIT ? true : false}
                                />
                            </div>
                            <div className='col-6'>
                                <label><FormattedMessage id={"manage-brand.value"} /></label>
                                <input type='text'
                                    className='form-control'
                                    value={value}
                                    onChange={(event) => this.onChangeInput(event, 'value')}
                                />
                            </div>
                            <div className='col-12 my-3'>
                                <button
                                    className={this.state.action === CRUD_ACTIONS.EDIT ? 'btn btn-warning px-3' : 'btn btn-primary px-3'}
                                    onClick={() => this.handleSaveUser()}
                                >
                                    {this.state.action === CRUD_ACTIONS.EDIT ? <FormattedMessage id={"manage-brand.edit"} /> : <FormattedMessage id={"manage-brand.save"} />}
                                </button>
                            </div>
                        </div>
                        <div className="card mb-4">
                            <div className="card-header font-weight-bold">
                                <i className="fas fa-table me-1" />
                                &nbsp;
                                <FormattedMessage id={"manage-brand.list"} />
                            </div>
                            <div className="card-body rounded">
                                <TableManageBrand
                                    handleEditBrandFromParentKey={this.handleEditBrandFromParent}
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
        listBrands: state.admin.brands
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllcodeBrands: () => dispatch(actions.fetchAllcodeBrands())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageBrand);
