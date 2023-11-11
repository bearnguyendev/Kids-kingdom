import React, { Component } from "react";
import { connect } from "react-redux";
import "./ResetPassword.scss";
import { toast } from 'react-toastify'
import { handleResetPassword } from "../../services/userService"
import { KeyCodeUtils } from "../../utils";
import { FormattedMessage } from "react-intl";
import { Redirect } from 'react-router'
class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newPassword: "",
            isShowPassword: false,
            errMessage: "",
            statusVerify: false,
        };
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
        let { newPassword } = this.state
        console.log("check newPass: ", newPassword)
        try {
            if (this.props.location && this.props.location.search) {
                let urlParams = new URLSearchParams(this.props.location.search)
                let token = urlParams.get('token');
                let userId = urlParams.get('userId');
                console.log("check token: ", token, "check userId: ", userId);
                let res = await handleResetPassword({
                    token: token,
                    userId: userId,
                    newPassword: newPassword
                })
                if (res && res.errCode !== 0) {
                    this.setState({
                        errMessage: res.errMessage
                    })
                }
                if (res && res.errCode === 0) {
                    toast.success(<FormattedMessage id={"auth.new-pw-success"} />);
                    setTimeout(() => {
                        this.setState({
                            statusVerify: true,
                        })
                    }, 5000);
                }
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
            this.handleSend()
        }
    }
    render() {
        let { statusVerify } = this.state
        return (
            <>
                {statusVerify === true
                    && <Redirect to="/login" />
                }
                <div className="rs-password-background">
                    <div className="rs-password-container">
                        <div className="rs-password-content row">
                            <div className="col-12 text-rs-password">
                                <FormattedMessage id={"auth.new-password"} />
                            </div>
                            <div className="col-12 form-group rs-password-input">
                                <label>
                                    <FormattedMessage id={"auth.new-password"} />
                                </label>
                                <div className="custom-input-password">
                                    <input
                                        type={this.state.isShowPassword ? "text" : "password"}
                                        className="form-control"
                                        placeholder="Nhập mật khẩu mới"
                                        onChange={(event) => this.handleOnChangeInput(event, "newPassword")}
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
                                    className="btn-rs-password"
                                    onClick={() => this.handleSend()}
                                >
                                    <FormattedMessage id={"auth.send"} />
                                </button>
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
