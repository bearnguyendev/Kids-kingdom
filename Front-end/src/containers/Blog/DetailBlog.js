import _ from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import LikeAndShare from '../../components/SocialPlugin/LikeAndShare';
import Comment from '../../components/SocialPlugin/Comment';
import { getDetailBlogById } from '../../services/userService';
import * as actions from "../../store/actions";
import HomeFooter from '../HomePage/HomeFooter';
import HomeNav from '../HomePage/HomeNav';
import "./DetailBlog.scss"
class DetailBlog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataBlog: {},
            date: ''
        }
    }
    async componentDidMount() {
        window.scrollTo(0, 0)
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let res = await getDetailBlogById(id)
            if (res && res.errCode === 0) {
                this.setState({
                    dataBlog: res.data
                })
            }
        }

    }
    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    render() {
        let { dataBlog, date } = this.state
        date = moment(dataBlog.updatedAt).utc("+07:00").format("LLLL")
        let currentURL = +process.env.REACT_APP_IS_LOCALHOST === 1 ? "https://bearnguyen-restaurant-bot-tv.herokuapp.com/" : window.location.href;
        return (
            <>
                <HomeNav />
                {dataBlog && !_.isEmpty(dataBlog) &&
                    <div className='container detail-blog'>
                        <div className='title'>{dataBlog.title}</div>
                        <div className='content-blog'>
                            <div className='font-italic text-muted'>{date}</div>
                            <div className='like-share-plugin'>
                                <LikeAndShare
                                    dataHref={currentURL}
                                />
                            </div>
                            <div className='text-info my-3'>Chủ đề: {dataBlog.subjectData.value}</div>
                            <p className='img-detail-blog' style={{ backgroundImage: `url(${dataBlog.image})` }}></p>
                            <div className='description-detail-blog' dangerouslySetInnerHTML={{ __html: dataBlog.contentHTML && dataBlog.contentHTML }}></div>
                        </div>
                        <div className='comment-box'>
                            <Comment
                                dataHref={currentURL}
                                width={"100%"}
                            />
                        </div>
                    </div>
                }
                <HomeFooter />
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailBlog);
