import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from "../../store/actions";
import Navigator from '../../components/Navigator';
import { adminMenu } from './menuApp';
import './Header.scss';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import { Link } from 'react-router-dom';
class Header extends Component {
    render() {
        const { processLogout, language, userInfo } = this.props;
        return (
            <div className="header-container" id='header'>
                {/* thanh navigator */}
                <div className="header-tabs-container">
                    <Navigator menus={adminMenu} />
                </div>

                <div className='header-infor'>
                    <Link to={`/user/detail/${userInfo.id}`}>
                        <div className='header-infor-img'
                            style={{ backgroundImage: `url(${userInfo && userInfo.image ? userInfo.image : 'https://www.seekpng.com/png/detail/428-4287240_no-avatar-user-circle-icon-png.png'})` }}
                        >

                        </div>
                    </Link>
                    <span className='welcome'>
                        <FormattedMessage id={"home-header.welcome"} />
                        {userInfo && !_.isEmpty(userInfo) ? `${userInfo.lastName} ${userInfo.firstName}` : ''}!
                    </span>
                    <div className='header-btn-change-password'>
                        <Link to={`change-password/${userInfo.id}`} style={{ color: "inherit" }} >
                            <i className="fas fa-unlock"></i>
                        </Link>
                    </div>
                    {/* nút logout */}
                    <div className="btn btn-logout" onClick={processLogout} title="Log out">
                        <i className="fas fa-sign-out-alt"></i>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
