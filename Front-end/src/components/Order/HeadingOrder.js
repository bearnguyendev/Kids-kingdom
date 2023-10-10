import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
class HeadingOrder extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }
    componentDidMount() {

    }
    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    returnToHome = () => {
        if (this.props.history) {
            this.props.history.push(`/home`)
        }
    }
    render() {
        let { isShowLogo } = this.props
        return (
            <div className="wrap-heading-order">
                {isShowLogo &&
                    <span className='nav-logo'
                        onClick={() => this.returnToHome()}>
                    </span>
                }
                <span className='detail-title'><FormattedMessage id={"manage-order.detail"} /></span>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HeadingOrder));
