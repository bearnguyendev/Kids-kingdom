import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import "./Login.scss";

import { handleLogin, handleLoginWithGoogle } from "../../services/userService"
import { KeyCodeUtils } from "../../utils";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            isShowPassword: false,
            errMessage: ""
        };
    }
    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        })
    }

    handleLogin = async () => {
        this.setState({
            errMessage: ""
        })
        try {
            let data = await handleLogin({
                email: this.state.email,
                password: this.state.password
            })
            if (data.errCode !== 0) {
                this.setState({
                    errMessage: data.errMessage
                })
            } else {
                console.log("check data: ", data.user);
                this.props.userLoginSuccess(data.user)
                this.props.fetchAllCartByUserId(data.user.id)
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
    handleShowHidePassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword,
        });
    };
    handleKeyDown = (event) => {
        const keyCode = event.which || event.keyCode;
        if (keyCode === KeyCodeUtils.ENTER) {
            this.handleLogin()
        }
    }
    handleLoginWithGoogle = async () => {
        try {
            let res = await handleLoginWithGoogle()
            console.log("resss: ", res);
            // if (res) {
            //     window.location.href = res.data.redirectUrl;
            // }
        } catch (error) {
            console.error(error);
        }

    }
    render() {
        return (
            <>
                <div className="login-background">
                    <div className="login-container">
                        <div className="login-content row">
                            <div className="col-12 text-login">
                                <FormattedMessage id={"auth.login"} />
                            </div>
                            <div className="col-12 form-group login-input">
                                <label>
                                    <FormattedMessage id={"auth.email"} />
                                </label>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Nhập email"
                                    value={this.state.email}
                                    onChange={(event) => this.handleOnChangeInput(event, "email")}
                                />
                            </div>
                            <div className="col-12 form-group login-input">
                                <label>
                                    <FormattedMessage id={"auth.password"} />
                                </label>
                                <div className="custom-input-password">
                                    <input
                                        type={this.state.isShowPassword ? "text" : "password"}
                                        className="form-control"
                                        placeholder="Nhập mật khẩu"
                                        onChange={(event) => this.handleOnChangeInput(event, "password")}
                                        onKeyDown={(event) => this.handleKeyDown(event)}
                                    />
                                    <span onClick={() => this.handleShowHidePassword()}>
                                        <i
                                            className={this.state.isShowPassword ? "far fa-eye" : "far fa-eye-slash"}
                                        ></i>
                                    </span>
                                </div>
                            </div>
                            <div className="col-12" style={{ color: 'red' }}>
                                {this.state.errMessage}
                            </div>
                            <div className="col-12">
                                <button
                                    className="btn-login"
                                    onClick={() => this.handleLogin()}
                                >
                                    <FormattedMessage id={"auth.login"} />
                                </button>
                            </div>
                            <div className="col-12">
                                <Link to={"/forgot-password"} className="forgot-password">
                                    <FormattedMessage id={"auth.forgot-password"} />
                                </Link>
                            </div>
                            <div className="col-12 text-center mt-3">
                                <Link to={"/sign-up"} className="text-sign-up">
                                    <FormattedMessage id={"auth.text-sign-up"} />
                                </Link>
                            </div>
                            <div className="col-12 text-center mt-3">
                                <span className="text-other-login">
                                    <FormattedMessage id={"auth.other"} />
                                </span>
                            </div>
                            <div className="col-12 social-login">
                                <a>
                                    <i className="fab fa-google-plus-g google"
                                        onClick={() => this.handleLoginWithGoogle()}
                                    ></i>
                                </a>
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
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        navigate: (path) => dispatch(push(path)),
        userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo)),
        fetchAllCartByUserId: (id) => dispatch(actions.fetchAllCartByUserId(id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
