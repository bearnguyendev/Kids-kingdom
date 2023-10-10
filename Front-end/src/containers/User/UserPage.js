import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as actions from "../../store/actions";
import HomeFooter from '../HomePage/HomeFooter';
import HomeNav from '../HomePage/HomeNav';

class UserPage extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }
    componentDidMount() {
        this.props.showAvatar()
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    render() {
        let { userId } = this.props.userInfo.id
        return (
            <>
                <HomeNav />

                {/* <div className="detail-user container my-4">
                    <div className='content-left' >
                        <div className='all-title'>
                            <div className='select-title'><FormattedMessage id={"user.detail"} /></div>
                            <div className='select-title'><FormattedMessage id={"user.address"} /></div>
                            <div className='select-title'><FormattedMessage id={"user.change-password"} /></div>
                            <div className='select-title'><FormattedMessage id={"user.my-order"} /></div>
                            <div className='select-title'><FormattedMessage id={"user.my-voucher"} /></div>
                        </div>
                    </div>
                    <div className='content-center'>
                        <div className='row'>

                        </div>
                    </div>
                    <div className='content-right'>
                        <div className='avatar-user'
                            style={{ backgroundImage: `url(${userInfo && userInfo.image ? userInfo.image : 'https://www.seekpng.com/png/detail/428-4287240_no-avatar-user-circle-icon-png.png'})` }}
                        >
                        </div>
                        <div className='change-avatar'>
                            <FormattedMessage id={"user.change-img"} />
                        </div>
                    </div>
                </div> */}
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);
