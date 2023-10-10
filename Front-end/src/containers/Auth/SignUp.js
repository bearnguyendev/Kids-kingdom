import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import "./SignUp.scss";
import { createANewUser } from "../../services/userService"
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import { Redirect } from 'react-router'
class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            genders: '',
            selectedGender: '',
            isShowPassword: false,
            errMessage: "",
            status: false
        };
    }
    componentDidMount() {
        this.props.fetchAllcodeGenders();
    }
    buildDataGender = (data) => {
        let result = []
        if (data && data.length > 0) {
            data.map(item => {
                let object = {};
                object.label = item.value
                object.value = item.keyMap
                result.push(object)
            })
        }
        return result;
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.genders !== prevProps.genders) {
            if (this.props.genders.length > 0) {
                this.setState({
                    genders: this.buildDataGender(this.props.genders)
                })
            }
        }
    }
    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        })
    }
    handleSend = async () => {
        this.setState({
            errMessage: ""
        })
        let isValid = this.checkValidateInput()
        if (isValid === false) {
            return;
        }
        try {
            let data = await createANewUser({
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                phoneNumber: this.state.phoneNumber,
                genderId: this.state.selectedGender.value,
                roleId: "R2",
            })
            if (data && data.errCode !== 0) {
                this.setState({
                    errMessage: data.errMessage
                })
            }
            if (data && data.errCode === 0) {
                toast.success("Tạo tài khoản thành công!");
                this.setState({
                    email: "",
                    password: "",
                    firstName: '',
                    lastName: '',
                    phoneNumber: '',
                    address: '',
                    genders: '',
                    selectedGender: '',
                    errMessage: ""
                })
                setTimeout(() => {
                    this.setState({
                        status: true
                    })
                }, 3000);
            }
        } catch (error) {
            if (error.response) {
                if (error.response.data) {
                    this.setState({
                        errMessage: error.response.data.message
                    })
                }
            }
        }
    };
    checkValidateInput = () => {
        let isValid = true
        let arrCheck = ["email", "password", "firstName", "lastName",
            "phoneNumber", "address"]
        for (let i = 0; i < arrCheck.length; i++) {
            if (!this.state[arrCheck[i]]) {
                isValid = false;
                alert('Thông tin đầu vào này là bắt buộc: ' + arrCheck[i])
                break;
            }
        }
        return isValid;
    }
    handleShowHidePassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword,
        });
    };
    handleChangeSelect = (selectedOption) => {
        this.setState({ selectedGender: selectedOption })
    }
    render() {
        let { selectedGender, genders, status } = this.state
        return (
            <>
                {status === true && <Redirect to="/login" />}
                <div className="sign-up-background">
                    <div className="sign-up-container">
                        <div className="sign-up-content row">
                            <div className="col-12 text-sign-up">
                                <FormattedMessage id={"auth.sign-up"} />
                            </div>
                            <div className="col-6 form-group sign-up-input">
                                <label>
                                    <FormattedMessage id={"auth.email"} />
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nhập email"
                                    value={this.state.email}
                                    onChange={(event) => this.handleOnChangeInput(event, "email")}
                                />
                            </div>
                            <div className="col-6 form-group sign-up-input">
                                <label>
                                    <FormattedMessage id={"auth.password"} />
                                </label>
                                <div className="custom-input-password">
                                    <input
                                        type={this.state.isShowPassword ? "text" : "password"}
                                        className="form-control"
                                        placeholder="Nhập mật khẩu"
                                        onChange={(event) => this.handleOnChangeInput(event, "password")}
                                    />
                                    <span onClick={() => this.handleShowHidePassword()}>
                                        <i
                                            className={this.state.isShowPassword ? "far fa-eye" : "far fa-eye-slash"}
                                        ></i>
                                    </span>
                                </div>
                            </div>
                            <div className="col-6 form-group sign-up-input">
                                <label>
                                    <FormattedMessage id={"auth.lastName"} />
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nhập họ"
                                    value={this.state.lastName}
                                    onChange={(event) => this.handleOnChangeInput(event, "lastName")}
                                />
                            </div>
                            <div className="col-6 form-group sign-up-input">
                                <label>
                                    <FormattedMessage id={"auth.firstName"} />
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nhập tên"
                                    value={this.state.firstName}
                                    onChange={(event) => this.handleOnChangeInput(event, "firstName")}
                                />
                            </div>
                            <div className="col-6 form-group sign-up-input">
                                <label>
                                    <FormattedMessage id={"auth.phoneNumber"} />
                                </label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    placeholder="Nhập số điện thoại"
                                    value={this.state.phoneNumber}
                                    onChange={(event) => this.handleOnChangeInput(event, "phoneNumber")}
                                />
                            </div>
                            <div className="col-6 form-group sign-up-input">
                                <label>
                                    <FormattedMessage id={"auth.gender"} />
                                </label>
                                <Select
                                    value={selectedGender}
                                    onChange={this.handleChangeSelect}
                                    options={genders}
                                    placeholder={<FormattedMessage id={"auth.choose-gender"} />}
                                />
                            </div>
                            <div className="col-12 form-group sign-up-input">
                                <label>
                                    <FormattedMessage id={"auth.address"} />
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nhập địa chỉ"
                                    value={this.state.address}
                                    onChange={(event) => this.handleOnChangeInput(event, "address")}
                                />
                            </div>
                            <div className="col-12 text-center" style={{ color: 'red' }}>
                                {this.state.errMessage}
                            </div>
                            <div className="col-12 text-center">
                                <button
                                    className="btn-sign-up"
                                    onClick={() => this.handleSend()}
                                >
                                    <FormattedMessage id={"auth.send"} />
                                </button>
                            </div>
                            <div className="col-12 text-center mt-3">
                                <Link to={"/login"} className="text-login">
                                    <FormattedMessage id={"auth.text-login"} />
                                </Link>
                            </div>
                            <div className="col-12 text-center mt-3">
                                <span className="text-other-sign-up">
                                    <FormattedMessage id={"auth.other"} />
                                </span>
                            </div>
                            <div className="col-12 social-sign-up">
                                <i className="fab fa-google-plus-g google"></i>
                                <i className="fab fa-facebook-f facebook"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        genders: state.admin.genders,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllcodeGenders: () => dispatch(actions.fetchAllcodeGenders())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
