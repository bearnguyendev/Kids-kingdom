import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { handleVerifyEmail } from '../../services/userService';
import * as actions from "../../store/actions";
import HomeFooter from '../HomePage/HomeFooter';
import HomeNav from '../HomePage/HomeNav';
import "./ActiveEmail.scss"
class ActiveEmail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            statusVerify: false,
            errCode: 0
        }
    }
    async componentDidMount() {
        if (this.props.location && this.props.location.search) {
            let urlParams = new URLSearchParams(this.props.location.search)
            let token = urlParams.get('token');
            let userId = urlParams.get('userId');
            let res = await handleVerifyEmail({
                token: token,
                userId: userId
            })
            if (res && res.errCode === 0) {
                this.setState({
                    statusVerify: true,
                    errCode: res.errCode
                })
                this.props.updateUserInfoRedux({ ...this.props.userInfo, ActiveEmail: 1 })
            } else {
                this.setState({
                    statusVerify: true,
                    errCode: res && res.errCode ? res.errCode : -1
                })
            }
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    render() {
        let { statusVerify, errCode } = this.state
        return (
            <>
                <HomeNav />
                <div className='container'>
                    <div className='verify-email-container'>
                        {statusVerify === false ?
                            <div>
                                <FormattedMessage id={"user.verify-email.loading-data"} />
                            </div>
                            :
                            <div>
                                {errCode === 0 ?
                                    <div className='user-active-email active'>
                                        <FormattedMessage id={"user.verify-email.success"} />
                                    </div>
                                    :
                                    <div className='user-active-email inactive'>
                                        <FormattedMessage id={"user.verify-email.error"} />
                                    </div>
                                }
                            </div>
                        }
                    </div>
                </div>
                <HomeFooter />
            </>
        );
    }

}

const mapStateToProps = state => {
    return {
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateUserInfoRedux: (userInfo) => dispatch(actions.updateUserInfo(userInfo))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActiveEmail);
