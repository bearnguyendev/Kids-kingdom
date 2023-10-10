import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import * as actions from "../../../store/actions"
import Slider from "react-slick";
import { LIMIT } from '../../../utils';
import { withRouter } from 'react-router';
class Blog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arrBlogs: [],
        }
    }
    componentDidMount() {
        this.props.loadListBlogs(LIMIT)
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listBlogRedux !== this.props.listBlogRedux) {
            this.setState({
                arrBlogs: this.props.listBlogRedux
            })
        }
    }
    handleViewDetailBlog = (id) => {
        this.props.history.push(`/detail-blog/${id}`)
    }
    handleViewAllBlogs = () => {
        this.props.history.push(`/blog`)
    }
    render() {
        let { arrBlogs } = this.state
        return (
            <div className='section-share section-blog'>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'><FormattedMessage id={"home-page.blog"} />
                        </span>
                        <button className='btn-section' onClick={() => this.handleViewAllBlogs()}><FormattedMessage id={"home-page.more-infor"} /></button>
                    </div>
                    <div className='section-body'>
                        <Slider {...this.props.settings}>
                            {arrBlogs && arrBlogs.length > 0 &&
                                arrBlogs.map((item, index) => {
                                    return (
                                        <div className='section-customize' key={index}
                                            onClick={() => this.handleViewDetailBlog(item.id)}
                                        >
                                            <div className='customize-border'>
                                                <div className='outer-bg'>
                                                    <div className='bg-image section-blog'
                                                        style={{ backgroundImage: `url(${item.image})` }}
                                                    >
                                                    </div>
                                                </div>
                                                <div className='blog-name'>
                                                    <div className='title-blog-name'>{item.title}</div>
                                                    <div className='short-des-blog'>{item.shortDes}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                        </Slider>
                    </div>
                </div>

            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        listBlogRedux: state.admin.listBlogs,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loadListBlogs: (limit) => dispatch(actions.fetchListBlogs(limit))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Blog));
