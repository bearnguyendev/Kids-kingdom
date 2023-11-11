import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './TableManageTypeShip.scss'
import * as actions from '../../../store/actions';
import { deleteTypeShipService } from '../../../services/userService';
import { toast } from 'react-toastify';


class TableManageTypeShip extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrTypeShips: [],
        }
    }

    async componentDidMount() {
        this.props.fetchAllTypeShips()
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listTypeShips !== this.props.listTypeShips) {
            this.setState({
                arrTypeShips: this.props.listTypeShips
            })
        }
    }
    handleDeleteTypeShip = async (id) => {
        try {
            let res = await deleteTypeShipService(id);
            if (res && res.errCode === 0) {
                toast.success(res.errMessage);
                this.props.fetchAllTypeShips();
            } else {
                toast.error(res.errMessage)
            }
        } catch (error) {
            toast.error(<FormattedMessage id={"error"} />)
        }

    }
    handleEditTypeShip = (typeShip) => {
        this.props.handleEditTypeShipFromParentKey(typeShip)
    }
    render() {
        let { arrTypeShips } = this.state
        return (
            <>
                <table id='TableManageTypeShip'>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th><FormattedMessage id={"manage-type-ship.type"} /></th>
                            <th><FormattedMessage id={"manage-type-ship.price"} /></th>
                            <th><FormattedMessage id={"manage-type-ship.action"} /></th>
                        </tr>
                    </thead>
                    <tbody>
                        {arrTypeShips && arrTypeShips.length > 0 &&
                            arrTypeShips.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.type}</td>
                                        <td>{item.price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                        <td>
                                            <div className='btn-table-manage-type-ship'>
                                                <button
                                                    className='btn-edit'
                                                    onClick={() => this.handleEditTypeShip(item)}
                                                    title="Chỉnh sửa"
                                                ><i className="fas fa-pencil-alt"></i></button>
                                                <button
                                                    className='btn-delete'
                                                    onClick={() => this.handleDeleteTypeShip(item.id)}
                                                    title="Xoá"
                                                ><i className="fas fa-trash"></i></button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                    </tbody>
                </table>
                {arrTypeShips <= 0 &&
                    <div className='text-center mt-3'>
                        <FormattedMessage id={"manage-type-ship.no-data"} />
                    </div>
                }
            </>
        );
    }

}

const mapStateToProps = state => {
    return {
        listTypeShips: state.admin.typeShips
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllTypeShips: () => dispatch(actions.fetchAllTypeShips())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageTypeShip);
