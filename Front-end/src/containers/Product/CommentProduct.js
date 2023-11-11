import React, { Component } from 'react';
import Lightbox from 'react-image-lightbox';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { createNewCommentService, deleteCommentService, replyComment } from '../../services/userService';
import * as actions from "../../store/actions";
import { CommonUtils } from '../../utils';
import { emitter } from '../../utils/emitter';
import CommentModal from './CommentModal';
import "./CommentProduct.scss"
class CommentProduct extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeStar: '',
            previewImgURL: '',
            image: '',
            content: '',
            dataComment: [],
            countStar: {},
            isOpen: false,
            isOpenModal: false,
            parentId: '',
            previewImgSendComment: '',
            dataOrder: ''
        }
    }
    async componentDidMount() {

    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.dataCommentProduct !== this.props.dataCommentProduct) {
            this.loadAllComment(this.props.dataCommentProduct)
        }
    }
    loadAllComment = async (data) => {
        let count5 = data.filter(item => item.star === 5)
        let count4 = data.filter(item => item.star === 4)
        let count3 = data.filter(item => item.star === 3)
        let count2 = data.filter(item => item.star === 2)
        let count1 = data.filter(item => item.star === 1)
        await this.setState({
            dataComment: data,
            countStar: {
                star5: count5.length,
                star4: count4.length,
                star3: count3.length,
                star2: count2.length,
                star1: count1.length,
                average: ((count5.length * 5) + (count4.length * 4) + (count3.length * 3) + (count2.length * 2) + (count1.length * 1)) / (count5.length + count4.length + count3.length + count2.length + count1.length),
                quantity: count5.length + count4.length + count3.length + count2.length + count1.length
            },
            content: '',
            image: '',
            previewImgURL: '',
            activeStar: '',
            previewImgSendComment: '',
            isOpenModal: false
        })
    }

    handleChooseStart = (number) => {
        let copyState = this.state;
        copyState.activeStar = number
        this.setState({
            ...copyState
        })
    }
    openPreviewImage = (url) => {
        this.setState({
            isOpen: true,
            previewImgURL: url
        })
    }
    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file)
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewImgSendComment: objectUrl,
                image: base64
            })
        }
    }
    handleOnChange = event => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        })

    };
    handleSaveComment = async () => {
        try {
            let { activeStar, content, image } = this.state
            let { productId, userInfo } = this.props
            if (!activeStar && !content) {
                toast.error(<FormattedMessage id={"comment.no-data"} />)
                this.props.fetchAllCommentByProductIdRedux(productId)
                return;
            }
            if (!activeStar) toast.error(<FormattedMessage id={"comment.no-star"} />)
            else if (!content) toast.error(<FormattedMessage id={"comment.no-content"} />)
            else {
                let response = await createNewCommentService({
                    productId: productId,
                    content: content,
                    image: image,
                    userId: userInfo.id,
                    star: activeStar
                })
                if (response && response.errCode === 0) {
                    toast.success(<FormattedMessage id={"comment.cmt-success"} />)
                    this.props.fetchAllCommentByProductIdRedux(productId)
                } else {
                    toast.error(response.errMessage)
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
    handleOpenModal = (id) => {
        this.setState({
            parentId: id
        })
        this.toggleCommentModal()
    }
    toggleCommentModal = () => {
        this.setState({
            isOpenModal: !this.state.isOpenModal
        })
        emitter.emit('EVENT_CLEAR_MODAL_DATA')
    }
    sendDataFromModalComment = async (content) => {
        try {
            let { parentId } = this.state
            let { productId, userInfo } = this.props
            let res = await replyComment({
                content: content,
                productId: productId,
                userId: userInfo.id,
                parentId: parentId
            })
            if (res && res.errCode === 0) {
                toast.success(<FormattedMessage id={"comment.reply-success"} />);
                this.props.fetchAllCommentByProductIdRedux(productId)
                emitter.emit('EVENT_CLEAR_MODAL_DATA')
            } else {
                toast.success(<FormattedMessage id={"comment.reply-fail"} />);
            }
        } catch (error) {
            console.log(error);
        }
    }
    handleDeleteReply = async (id) => {
        try {
            let { productId } = this.props
            let res = await deleteCommentService(id)
            if (res && res.errCode === 0) {
                toast.success(<FormattedMessage id={"comment.dlt-reply"} />)
                this.props.fetchAllCommentByProductIdRedux(productId)
            } else {
                toast.error(res.errMessage)
            }
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        let { activeStar, previewImgURL, content, dataComment, countStar, isOpen, isOpenModal, previewImgSendComment } = this.state
        let { userInfo, dataOrder, productId } = this.props
        console.log("check props : ", this.props);
        return (
            <div className="row">
                <div className="col-lg-12">
                    <div className="row total_rate">
                        <div className="col-6">
                            <div className="box_total">
                                <h5>Trung bình đánh giá</h5>
                                <h4>{countStar.average ? Math.round(countStar.average * 10) / 10 : 0}/5</h4>
                                <h6>({countStar.quantity} lượt đánh giá)</h6>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="rating_list">
                                <h3>{countStar.quantity} lượt đánh giá</h3>
                                <ul className="list">
                                    <li>
                                        <a href="#">
                                            <i className="fa fa-star" />
                                            <i className="fa fa-star" />
                                            <i className="fa fa-star" />
                                            <i className="fa fa-star" />
                                            <i className="fa fa-star" /> Có {countStar.star5} lượt đánh giá</a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <i className="fa fa-star" />
                                            <i className="fa fa-star" />
                                            <i className="fa fa-star" />
                                            <i className="fa fa-star" /> Có {countStar.star4} lượt đánh giá</a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <i className="fa fa-star" />
                                            <i className="fa fa-star" />
                                            <i className="fa fa-star" /> Có {countStar.star3} lượt đánh giá</a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <i className="fa fa-star" />
                                            <i className="fa fa-star" /> Có {countStar.star2} lượt đánh giá</a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <i className="fa fa-star" /> Có {countStar.star1} lượt đánh giá</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="review_list">
                        {
                            userInfo &&
                            <div className="review_item">
                                <div className="form-group">
                                    <label style={{ color: '#333', fontSize: '16px', fontWeight: '600' }}>Viết đánh giá của bạn</label>
                                    <textarea name="content" value={content} onChange={(event) => this.handleOnChange(event)} rows="3" className="form-control"></textarea>
                                </div>
                                <div className="content-review">
                                    <div className="content-left">
                                        <label style={{ marginBottom: '0', cursor: 'pointer' }} htmlFor="cmtImg"><i className="fas fa-camera" ></i></label>
                                        <input type="file" id="cmtImg"
                                            hidden onChange={(event) => this.handleOnChangeImage(event)}
                                        />
                                        <div className={activeStar === 1 ? 'box-star active' : 'box-star'} onClick={() => this.handleChooseStart(1)}><i className="fa fa-star" /></div>
                                        <div className={activeStar === 2 ? 'box-star active' : 'box-star'} onClick={() => this.handleChooseStart(2)} ><i className="fa fa-star" /><i className="fa fa-star" /></div>
                                        <div className={activeStar === 3 ? 'box-star active' : 'box-star'} onClick={() => this.handleChooseStart(3)}><i className="fa fa-star" /><i className="fa fa-star" /><i className="fa fa-star" /></div>
                                        <div className={activeStar === 4 ? 'box-star active' : 'box-star'} onClick={() => this.handleChooseStart(4)}><i className="fa fa-star" /><i className="fa fa-star" /><i className="fa fa-star" /><i className="fa fa-star" /></div>
                                        <div className={activeStar === 5 ? 'box-star active' : 'box-star'} onClick={() => this.handleChooseStart(5)}><i className="fa fa-star" /><i className="fa fa-star" /><i className="fa fa-star" /><i className="fa fa-star" /><i className="fa fa-star" /></div>
                                    </div>
                                    <div className="content-right">
                                        <button onClick={() => this.handleSaveComment()} className="btn btn-primary px-3">Gửi đánh giá</button>
                                    </div>
                                </div>
                                <div style={{ backgroundImage: `url(${previewImgSendComment})` }} className="preview-cmt-img">
                                </div>
                            </div>
                        }
                        <div className='item-comment'>
                            {dataComment && dataComment.length > 0 &&
                                dataComment.map((item, index) => {
                                    if (!item.parentId) {
                                        let name = `${item.userCommentData.lastName ? item.userCommentData.lastName : ''} ${item.userCommentData.firstName ? item.userCommentData.firstName : ''} `
                                        let arrStar = []
                                        for (let i = 0; i < item.star; i++) {
                                            arrStar[i] = 1
                                        }
                                        return (
                                            <div key={index} className="review_item">
                                                <div className="media">
                                                    <div className="d-flex">
                                                        <img className="img-avatar" src={item.userCommentData.image ? item.userCommentData.image : 'https://www.seekpng.com/png/detail/428-4287240_no-avatar-user-circle-icon-png.png'} alt="" />
                                                    </div>
                                                    <div className="media-body">
                                                        <h4>{name}</h4>
                                                        <div className='star-comment'>
                                                            <div className='star-box'>
                                                                {arrStar && arrStar.length > 0 &&
                                                                    arrStar.map((item, index) => {
                                                                        return (
                                                                            <i key={index} className="fa fa-star" />
                                                                        )
                                                                    })
                                                                }
                                                            </div>
                                                            {userInfo && userInfo.roleId === "R1" && item.childComment.length <= 0 &&
                                                                <button onClick={() => this.handleOpenModal(item.id)} className="reply_btn" >Phản hồi</button>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ marginLeft: '88px' }}>
                                                    <p style={{ paddingTop: '0px' }}>
                                                        {item.content}
                                                    </p>
                                                    {item.image &&
                                                        <img onClick={() => this.openPreviewImage(item.image)} className="img-cmt " src={item.image}></img>
                                                    }
                                                    {item.childComment && item.childComment.length > 0 &&
                                                        item.childComment.map((item, index) => {
                                                            return (
                                                                <div key={index} className="box-reply">
                                                                    <span>Phản hồi của người bán</span>
                                                                    <p>{item.content}</p>
                                                                    {userInfo && userInfo.roleId === "R1" &&
                                                                        <button onClick={() => this.handleDeleteReply(item.id)} className="btn-delete-reply" type="button">Xóa phản hồi</button>
                                                                    }
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        )
                                    }
                                })
                            }
                        </div>
                    </div>
                </div>
                {
                    isOpen === true &&
                    <Lightbox
                        mainSrc={previewImgURL}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                    />
                }
                {/* <div className='text-lg font-weight-bold font-italic'>Bình luận qua facebook</div> */}
                <CommentModal
                    isOpen={isOpenModal}
                    toggleFromParent={this.toggleCommentModal}
                    sendDataFromModalComment={this.sendDataFromModalComment}
                />
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
        fetchAllCommentByProductIdRedux: (id) => dispatch(actions.fetchAllCommentByProductId(id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CommentProduct);
