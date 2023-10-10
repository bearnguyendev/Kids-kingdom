import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import LoadingOverlay from 'react-loading-overlay';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { handleSendVerifyEmail } from '../../services/userService';
class AvatarUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isShowLoading: false
        }
    }
    componentDidMount() {

    }
    componentDidUpdate(prevProps, prevState, snapshot) {
    }
    handleClickSendMail = async (id) => {
        try {
            this.setState({
                isShowLoading: true
            })
            let res = await handleSendVerifyEmail({ id: id })
            this.setState({
                isShowLoading: false
            })
            if (res && res.errCode === 0) {
                toast.success("Vui lòng kiểm tra email để hoàn tất quá trình xác thực email!")
            } else {
                toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau!")
            }
        } catch (error) {
            console.log(error);
        }
    }
    render() {
        let { userInfo, isHideAvatar } = this.props
        return (
            <LoadingOverlay
                active={this.state.isShowLoading}
                spinner
                text='Loading...'>
                {isHideAvatar === false &&
                    <div className='content-right'>
                        <div className='avatar-user'
                            style={{ backgroundImage: `url(${userInfo && userInfo.image ? userInfo.image : 'https://www.seekpng.com/png/detail/428-4287240_no-avatar-user-circle-icon-png.png'})` }}
                        >
                        </div>
                        {userInfo && userInfo.ActiveEmail === 0 &&
                            <a href='#' onClick={() => this.handleClickSendMail(userInfo.id)}>Xác thực email ngay</a>
                        }
                    </div>
                }
            </LoadingOverlay>
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

export default connect(mapStateToProps, mapDispatchToProps)(AvatarUser);
