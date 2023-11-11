import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import ItemVoucher from './ItemVoucher';
import "./VoucherModal.scss"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { emitter } from '../../utils/emitter';
import moment from 'moment';
import { toast } from 'react-toastify';
class VoucherModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrVoucher: [],
            codeVoucher: '',
            activeBtn: false,
            findVoucher: ''
        }
        this.listenToEmitter();
    }
    listenToEmitter() {
        emitter.on('EVENT_CLEAR_MODAL_DATA', () => {
            //reset state
            this.setState({
                codeVoucher: '',
                activeBtn: false,
                findVoucher: ''
            })
        })
    }
    async componentDidMount() {

    }
    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    toggle = () => {
        this.props.toggleFromParent()
    }
    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        if (event.target.value !== '') {
            this.setState({
                ...copyState,
                activeBtn: true
            })
        } else {
            this.setState({
                ...copyState,
                activeBtn: false
            })
        }
    }
    handleClickApplyVoucher = (id) => {
        this.props.idVoucher(id)
    }
    handleClickSearchVoucher = () => {
        let { codeVoucher, findVoucher } = this.state
        let { arrVoucher } = this.props
        findVoucher = arrVoucher && arrVoucher.find(item => {
            return item && item.codeVoucher === codeVoucher
        })
        if (!findVoucher) {
            toast.error(<FormattedMessage id={"voucher.no-voucher"} />)
            this.setState({
                codeVoucher: ''
            })
        } else {
            this.setState({
                findVoucher
            })
        }
    }
    render() {
        let { activeBtn, findVoucher } = this.state
        let { arrVoucher } = this.props
        return (
            <>
                <Modal
                    isOpen={this.props.isOpen}
                    toggle={() => { this.toggle() }}
                    className={'modal-voucher-container'}
                    size="md"
                    centered
                >
                    <ModalHeader toggle={() => { this.toggle() }}>
                        <FormattedMessage id={"voucher.choose-voucher"} />
                    </ModalHeader>
                    <ModalBody>
                        <div className='modal-voucher-body'>
                            <div className='row'>
                                <div className='col'>
                                    <label >
                                        <FormattedMessage id={"voucher.codeVoucher"} /></label>
                                    <div className='input-group'>
                                        <input type='text' className='form-control' style={{ height: "unset" }}
                                            onChange={(event) => this.handleOnChangeInput(event, "codeVoucher")}
                                            value={this.state.codeVoucher}
                                            placeholder="Nhập để tìm mã giảm giá của bạn" />
                                        <button disabled={activeBtn === true ? false : true} className={activeBtn === true ? 'btn-search active' : 'btn-search'}
                                            onClick={() => this.handleClickSearchVoucher()}
                                        ><FormattedMessage id={"voucher.search"} /></button>
                                    </div>
                                </div>
                                <div className='list-voucher-page' style={{ maxHeight: '400px', overflowY: 'auto', overflowX: 'hidden', marginLeft: "10px" }}>
                                    {arrVoucher && arrVoucher.length > 0 && findVoucher === '' &&
                                        arrVoucher.map((item, index) => {
                                            let typeVoucherFormat = item.typeVoucherOfVoucherData.type === 'percent' ? item.typeVoucherOfVoucherData.value + "%" : item.typeVoucherOfVoucherData.value.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })
                                            let maxValue = item.typeVoucherOfVoucherData.maxValue ? item.typeVoucherOfVoucherData.maxValue : ''
                                            let minValue = item.typeVoucherOfVoucherData.minValue >= 0 ? item.typeVoucherOfVoucherData.minValue : ''
                                            return (
                                                <ItemVoucher
                                                    id={item.id}
                                                    handleClickApplyVoucher={this.handleClickApplyVoucher}
                                                    width="550px" height="330px"
                                                    key={index}
                                                    name={item.codeVoucher}
                                                    widthPercent={item.numberUsed * 100 / item.number}
                                                    maxValue={maxValue.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
                                                    minValue={minValue.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
                                                    numberUsed={Math.round((item.numberUsed * 100 / item.number) * 10) / 10}
                                                    typeVoucher={typeVoucherFormat}
                                                    isShowUseVoucher={true}
                                                    toDate={moment.unix(item.toDate / 1000).format('DD/MM/YYYY')}
                                                />
                                            )
                                        })}
                                    {findVoucher !== '' &&
                                        <ItemVoucher
                                            id={findVoucher.id}
                                            handleClickApplyVoucher={this.handleClickApplyVoucher}
                                            width="550px" height="330px"
                                            key={1}
                                            name={findVoucher.codeVoucher}
                                            widthPercent={findVoucher.numberUsed * 100 / findVoucher.number}
                                            maxValue={findVoucher.typeVoucherOfVoucherData.maxValue ? findVoucher.typeVoucherOfVoucherData.maxValue.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) : ''}
                                            minValue={findVoucher.typeVoucherOfVoucherData.minValue >= 0 ? findVoucher.typeVoucherOfVoucherData.minValue.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) : ''}
                                            numberUsed={Math.round((findVoucher.numberUsed * 100 / findVoucher.number) * 10) / 10}
                                            typeVoucher={findVoucher.typeVoucherOfVoucherData.type === 'percent' ? findVoucher.typeVoucherOfVoucherData.value + "%" : findVoucher.typeVoucherOfVoucherData.value.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
                                            isShowUseVoucher={true}
                                            toDate={moment.unix(findVoucher.toDate / 1000).format('DD/MM/YYYY')}
                                        />
                                    }
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        {' '}
                        <Button color="secondary" className='px-3' onClick={() => { this.toggle() }}>
                            <FormattedMessage id={"voucher.close"} />
                        </Button>
                    </ModalFooter>
                </Modal>

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

export default connect(mapStateToProps, mapDispatchToProps)(VoucherModal);
