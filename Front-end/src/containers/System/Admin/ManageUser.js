import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { CRUD_ACTIONS, CommonUtils } from '../../../utils';
import "./ManageUser.scss";
import * as actions from "../../../store/actions";
import TableManageUser from "./TableManageUser";
import DatePicker from "../../../components/Input/DatePicker";
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import localization from 'moment/locale/vi'
import moment from 'moment';
import { toast } from 'react-toastify';
class ManageUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            roleArr: [],
            previewImgURL: '',
            isOpen: false,

            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            genderId: '',
            roleId: '',
            image: '',
            birthday: '',
            oldBirthday: '',
            isChangeDate: false,
            action: '',
            userEditId: '',
        }
    }
    componentDidMount() {
        window.scrollTo(0, 0);
        this.props.fetchAllcodeRoles();
        this.props.fetchAllcodeGenders();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        window.scrollTo(0, 0);
        if (prevProps.genderRedux !== this.props.genderRedux) {
            let arrGenders = this.props.genderRedux
            this.setState({
                genderArr: arrGenders,
                genderId: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : ''
            })
        }
        if (prevProps.roleRedux !== this.props.roleRedux) {
            let arrRoles = this.props.roleRedux
            this.setState({
                roleArr: arrRoles,
                roleId: arrRoles && arrRoles.length > 0 ? arrRoles[1].keyMap : ''
            })
        }
        if (prevProps.listUsers !== this.props.listUsers) {
            let arrGenders = this.props.genderRedux
            let arrRoles = this.props.roleRedux
            this.setState({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                address: '',
                genderId: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : '',
                birthday: '',
                roleId: arrRoles && arrRoles.length > 0 ? arrRoles[1].keyMap : '',
                image: '',
                previewImgURL: '',
                isChangeDate: false,
                action: CRUD_ACTIONS.CREATE
            })
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
    handleOnChangeDatePicker = (date) => {
        this.setState({
            birthday: date[0],
            isChangeDate: true
        })
    }
    handleSaveUser = () => {
        let isValid = this.checkValidateInput()
        if (isValid === false) {
            return;
        }
        let { action, isChangeDate, oldBirthday } = this.state
        let date = new Date(this.state.birthday).getTime()
        if (action === CRUD_ACTIONS.CREATE) {
            // fire redux create user
            this.props.createNewUser({
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                birthday: date,
                phoneNumber: this.state.phoneNumber,
                genderId: this.state.genderId,
                roleId: this.state.roleId,
                image: this.state.image,
                ActiveEmail: 0
            })
        }
        if (action === CRUD_ACTIONS.EDIT) {
            // fire redux edit user
            this.props.editAUserRedux({
                id: this.state.userEditId,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                birthday: isChangeDate === false ? oldBirthday : date,
                phoneNumber: this.state.phoneNumber,
                genderId: this.state.genderId,
                roleId: this.state.roleId,
                image: this.state.image,
            })
        }
    }
    checkValidateInput = () => {
        let isValid = true
        let arrCheck = ["email", "password", "firstName", "lastName",
            "phoneNumber", "address"]
        for (let i = 0; i < arrCheck.length; i++) {
            if (!this.state[arrCheck[i]]) {
                isValid = false;
                toast.error('Đây là trường bắt buộc: ' + arrCheck[i])
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
    handleEditUserFromParent = (user) => {
        let imageBase64 = '';
        if (user.image) {
            imageBase64 = new Buffer.from(user.image, 'base64').toString('binary');
        }
        let date = moment.unix(user.birthday / 1000).format('DD/MM/YYYY')
        this.setState({
            email: user.email,
            password: 'hardcode',
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            address: user.address,
            genderId: user.genderId,
            roleId: user.roleId,
            birthday: date,
            oldBirthday: user.birthday,
            image: '',
            previewImgURL: imageBase64,
            action: CRUD_ACTIONS.EDIT,
            userEditId: user.id,
        })
        //this.clickBtnMove("add-edit-user")
    }
    // clickBtnMove = (id) => {
    //     document.getElementById(id).scrollIntoView();
    // }

    render() {
        let genders = this.state.genderArr;
        let roles = this.state.roleArr;
        let { email, password, firstName, lastName,
            phoneNumber, address, genderId, roleId } = this.state
        console.log("check state: ", this.state);
        return (
            <div className='manage-user-container'>

                <div className='manage-user-body'>
                    <div className='container'>
                        <div className="card mb-4 mt-3">
                            <div className="card-header">
                                <div className="title mb-2" >
                                    <FormattedMessage id={"manage-user.list"} />
                                </div>
                            </div>
                            <div className="card-body rounded">
                                <TableManageUser
                                    handleEditUserFromParentKey={this.handleEditUserFromParent}
                                />
                            </div>
                        </div>
                        <div className="card mb-4">
                            <div className="card-header">
                                <div className="title" >
                                    {this.state.action === CRUD_ACTIONS.EDIT ? <FormattedMessage id={"manage-user.update"} /> : <FormattedMessage id={"manage-user.add"} />}
                                </div>
                            </div>
                            <div className="card-body rounded">
                                <div className='row'>
                                    <div className='col-3'>
                                        <label><FormattedMessage id={"manage-user.email"} /></label>
                                        <input type='email'
                                            className='form-control'
                                            value={email}
                                            onChange={(event) => this.onChangeInput(event, 'email')}
                                            disabled={this.state.action === CRUD_ACTIONS.EDIT ? true : false}
                                        />
                                    </div>
                                    <div className='col-3'>
                                        <label><FormattedMessage id={"manage-user.password"} /></label>
                                        <input type='password'
                                            className='form-control'
                                            value={password}
                                            onChange={(event) => this.onChangeInput(event, 'password')}
                                            disabled={this.state.action === CRUD_ACTIONS.EDIT ? true : false}
                                        />
                                    </div>
                                    <div className='col-3'>
                                        <label><FormattedMessage id={"manage-user.last-name"} /></label>
                                        <input type='text' className='form-control'
                                            value={lastName}
                                            onChange={(event) => this.onChangeInput(event, 'lastName')}
                                        />
                                    </div>
                                    <div className='col-3'>
                                        <label><FormattedMessage id={"manage-user.first-name"} /></label>
                                        <input type='text'
                                            className='form-control'
                                            value={firstName}
                                            onChange={(event) => this.onChangeInput(event, 'firstName')}
                                        />
                                    </div>
                                    <div className='col-3'>
                                        <label><FormattedMessage id={"manage-user.phone-number"} /></label>
                                        <input type='tel' className='form-control'
                                            value={phoneNumber}
                                            onChange={(event) => this.onChangeInput(event, 'phoneNumber')}
                                        />
                                    </div>
                                    <div className='col-9'>
                                        <label><FormattedMessage id={"manage-user.address"} /></label>
                                        <input type='text' className='form-control'
                                            value={address}
                                            onChange={(event) => this.onChangeInput(event, 'address')}
                                        />
                                    </div>
                                    <div className='col-3'>
                                        <label><FormattedMessage id={"manage-user.gender"} /></label>
                                        <select className="form-control"
                                            onChange={(event) => this.onChangeInput(event, 'genderId')}
                                            value={genderId}
                                        >
                                            {genders && genders.length > 0 &&
                                                genders.map((item, index) => {
                                                    return (
                                                        <option key={index} value={item.keyMap}>{item.value}</option>
                                                    )
                                                })}
                                        </select>
                                    </div>
                                    <div className='col-3'>
                                        <label><FormattedMessage id={"manage-user.birthday"} /></label>
                                        <DatePicker
                                            className='form-control'
                                            onChange={this.handleOnChangeDatePicker}
                                            value={this.state.birthday}
                                            maxDate={new Date()}
                                        />
                                    </div>
                                    <div className='col-3'>
                                        <label><FormattedMessage id={"manage-user.role"} /></label>
                                        <select className="form-control"
                                            onChange={(event) => this.onChangeInput(event, 'roleId')}
                                            value={roleId}
                                        >
                                            {roles && roles.length > 0 &&
                                                roles.map((item, index) => {
                                                    return (
                                                        <option key={index} value={item.keyMap}>{item.value}</option>
                                                    )
                                                })}
                                        </select>
                                    </div>
                                    <div className='col-3'>
                                        <label><FormattedMessage id={"manage-user.image"} /></label>
                                        <div className='preview-img-container'>
                                            <input id='previewImg' type='file' hidden
                                                onChange={(event) => this.handleOnChangeImage(event)} />
                                            <label htmlFor='previewImg' className='label-upload'>
                                                <FormattedMessage id={"manage-user.upload"} />
                                                <i className='fas fa-upload'></i>
                                            </label>
                                            <div className='preview-image'
                                                style={{ backgroundImage: `url(${this.state.previewImgURL})` }}
                                                onClick={() => this.openPreviewImage()}
                                            >
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-12 my-3'>
                                        <button
                                            className={this.state.action === CRUD_ACTIONS.EDIT ? 'btn btn-warning px-3' : 'btn btn-primary px-3'}
                                            onClick={() => this.handleSaveUser()}
                                        >
                                            {this.state.action === CRUD_ACTIONS.EDIT ? <FormattedMessage id={"manage-user.edit"} /> : <FormattedMessage id={"manage-user.save"} />}
                                        </button>
                                    </div>
                                    {/* <div className='col-12 shadow pt-3 mb-5 bg-white rounded'>
                                <div className="title mb-2" >
                                    <FormattedMessage id={"manage-user.list"} />
                                </div>
                                <TableManageUser
                                    handleEditUserFromParentKey={this.handleEditUserFromParent}
                                />
                            </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.isOpen === true &&
                    <Lightbox
                        mainSrc={this.state.previewImgURL}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                    />
                }
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        roleRedux: state.admin.roles,
        genderRedux: state.admin.genders,
        listUsers: state.admin.users,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllcodeRoles: () => dispatch(actions.fetchAllcodeRoles()),
        fetchAllcodeGenders: () => dispatch(actions.fetchAllcodeGenders()),
        createNewUser: (data) => dispatch(actions.createNewUser(data)),
        fetchUserRedux: (data) => dispatch(actions.fetchAllUserStart(data)),
        editAUserRedux: (data) => dispatch(actions.editAUser(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageUser);
