import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import * as actions from "../../store/actions";
import { paymentMomoService, paymentPayPalService } from '../../services/userService';
class PaymentFrom extends Component {

    constructor(props) {
        super(props);
        this.state = {
            amount: '',
            orderInfo: [{
                quantity: 1,
                name: "San pham 1"
            }, {
                quantity: 2,
                name: "San pham 2"
            }
            ],
            orderId: '',
        }
    }
    async componentDidMount() {

    }
    componentDidUpdate(prevProps, prevState, snapshot) {

    }
    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }
    handlePayment = async (e) => {
        e.preventDefault();
        try {
            let res = await paymentMomoService(this.state)
            console.log("check res: ", res.res.payUrl);
            window.location.href = res.res.payUrl
        } catch (error) {
            console.error('Failed to generate payment URL: ', error);
        }
    };
    render() {
        const { amount, orderInfo, orderId, paymentUrl } = this.state;
        return (
            <>
                <form onSubmit={this.handlePayment}>
                    <label>
                        Amount:
                        <input type="text" name="amount" value={amount} onChange={this.handleChange} />
                    </label>
                    <br />
                    {/* <label>
                        Order Information:
                        <input type="text" name="orderInfo" value={orderInfo} onChange={this.handleChange} />
                    </label> */}
                    <br />
                    <label>
                        Invoice Number:
                        <input type="text" name="orderId" value={orderId} onChange={this.handleChange} />
                    </label>
                    <br />
                    <button type="submit">Pay</button>
                </form>
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

export default connect(mapStateToProps, mapDispatchToProps)(PaymentFrom);
