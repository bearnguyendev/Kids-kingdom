import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import Welcome from '../containers/System/Welcome';
import ManageUser from '../containers/System/Admin/ManageUser';
import Header from '../containers/Header/Header';
import ManageCategory from '../containers/System/Category/ManageCategory';
import ManageBrand from '../containers/System/Brand/ManageBrand';
import ProductImage from '../containers/System/Product/ProductImage';
import ManageProduct from '../containers/System/Product/ManageProduct';
import { path } from '../utils';
import ManageBanner from '../containers/System/Banner/ManageBanner';
import ManageSubject from '../containers/System/Subject/ManageSubject';
import ManageTypeShip from '../containers/System/TypeShip/ManageTypeShip';
import ManageBlog from '../containers/System/Blog/ManageBlog';
import ManageTypeVoucher from '../containers/System/TypeVoucher/ManageTypeVoucher';
import ManageVoucher from '../containers/System/Voucher/ManageVoucher';
import ManageOrder from '../containers/System/Order/ManageOrder';
import DetailOrder from '../containers/System/Order/DetailOrder';
import ManageStatistical from '../containers/System/Statistical/ManageStatistical';
import ManageImport from '../containers/System/Import/ManageImport';
class System extends Component {
    render() {
        const { systemMenuPath, isAdmin } = this.props;
        return (
            <>
                <div className="system-container">
                    {isAdmin && <Header />}
                    <div className="system-list" style={{ minHeight: "calc(100vh - 100px)" }}>
                        <Switch>
                            <Route path={path.WELCOME_SYSTEM} exact component={Welcome} />
                            <Route path={path.MANAGE_USER} component={ManageUser} />
                            <Route path={path.MANAGE_CATEGORY} component={ManageCategory} />
                            <Route path={path.MANAGE_BRAND} component={ManageBrand} />
                            <Route path={path.MANAGE_PRODUCT} exact component={ManageProduct} />
                            <Route path={path.UPLOAD_IMG_PRODUCT} exact component={ProductImage} />
                            <Route path={path.MANAGE_BANNER} exact component={ManageBanner} />
                            <Route path={path.MANAGE_SUBJECT} exact component={ManageSubject} />
                            <Route path={path.MANAGE_TYPE_SHIP} exact component={ManageTypeShip} />
                            <Route path={path.MANAGE_BLOG} exact component={ManageBlog} />
                            <Route path={path.MANAGE_TYPE_VOUCHER} exact component={ManageTypeVoucher} />
                            <Route path={path.MANAGE_VOUCHER} exact component={ManageVoucher} />
                            <Route path={path.MANAGE_ORDER} exact component={ManageOrder} />
                            <Route path={path.DETAIL_ORDER} exact component={DetailOrder} />
                            <Route path={path.MANAGE_STATISTICAL} exact component={ManageStatistical} />
                            <Route path={path.MANAGE_IMPORT} exact component={ManageImport} />
                            <Route component={() => { return (<Redirect to={systemMenuPath} />) }} />
                        </Switch>
                    </div>
                    <div className='text-center' style={{ position: "absolute", width: "100%" }}>
                        <p>Bản quyền &copy; 2023 thuộc về Kidskingdom</p>
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.user.isLoggedIn,
        isAdmin: state.user.isAdmin,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(System);
