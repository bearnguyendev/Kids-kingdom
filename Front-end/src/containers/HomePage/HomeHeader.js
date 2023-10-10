import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as actions from "../../store/actions";
import HomeBanner from './HomeBanner';
import "./HomeHeader.scss";
import HomeNav from './HomeNav';
class HomeHeader extends Component {

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
                <HomeNav />
                <div className='home-header-container'>
                    <div className='home-header-content'>
                        <div className='options'>
                            <div className='option-child'>
                                <div className="icon-child">
                                    <div className='icon'>
                                        <i className="fas fa-truck-moving"></i>
                                    </div>
                                </div>
                                <div className='text-child'>
                                    Giao hàng toàn quốc
                                </div>
                            </div>
                            <div className='option-child'>
                                <div className="icon-child">
                                    <div className='icon'>
                                        <i className="fas fa-undo-alt"></i>
                                    </div>
                                </div>
                                <div className='text-child'>
                                    Trả hàng trong 14 ngày
                                </div>
                            </div>
                            <div className='option-child'>
                                <div className="icon-child">
                                    <div className='icon'>
                                        <i className="fas fa-phone"></i>
                                    </div>
                                </div>
                                <div className='text-child'>
                                    Luôn luôn sẵn sàng hỗ trợ
                                </div>
                            </div>
                            <div className='option-child'>
                                <div className="icon-child">
                                    <i className="fas fa-dollar-sign"></i>
                                </div>
                                <div className='text-child'>
                                    Thanh toán khi nhận hàng
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <HomeBanner />
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeHeader);
