import React, { Component } from "react";
import { connect } from "react-redux";
import "./ChangePassword.scss";
import { handleChangePassword } from "../../services/userService"
import { KeyCodeUtils } from "../../utils";
import { FormattedMessage } from "react-intl";
import { Redirect } from "react-router";
import { toast } from "react-toastify";

class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            oldPassword: "",
            newPassword: "",
            rePassword: "",
            errMessage: "",
            isShowOldPassword: false,
            isShowNewPassword: false,
            isShowRePassword: false,
            isSuccess: false,
        };
    }
    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        })
    }
    handleBtnSend = async () => {
        this.setState({
            errMessage: ""
        })
        try {
            if (!this.state.oldPassword || !this.state.newPassword || !this.state.rePassword) {
                this.setState({
                    errMessage: "Vui lòng không bỏ trống!"
                })
                return;
            }
            if (this.state.oldPassword === this.state.newPassword) {
                this.setState({
                    errMessage: "Mật khẩu mới không được trùng với mật khẩu cũ!"
                })
                return;
            } else if (this.state.newPassword !== this.state.rePassword) {
                this.setState({
                    errMessage: "Mật khẩu nhập lại không chính xác!"
                })
                return;
            } else {
                let id = '';
                if (this.props.match && this.props.match.params && this.props.match.params.id) {
                    id = this.props.match.params.id;
                }
                let data = await handleChangePassword({
                    id: id,
                    oldPassword: this.state.oldPassword,
                    newPassword: this.state.newPassword
                })
                if (data && data.errCode !== 0) {
                    toast.error("Đổi mật khẩu thất bại!")
                    this.setState({
                        errMessage: data.errMessage
                    })
                }
                if (data && data.errCode === 0) {
                    toast.success("Đổi mật khẩu thành công!")
                    this.setState({
                        oldPassword: "",
                        newPassword: "",
                        rePassword: "",
                        errMessage: "",
                    })
                    setTimeout(() => {
                        this.setState({
                            isSuccess: true
                        })
                    }, 3000);
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
    handleKeyDown = (event) => {
        const keyCode = event.which || event.keyCode;
        if (keyCode === KeyCodeUtils.ENTER) {
            this.handleBtnSend()
        }
    }
    handleShowHidePassword = (id) => {
        let copyState = { ...this.state };
        copyState[id] = !copyState[id];
        this.setState({
            ...copyState
        })
    };
    render() {
        let { isSuccess } = this.state;
        return (
            <>
                {isSuccess === false ?
                    <div className="change-pw-background">
                        <div className="change-pw-container">
                            <div className="change-pw-content row">
                                <div className="col-12 text-change-pw">
                                    <FormattedMessage id={"auth.old-password"} />
                                </div>
                                <div className="col-12 form-group change-pw-input">
                                    <label>
                                        <FormattedMessage id={"auth.old-password"} />
                                    </label>
                                    <div className="custom-input-password">
                                        <input
                                            type={this.state.isShowOldPassword ? "text" : "password"}
                                            className="form-control"
                                            placeholder="Nhập mật khẩu cũ"
                                            onChange={(event) => this.handleOnChangeInput(event, "oldPassword")}
                                        />
                                        <span onClick={() => this.handleShowHidePassword("isShowOldPassword")}>
                                            <i
                                                className={this.state.isShowOldPassword ? "far fa-eye" : "far fa-eye-slash"}
                                            ></i>
                                        </span>
                                    </div>
                                </div>
                                <div className="col-12 form-group change-pw-input">
                                    <label>
                                        <FormattedMessage id={"auth.new-password"} />
                                    </label>
                                    <div className="custom-input-password">
                                        <input
                                            type={this.state.isShowNewPassword ? "text" : "password"}
                                            className="form-control"
                                            placeholder="Nhập mật khẩu mới"
                                            onChange={(event) => this.handleOnChangeInput(event, "newPassword")}
                                        />
                                        <span onClick={() => this.handleShowHidePassword("isShowNewPassword")}>
                                            <i
                                                className={this.state.isShowNewPassword ? "far fa-eye" : "far fa-eye-slash"}
                                            ></i>
                                        </span>
                                    </div>
                                </div>
                                <div className="col-12 form-group change-pw-input">
                                    <label>
                                        <FormattedMessage id={"auth.re-password"} />
                                    </label>
                                    <div className="custom-input-password">
                                        <input
                                            type={this.state.isShowRePassword ? "text" : "password"}
                                            className="form-control"
                                            placeholder="Nhập lại mật khẩu mới"
                                            onChange={(event) => this.handleOnChangeInput(event, "rePassword")}
                                            onKeyDown={(event) => this.handleKeyDown(event)}
                                        />
                                        <span onClick={() => this.handleShowHidePassword("isShowRePassword")}>
                                            <i
                                                className={this.state.isShowRePassword ? "far fa-eye" : "far fa-eye-slash"}
                                            ></i>
                                        </span>
                                    </div>
                                </div>
                                <div className="col-12" style={{ color: 'red' }}>
                                    {this.state.errMessage}
                                </div>
                                <div className="col-12">
                                    <button
                                        className="btn-change-pw"
                                        onClick={() => this.handleBtnSend()}
                                    >
                                        <FormattedMessage id={"auth.send"} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <Redirect />
                }
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

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
