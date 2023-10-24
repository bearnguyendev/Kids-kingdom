import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './TableManageBanner.scss'
import * as actions from '../../../store/actions';
import { toast } from 'react-toastify';
import { deleteBannerService, handleChangeStatusBanner } from '../../../services/userService';
import Lightbox from 'react-image-lightbox';
import { CommonUtils } from '../../../utils';


class TableManageBanner extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrBanners: [],
            isOpen: false,
            errMessage: ""
        }
    }

    async componentDidMount() {
        this.props.fetchAllBanners()
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listBanners !== this.props.listBanners) {
            this.setState({
                arrBanners: this.props.listBanners
            })
        }
    }
    handleDeleteBanner = async (id) => {
        try {
            let res = await deleteBannerService(id);
            if (res && res.errCode === 0) {
                toast.success(res.errMessage);
                this.props.fetchAllBanners();
            } else {
                toast.error(res.errMessage)
            }
        } catch (error) {
            toast.error("Thao tác thất bại! Vui lòng thử lại sau.")
            if (error.response) {
                if (error.response.data) {
                    this.setState({
                        errMessage: error.response.data.message
                    })
                }
            }
        }

    }
    handleEditBanner = (banner) => {
        this.props.handleEditBannerFromParentKey(banner)
    }
    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file)
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewImgURL: objectUrl,
                image: base64
            })
        }
    }
    openPreviewImage = (item) => {

        this.setState({
            isOpen: true,
        })
    }
    handleChangeStatusBanner = async (banner, type) => {
        try {
            await handleChangeStatusBanner({
                id: banner.id,
                type: type
            })
            if (type === 'BAN') {
                toast.success(`Ẩn biểu ngữ ${banner.name} thành công!`)
                this.props.fetchAllBanners();
            }
            if (type === 'PERMIT') {
                toast.success(`Hiện biểu ngữ ${banner.name} thành công!`)
                this.props.fetchAllBanners();
            }
        } catch (error) {
            if (error.response) {
                if (error.response.data) {
                    this.setState({
                        errMessage: error.response.data.message
                    })
                }
            }
            toast.error("Thao tác thất bại! Vui lòng thử lại sau.")
        }
    }
    render() {
        let { arrBanners, isOpen } = this.state
        console.log("check arrrBanner", arrBanners);
        return (
            <>
                <table id='TableManageBanner'>
                    <thead>
                        <tr>
                            <th className='col-1'>STT</th>
                            <th className='col-3'><FormattedMessage id={"manage-banner.name"} /></th>
                            <th className='col-3'><FormattedMessage id={"manage-banner.image"} /></th>
                            <th className='col-2'><FormattedMessage id={"manage-banner.status"} /></th>
                            <th className='col-3'><FormattedMessage id={"manage-banner.action"} /></th>
                        </tr>
                    </thead>
                    <tbody>
                        {arrBanners && arrBanners.length > 0 &&
                            arrBanners.map((item, index) => {
                                return (
                                    <>
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.name}</td>
                                            <td><div className='preview-img-container'>
                                                <div className='preview-image'
                                                    style={{ backgroundImage: `url(${item.image})` }}
                                                    onClick={() => this.openPreviewImage(item)}
                                                >
                                                </div>
                                            </div>
                                            </td>
                                            <td>{item.statusId === 'S1' ? "Hiện" : "Ẩn"} </td>
                                            <td>
                                                <div className='btn-table-manage-banner'>
                                                    <button
                                                        className='btn-edit'
                                                        onClick={() => this.handleEditBanner(item)}
                                                        title="Chỉnh sửa"
                                                    ><i className="fas fa-pencil-alt"></i></button>
                                                    <button
                                                        className='btn-delete'
                                                        onClick={() => this.handleDeleteBanner(item.id)}
                                                        title="Xoá"
                                                    ><i className="fas fa-trash"></i></button>
                                                    {item.statusId === 'S1' ?
                                                        <button
                                                            className='btn-change-status-banner'
                                                            onClick={() => this.handleChangeStatusBanner(item, "BAN")}
                                                        >
                                                            <i className='far fa-eye-slash' title='Ẩn biểu ngữ'></i>
                                                        </button>
                                                        :
                                                        <button
                                                            className='btn-change-status-banner'
                                                            onClick={() => this.handleChangeStatusBanner(item, "PERMIT")}
                                                        >
                                                            <i className='far fa-eye' title='Hiện biểu ngữ'></i>
                                                        </button>
                                                    }
                                                </div>

                                            </td>
                                        </tr>
                                        {isOpen === true &&
                                            <Lightbox
                                                mainSrc={item.image}
                                                onCloseRequest={() => this.setState({ isOpen: false })}
                                            />
                                        }
                                    </>
                                )
                            })}
                    </tbody>
                </table>
                {arrBanners <= 0 &&
                    <div className='text-center'>Không có dữ liệu biểu ngữ!</div>
                }
            </>
        );
    }

}

const mapStateToProps = state => {
    return {
        listBanners: state.admin.banners
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllBanners: () => dispatch(actions.fetchAllBanners())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageBanner);
