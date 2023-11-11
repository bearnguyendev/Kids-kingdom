import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { CRUD_ACTIONS } from '../../../utils';
import * as actions from "../../../store/actions";
import { editAllCodeService, createANewAllCode } from '../../../services/userService';
import TableManageCategory from "./TableManageCategory";
import 'react-image-lightbox/style.css';
import { toast } from 'react-toastify';
class ManageCategory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            categoryArr: [],
            keyMap: '',
            value: '',
            action: '',
            editId: '',
        }
    }
    componentDidMount() {
        this.props.fetchAllcodeCategory()
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listCategory !== this.props.listCategory) {
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
                // fire redux create category
                let res = await createANewAllCode({
                    type: 'CATEGORY',
                    keyMap: keyMap ? keyMap : new Date().getTime(),
                    value: this.state.value,
                })
                if (res && res.errCode === 0) {
                    toast.success(<FormattedMessage id={"manage-category.add-category"} />);
                    this.props.fetchAllcodeCategory();
                } else {
                    toast.error(res.errMessage)
                }
            }
            if (action === CRUD_ACTIONS.EDIT) {
                // fire redux edit category
                let res = await editAllCodeService({
                    id: this.state.editId,
                    keyMap: keyMap,
                    value: value,
                })
                if (res && res.errCode === 0) {
                    toast.success(<FormattedMessage id={"manage-category.up-category"} />);
                    this.props.fetchAllcodeCategory();
                } else {
                    toast.error(res.errMessage)
                    this.setState({
                        keyMap: '',
                        value: '',
                        action: CRUD_ACTIONS.CREATE
                    })
                    this.props.fetchAllcodeCategory();
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
    handleEditCategoryFromParent = (category) => {
        this.setState({
            keyMap: category.keyMap,
            value: category.value,
            action: CRUD_ACTIONS.EDIT,
            editId: category.id,
        })
    }
    render() {
        let { keyMap, value } = this.state;
        return (
            <div className='manage-category-container'>
                <div className="title" >
                    <FormattedMessage id={"manage-category.title"} />
                </div>
                <div className='manage-category-body'>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-12 my-3' style={{ fontWeight: '600' }}>
                                {this.state.action === CRUD_ACTIONS.EDIT ? <FormattedMessage id={"manage-category.update"} /> : <FormattedMessage id={"manage-category.add"} />}
                            </div>
                            <div className='col-6'>
                                <label><FormattedMessage id={"manage-category.keyMap"} /></label>
                                <input type='text'
                                    className='form-control'
                                    value={keyMap}
                                    onChange={(event) => this.onChangeInput(event, 'keyMap')}
                                    readOnly={this.state.action === CRUD_ACTIONS.EDIT ? true : false}
                                />
                            </div>
                            <div className='col-6'>
                                <label><FormattedMessage id={"manage-category.value"} /></label>
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
                                    {this.state.action === CRUD_ACTIONS.EDIT ? <FormattedMessage id={"manage-category.edit"} /> : <FormattedMessage id={"manage-category.save"} />}
                                </button>
                            </div>
                        </div>
                        <div className="card mb-4">
                            <div className="card-header font-weight-bold">
                                <i className="fas fa-table me-1" />
                                &nbsp;
                                <FormattedMessage id={"manage-category.list"} />
                            </div>
                            <div className="card-body rounded">
                                <TableManageCategory
                                    handleEditCategoryFromParentKey={this.handleEditCategoryFromParent}
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
        listCategory: state.admin.category
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllcodeCategory: () => dispatch(actions.fetchAllcodeCategory())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageCategory);
