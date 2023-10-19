import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { handleChangePassword } from '../../services/userService';
import * as actions from "../../store/actions";
import { KeyCodeUtils } from '../../utils';
import { emitter } from '../../utils/emitter';
class ChangePasswordUser extends Component {

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
            isSuccess: false
        }
        this.listenToEmitter();
    }
    listenToEmitter() {
        emitter.on('EVENT_CLEAR_INPUT', () => {
            //reset state
            this.setState({
                oldPassword: "",
                newPassword: "",
                rePassword: "",
                errMessage: "",
                isShowOldPassword: false,
                isShowNewPassword: false,
                isShowRePassword: false,
                isSuccess: false
            })
        })
    }
    componentDidMount() {
        this.props.showAvatar()
        window.scrollTo(0, 0)
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
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
                let id = this.props.userId ? this.props.userId : ""
                let data = await handleChangePassword({
                    id: id,
                    oldPassword: this.state.oldPassword,
                    newPassword: this.state.newPassword
                })
                if (data && +data.errCode !== 0) {
                    toast.error("Đổi mật khẩu thất bại!")
                    this.setState({
                        errMessage: data.errMessage
                    })
                }
                if (data && +data.errCode === 0) {
                    toast.success("Đổi mật khẩu thành công!")
                    emitter.emit('EVENT_CLEAR_INPUT')
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
        console.log("check stateeeee: ", this.props);
        return (
            <div className='change-password-user'>
                <div className='title-content'>
                    <div className='title-1'>
                        <FormattedMessage id={"user.change-password"} />
                    </div>
                    <div className='title-2'>
                        <FormattedMessage id={"user.title-change-password"} />
                    </div>
                </div>
                <div className="change-pw-content row main-content">
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
                                value={this.state.oldPassword}
                                onKeyDown={(event) => this.handleKeyDown(event)}
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
                                value={this.state.newPassword}
                                onKeyDown={(event) => this.handleKeyDown(event)}
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
                                value={this.state.rePassword}
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
        );
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangePasswordUser);
