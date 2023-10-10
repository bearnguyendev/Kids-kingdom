import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import "./HomeFooter.scss"
class HomeFooter extends Component {
    render() {

        return (
            <div className='home-footer-container'>
                <div className='home-footer-content'>
                    <div className='home-ft-up'>
                        <div className='home-ft-1'>
                            <div className='home-ft-title'>
                                Liên hệ chúng tôi
                            </div>
                            <div className='home-ft-name'>
                                Công ty TNHH Kidskingdom
                            </div>
                            <div className='home-ft-infor'>
                                <span className='home-ft-icon'>
                                    <i className="fas fa-map-marker-alt"></i>
                                </span>
                                {' '}
                                <span>
                                    Địa chỉ công ty: 97 Man Thiện, Hiệp Phú, Quận 9, TPHCM
                                </span>
                            </div>
                            <div className='home-ft-infor'>
                                <span className='home-ft-icon'>
                                    <i className="fas fa-phone"></i>
                                </span>
                                {' '}
                                <span>
                                    Điện thoại liên hệ: 0000011111
                                </span>
                            </div>
                            <div className='home-ft-infor'>
                                <span className='home-ft-icon'>
                                    <i className="fas fa-envelope"></i>
                                </span>
                                {' '}
                                <span>
                                    Email: info@kidskingdom.vn
                                </span>
                            </div>
                            <div className='home-ft-infor'>
                                <span className='home-ft-icon'>
                                    <i className="fas fa-credit-card"></i>
                                </span>
                                {' '}
                                <span>
                                    STK1 : CONG TY TNHH KIDS KINGDOM VIET NAM  00000000000 - Ngân hàng VietHoabank,
                                    chi nhánh Etown
                                </span>
                            </div>
                        </div>
                        <div className='home-ft-2'>
                            <div className='home-ft-title'>
                                Điều khoản và chính sách
                            </div>
                            <div className='home-ft-des'>
                                - Chính sách giao hàng
                            </div>
                            <div className='home-ft-des'>
                                - Chính sách bảo mật thông tin
                            </div>
                            <div className='home-ft-des'>
                                - Điều khoản sử dụng
                            </div>
                        </div>
                        <div className='home-ft-3'>
                            <div className='home-ft-title'>
                                Hỗ trợ khách hàng
                            </div>
                            <div className='home-ft-des'>
                                - Chính sách bảo mật
                            </div>
                            <div className='home-ft-des'>
                                - Chính sách bảo hành đổi trả hàng hóa
                            </div>
                            <div className='home-ft-des'>
                                - Chính sách thanh toán
                            </div>
                        </div>
                        <div className='home-ft-4'>
                            <div className='home-ft-title'>
                                Về cửa hàng
                            </div>
                            <div className='home-ft-des'>
                                Giờ mở cửa:
                                <br /> &emsp;
                                Cả tuần / 9:00 Sáng - 9:00 Tối
                            </div>
                            <div className="social-login">
                                <i className="fab fa-google-plus-g google"></i>
                                <i className="fab fa-facebook-f facebook"></i>
                            </div>
                        </div>
                    </div>
                    <div className='homt-ft-down text-center'>
                        <p>Bản quyền &copy; 2023 thuộc về Kidskingdom</p>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
