import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import "./HomeBanner.scss"
import Slider from "react-slick";
import * as actions from "../../store/actions";
class HomeBanner extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrListBanner: [],
        }
    }
    componentDidMount() {
        this.props.loadListBanner()
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listBannerRedux !== this.props.listBannerRedux) {
            this.setState({
                arrListBanner: this.props.listBannerRedux
            })
        }
    }

    render() {
        var settings = {
            dots: true,
            autoplay: true,
            arrows: false
        };
        let { arrListBanner } = this.state
        console.log("check arr: ", arrListBanner);
        return (
            <div className="home-banner-container">
                <div className='home-banner-content'>
                    <Slider {...settings}>
                        {arrListBanner && arrListBanner.length > 0 &&
                            arrListBanner.map((item, index) => {
                                return (
                                    <div className='home-banner-img'>
                                        <div className='home-banner-bg-img'
                                            style={{ backgroundImage: `url(${item.image})` }}
                                        >
                                        </div>
                                    </div>
                                )
                            })}
                    </Slider>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        listBannerRedux: state.admin.listBanners,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loadListBanner: () => dispatch(actions.fetchListBanners())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeBanner);
