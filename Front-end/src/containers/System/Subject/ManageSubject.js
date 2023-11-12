import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { CRUD_ACTIONS, requiredField } from '../../../utils';
import * as actions from "../../../store/actions";
import { editAllCodeService, createANewAllCode } from '../../../services/userService';
import TableManageSubject from "./TableManageSubject";
import 'react-image-lightbox/style.css';
import { toast } from 'react-toastify';
class ManageSubject extends Component {

    constructor(props) {
        super(props);
        this.state = {
            subjectArr: [],
            keyMap: '',
            value: '',
            action: '',
            editId: '',
        }
    }
    componentDidMount() {
        this.props.fetchAllcodeSubjects()
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listSubjects !== this.props.listSubjects) {
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
                // fire redux create subject
                let res = await createANewAllCode({
                    type: 'SUBJECT',
                    keyMap: keyMap ? keyMap : new Date().getTime(),
                    value: this.state.value,
                })
                if (res && res.errCode === 0) {
                    toast.success(<FormattedMessage id={"manage-subject.add-subject"} />);
                    this.props.fetchAllcodeSubjects();
                } else {
                    toast.error(res.errMessage)
                }
            }
            if (action === CRUD_ACTIONS.EDIT) {
                // fire redux edit subject
                let res = await editAllCodeService({
                    id: this.state.editId,
                    keyMap: keyMap,
                    value: value,
                })
                if (res && res.errCode === 0) {
                    toast.success(<FormattedMessage id={"manage-subject.up-subject"} />);
                    this.props.fetchAllcodeSubjects();
                } else {
                    toast.error(res.errMessage)
                    this.setState({
                        keyMap: '',
                        value: '',
                        action: CRUD_ACTIONS.CREATE
                    })
                    this.props.fetchAllcodeSubjects();
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
                toast.error(requiredField + arrCheck[i])
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
    handleEditSubjectFromParent = (subject) => {
        this.setState({
            keyMap: subject.keyMap,
            value: subject.value,
            action: CRUD_ACTIONS.EDIT,
            editId: subject.id,
        })
    }
    render() {
        let { keyMap, value } = this.state
        return (
            <div className='manage-subject-container'>
                <div className="title" >
                    <FormattedMessage id={"manage-subject.title"} />
                </div>
                <div className='manage-subject-body'>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-12 my-3' style={{ fontWeight: '600' }}>
                                {this.state.action === CRUD_ACTIONS.EDIT ? <FormattedMessage id={"manage-subject.update"} /> : <FormattedMessage id={"manage-subject.add"} />}
                            </div>
                            <div className='col-6'>
                                <label><FormattedMessage id={"manage-subject.keyMap"} /></label>
                                <input type='text'
                                    className='form-control'
                                    value={keyMap}
                                    onChange={(event) => this.onChangeInput(event, 'keyMap')}
                                    readOnly={this.state.action === CRUD_ACTIONS.EDIT ? true : false}
                                />
                            </div>
                            <div className='col-6'>
                                <label><FormattedMessage id={"manage-subject.value"} /></label>
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
                                    {this.state.action === CRUD_ACTIONS.EDIT ? <FormattedMessage id={"manage-subject.edit"} /> : <FormattedMessage id={"manage-subject.save"} />}
                                </button>
                            </div>
                        </div>
                        <div className="card mb-4">
                            <div className="card-header font-weight-bold">
                                <i className="fas fa-table me-1" />
                                &nbsp;
                                <FormattedMessage id={"manage-subject.list"} />
                            </div>
                            <div className="card-body rounded">
                                <TableManageSubject
                                    handleEditSubjectFromParentKey={this.handleEditSubjectFromParent}
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
        listSubjects: state.admin.subjects
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllcodeSubjects: () => dispatch(actions.fetchAllcodeSubjects())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSubject);
