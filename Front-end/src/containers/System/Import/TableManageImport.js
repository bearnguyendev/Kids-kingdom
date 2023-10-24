import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './TableManageImport.scss'
import * as actions from '../../../store/actions';
import moment from 'moment';
import { deleteImportService } from '../../../services/userService';
import { toast } from 'react-toastify';


class TableManageImport extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrImports: [],
        }
    }

    async componentDidMount() {
        this.props.fetchAllImports()
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listImports !== this.props.listImports) {
            this.setState({
                arrImports: this.props.listImports
            })
        }
    }
    handleDeleteImport = async (id, productId, quantity) => {
        try {
            let data = {
                id,
                productId,
                quantity
            }
            let res = await deleteImportService(data);
            if (res && res.errCode === 0) {
                toast.success(res.errMessage);
                this.props.fetchAllImports();
            } else {
                toast.error(res.errMessage)
                this.props.fetchAllImports();
            }
        } catch (error) {
            toast.error(<FormattedMessage id={"error"} />)
        }

    }
    handleEditImport = async (importProduct) => {
        let state = { ...importProduct }
        this.props.handleEditImportFromParentKey(state)
    }
    render() {
        let { arrImports } = this.state
        console.log("check statete: ", this.state);
        return (
            <>
                <table id='TableManageImport'>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th><FormattedMessage id={"manage-import.name"} /></th>
                            <th><FormattedMessage id={"manage-import.quantity"} /></th>
                            <th><FormattedMessage id={"manage-import.priceImport"} /></th>
                            <th><FormattedMessage id={"manage-import.date"} /></th>
                            <th><FormattedMessage id={"manage-import.action"} /></th>
                        </tr>
                    </thead>
                    <tbody>
                        {arrImports && arrImports.length > 0 &&
                            arrImports.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.importData && item.importData.name ? item.importData.name : ''}</td>
                                        <td>{item.quantity ? item.quantity : ''}</td>
                                        <td>{item.priceImport.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) ? item.priceImport.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) : ''}</td>
                                        <td>{moment(item.createAt).utc("+07:00").format("L")}</td>
                                        <td>
                                            <div className='btn-table-manage-import'>
                                                <button
                                                    className='btn-edit'
                                                    onClick={() => this.handleEditImport(item)}
                                                    title="Chỉnh sửa"
                                                ><i className="fas fa-pencil-alt"></i></button>
                                                <button
                                                    className='btn-delete'
                                                    onClick={() => this.handleDeleteImport(item.id, item.productId, item.quantity)}
                                                    title="Xoá"
                                                ><i className="fas fa-trash"></i></button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                    </tbody>
                </table>
                {arrImports <= 0 &&
                    <div className='text-center mt-3'>
                        <FormattedMessage id={"manage-import.no-data"} />
                    </div>
                }
            </>
        );
    }

}

const mapStateToProps = state => {
    return {
        listImports: state.admin.imports
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllImports: () => dispatch(actions.fetchAllImports()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageImport);
