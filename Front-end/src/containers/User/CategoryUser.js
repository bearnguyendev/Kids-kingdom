import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
class CategoryUser extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }
    componentDidMount() {

    }
    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    render() {
        let userId = this.props.userInfo.id;
        return (
            <div className='content-left' >
                <div className='all-title'>
                    <NavLink to={`/user/detail/${userId}`} activeClassName="active"><div className='select-title'><FormattedMessage id={"user.detail"} /></div></NavLink>
                    <NavLink to={`/user/address/${userId}`} activeClassName="active"><div className='select-title'><FormattedMessage id={"user.address"} /></div></NavLink>
                    <NavLink to={`/user/change-password/${userId}`} activeClassName="active"> <div className='select-title'><FormattedMessage id={"user.change-password"} /></div></NavLink>
                    <NavLink to={`/user/order/${userId}`} activeClassName="active"> <div className='select-title'><FormattedMessage id={"user.my-order"} /></div></NavLink>
                    <NavLink to={`/user/voucher/${userId}`} activeClassName="active"><div className='select-title'><FormattedMessage id={"user.my-voucher"} /></div></NavLink>
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

export default connect(mapStateToProps, mapDispatchToProps)(CategoryUser);
