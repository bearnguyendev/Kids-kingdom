import React, { Component } from 'react';
import Lightbox from 'react-image-lightbox';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import * as actions from "../../store/actions";
import "./DetailUserPage.scss";
import DatePicker from "../../components/Input/DatePicker";
import { CommonUtils } from '../../utils';
import moment from 'moment';
import { toast } from 'react-toastify';
class DetailUserPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            previewImgURL: '',
            isOpen: false,
            email: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            genderId: '',
            oldImage: '',
            image: '',
            birthday: '',
            oldBirthday: '',
            isChangeDate: false,
            userEditId: '',
        }
    }
    async componentDidMount() {
        this.props.showAvatar()
        this.props.fetchAllcodeGenders();
        let user = this.props.userInfo
        this.setState({
            userEditId: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            address: user.address,
            genderId: user.genderId,
            oldImage: user.image,
            previewImgURL: user.image,
            birthday: moment.unix(user.birthday / 1000).format('DD/MM/YYYY'),
            oldBirthday: user.birthday,
            isChangeDate: false,
        })

    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        window.scrollTo(0, 0)
        if (prevProps.genderRedux !== this.props.genderRedux) {
            let arrGenders = this.props.genderRedux
            this.setState({
                genderArr: arrGenders,
            })
        }
        if (prevProps.UserInfo !== this.props.UserInfo) {
            let user = this.props.UserInfo
            this.setState({
                userEditId: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
                address: user.address,
                genderId: user.genderId,
                oldImage: user.image,
                previewImgURL: user.image,
                birthday: moment.unix(user.birthday / 1000).format('DD/MM/YYYY'),
                oldBirthday: user.birthday,
                isChangeDate: false,
            })
        }
    }
    handleOnChangeImage = async (event) => {
        console.log("check event: ", event);
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file)
            let objectUrl = URL.createObjectURL(file);
            await this.setState({
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
        let { isChangeDate, oldBirthday, image, oldImage } = this.state
        let date = new Date(this.state.birthday).getTime()
        let roleId = this.props.userInfo.roleId
        let data = {
            id: this.state.userEditId,
            firstName: this.state.firstName,
            email: this.state.email,
            lastName: this.state.lastName,
            address: this.state.address,
            birthday: isChangeDate === false ? oldBirthday : date,
            phoneNumber: this.state.phoneNumber,
            genderId: this.state.genderId,
            roleId: roleId,
            ActiveEmail: this.props.userInfo.ActiveEmail,
            image: image ? image : oldImage,
        }
        this.props.editAUserRedux(data)
        this.props.updateUserInfoRedux(data)
    }
    checkValidateInput = () => {
        let isValid = true
        let arrCheck = ["firstName", "lastName",
            "phoneNumber", "address"]
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
    render() {
        let genders = this.state.genderArr;
        let { email, firstName, lastName,
            phoneNumber, address, genderId } = this.state
        console.log("check ", this.props);
        return (
            <div className='content-detail '>
                <div className='title-content'>
                    <div className='title-1'>
                        <FormattedMessage id={"user.detail"} />
                    </div>
                    <div className='title-2'>
                        <FormattedMessage id={"user.title-detail"} />
                    </div>
                </div>
                <div className='main-content'>
                    <div className='row'>
                        <div className='col-12'>
                            <label><FormattedMessage id={"user.email"} /></label>
                            {/* <input type='email'
                                className='form-control'
                                value={email}
                                disabled={true}
                                readOnly
                            /> */}
                            {this.props.userInfo.ActiveEmail === 1 ?
                                <div className='col'>{email}&nbsp;<i className="fas fa-check icon-active-email" style={{ backgroundColor: "#0ce90c" }}></i></div>
                                :
                                <div className='col'>{email}&nbsp;<i className="fas fa-times icon-active-email" style={{ backgroundColor: "red" }}></i></div>
                            }
                        </div>
                        <div className='col-12'>
                            <label><FormattedMessage id={"user.last-name"} /></label>
                            <input type='text' className='form-control'
                                value={lastName}
                                onChange={(event) => this.onChangeInput(event, 'lastName')}
                            />
                        </div>
                        <div className='col-12'>
                            <label><FormattedMessage id={"user.first-name"} /></label>
                            <input type='text'
                                className='form-control'
                                value={firstName}
                                onChange={(event) => this.onChangeInput(event, 'firstName')}
                            />
                        </div>
                        <div className='col-12'>
                            <label><FormattedMessage id={"user.phone-number"} /></label>
                            <input type='tel' className='form-control'
                                value={phoneNumber}
                                onChange={(event) => this.onChangeInput(event, 'phoneNumber')}
                            />
                        </div>
                        <div className='col-12'>
                            <label><FormattedMessage id={"user.address"} /></label>
                            <input type='text' className='form-control'
                                value={address}
                                onChange={(event) => this.onChangeInput(event, 'address')}
                            />
                        </div>
                        <div className='col-12'>
                            <label><FormattedMessage id={"user.gender"} /></label>
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
                        <div className='col-12'>
                            <label><FormattedMessage id={"user.birthday"} /></label>
                            <DatePicker
                                className='form-control'
                                onChange={this.handleOnChangeDatePicker}
                                value={this.state.birthday}
                                maxDate={"today"}
                            />
                        </div>
                        <div className='col-12'>
                            <label><FormattedMessage id={"user.image"} /></label>
                            <div className='preview-img-container'>
                                <input id='previewImg' type='file' hidden
                                    onChange={(event) => this.handleOnChangeImage(event)} />
                                <label htmlFor='previewImg' className='label-upload'>
                                    <FormattedMessage id={"user.upload"} />
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
                                className={'btn btn-info px-3'}
                                onClick={() => this.handleSaveUser()}
                            >
                                <FormattedMessage id={"user.edit"} />
                            </button>
                        </div>
                        {this.state.isOpen === true &&
                            <Lightbox
                                mainSrc={this.state.previewImgURL}
                                onCloseRequest={() => this.setState({ isOpen: false })}
                            />
                        }
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        genderRedux: state.admin.genders,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllcodeGenders: () => dispatch(actions.fetchAllcodeGenders()),
        editAUserRedux: (data) => dispatch(actions.editAUser(data)),
        fetchAllCartByUserId: (id) => dispatch(actions.fetchAllCartByUserId(id)),
        updateUserInfoRedux: (userInfo) => dispatch(actions.updateUserInfo(userInfo))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DetailUserPage));
