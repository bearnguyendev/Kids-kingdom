import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from "../../store/actions";
import 'react-image-lightbox/style.css';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { path } from '../../utils';
class Welcome extends Component {

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
        return (
            <>
                <div className='title'> Chào mừng bạn đến với trang quản trị hệ thống</div>
                <div className='text-center' style={{ lineHeight: '2rem', paddingTop: "10rem" }}>
                    <div><Link to={path.MANAGE_USER}><FormattedMessage id={"menu.admin.crud-user"} /></Link></div>
                    <div><Link to={path.MANAGE_ORDER}><FormattedMessage id={"menu.admin.manage-orders"} /></Link></div>
                    <div><Link to={path.MANAGE_CATEGORY}><FormattedMessage id={"menu.admin.manage-category"} /></Link></div>
                    <div><Link to={path.MANAGE_BRAND}><FormattedMessage id={"menu.admin.manage-brand"} /></Link></div>
                    <div><Link to={path.MANAGE_PRODUCT}><FormattedMessage id={"menu.admin.manage-product"} /></Link></div>
                    <div><Link to={path.MANAGE_BANNER}><FormattedMessage id={"menu.admin.manage-banner"} /></Link></div>
                    <div><Link to={path.MANAGE_SUBJECT}><FormattedMessage id={"menu.admin.manage-subject"} /></Link></div>
                    <div><Link to={path.MANAGE_BLOG}><FormattedMessage id={"menu.admin.manage-blog"} /></Link></div>
                    <div><Link to={path.MANAGE_TYPE_VOUCHER}><FormattedMessage id={"menu.admin.type-voucher"} /></Link></div>
                    <div><Link to={path.MANAGE_VOUCHER}><FormattedMessage id={"menu.admin.manage-voucher"} /></Link></div>
                    <div><Link to={path.MANAGE_TYPE_SHIP}><FormattedMessage id={"menu.admin.manage-ship"} /></Link></div>
                    <div><Link to={path.MANAGE_IMPORT}><FormattedMessage id={"menu.admin.manage-import"} /></Link></div>
                    <div><Link to={path.MANAGE_STATISTICAL}><FormattedMessage id={"menu.admin.website-parameters"} /></Link></div>
                </div>
            </>
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

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);
