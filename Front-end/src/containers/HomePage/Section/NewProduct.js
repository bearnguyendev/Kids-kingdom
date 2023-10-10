import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Slider from "react-slick";
import * as actions from "../../../store/actions"
import { withRouter } from 'react-router';
import { LIMIT } from "../../../utils";
import SliderProduct from './SliderProduct';
class NewProduct extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arrProduct: []
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.newProductRedux !== this.props.newProductRedux) {
            this.setState({
                arrProduct: this.props.newProductRedux
            })
        }
    }
    componentDidMount() {
        let limit = LIMIT
        let typeSort = 'createdAt'
        this.props.loadNewProducts(limit, typeSort);
    }
    handleViewCategory = () => {
        if (this.props.history) {
            this.props.history.push(`/category`)
        }
    }
    render() {
        let allProducts = this.state.arrProduct;
        //allProducts = allProducts.concat(allProducts)
        return (
            <div className='section-share section-top-product'>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'><FormattedMessage id={"home-page.new-product"} />
                        </span>
                        <button className='btn-section' onClick={() => this.handleViewCategory()}><FormattedMessage id={"home-page.more-infor"} /></button>
                    </div>
                    <SliderProduct
                        allProducts={allProducts}
                        settings={this.props.settings}
                    />
                </div>
            </div >

        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        newProductRedux: state.admin.newProducts,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loadNewProducts: (limit, typeSort) => dispatch(actions.fetchNewProducts(limit, typeSort))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NewProduct));
