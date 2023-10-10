import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Select from 'react-select';
import * as actions from "../../store/actions";
import HomeFooter from '../HomePage/HomeFooter';
import HomeNav from '../HomePage/HomeNav';
import moment from 'moment';
import "./ListBlogs.scss"
import Lightbox from 'react-image-lightbox';
import { withRouter } from 'react-router';
import { toast } from 'react-toastify';
class ListBlogs extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrBlogs: [],
            isOpen: false,
            selectedSubject: '',
            previewImgURL: '',
            valueSearch: "ALL"
        }
    }
    componentDidMount() {
        window.scrollTo(0, 0)
        this.props.fetchAllBlogs({
            statusId: "S1",
            subjectId: "ALL",
            valueSearch: this.state.valueSearch
        });
        this.props.fetchAllcodeSubjects()
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        window.scrollTo(0, 0)
        if (prevProps.listBlogs !== this.props.listBlogs) {
            this.setState({
                arrBlogs: this.props.listBlogs
            })
        }
        if (prevProps.listSubject !== this.props.listSubject) {
            let { listSubject } = this.props
            listSubject.unshift({
                createdAt: null,
                keyMap: "ALL",
                type: "SUBJECT",
                value: "Tất cả",
            })
            let dataSelectSubject = this.buildDataInputSelect(listSubject)
            this.setState({
                arrSubject: dataSelectSubject,
                selectedSubject: dataSelectSubject.find(item => item.value === "ALL")
            })
        }
    }
    buildDataInputSelect = (inputData) => {
        let result = []
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};
                object.label = item.value
                object.value = item.keyMap;
                result.push(object)
            })
        }
        return result;
    }
    handleOnChangeInput = async (event, id) => {
        if (event.target.value === '') {
            await this.setState({
                valueSearch: "ALL"
            })
            this.props.fetchAllBlogs({
                statusId: "S1",
                subjectId: this.state.selectedSubject ? this.state.selectedSubject.value : "ALL",
                valueSearch: this.state.valueSearch
            })
        } else {
            let copyState = { ...this.state }
            copyState[id] = event.target.value
            this.setState({
                ...copyState
            })
        }
    }
    handleChangeSelect = async (selectedOption, name) => {
        let stateName = name.name;
        let stateCopy = { ...this.state }
        stateCopy[stateName] = selectedOption;
        await this.setState({
            ...stateCopy
        })
        this.props.fetchAllBlogs({
            statusId: "S1",
            subjectId: this.state.selectedSubject ? this.state.selectedSubject.value : "ALL",
            valueSearch: this.state.valueSearch
        });
    }
    openPreviewImage = (url) => {
        this.setState({
            isOpen: true,
            previewImgURL: url
        })
    }
    handleClickViewBlog = (id) => {
        this.props.history.push(`/detail-blog/${id}`)
    }
    handleClickSearch = () => {
        try {
            let { valueSearch } = this.state
            if (valueSearch === '') {
                toast.error("Bạn chưa nhập tên bài đăng!")
            } else {
                this.props.fetchAllBlogs({
                    statusId: "S1",
                    subjectId: this.state.selectedSubject ? this.state.selectedSubject.value : "ALL",
                    valueSearch: this.state.valueSearch
                })
            }
        } catch (error) {
            console.log(error);
        }
    }
    resetFilter = async () => {
        try {
            await this.setState({
                selectedSubject: this.state.arrSubject.find(item => item.value === "ALL"),
                valueSearch: "ALL"
            })
            this.props.fetchAllBlogs({
                statusId: "S1",
                subjectId: "ALL",
                valueSearch: this.state.valueSearch
            })
        } catch (error) {
            console.log(error);
        }
    }
    render() {
        let { arrBlogs, isOpen, selectedSubject, arrSubject, previewImgURL, valueSearch } = this.state
        console.log("check data blog", this.state);
        return (
            <>
                <HomeNav />
                <div className='blog-container'>
                    <div className='blog-nav-left'>
                        <div className='mt-5'>
                            <div className='d-inline-flex' style={{ width: "100%" }}>
                                <input className="input-search form-control mr-sm-3" type="text" placeholder="Nhập tên bài viết cần tìm..." aria-label="Search" size="24"
                                    onChange={(event) => this.handleOnChangeInput(event, "valueSearch")}
                                    value={valueSearch === 'ALL' ? "" : valueSearch}
                                />
                                <button className="btn-search btn btn-outline-info  my-sm-0" type='button'
                                    onClick={() => this.handleClickSearch()}
                                >Tìm kiếm</button>
                            </div>
                        </div>
                        <div className='my-3'>Tìm kiếm theo chủ đề</div>
                        <Select
                            value={selectedSubject}
                            onChange={this.handleChangeSelect}
                            options={arrSubject}
                            name={'selectedSubject'}
                        />
                        <div className='btn-rs-filter'>
                            <button className='reset-filter' onClick={() => this.resetFilter()}>Đặt lại bộ lọc</button>
                        </div>

                    </div>
                    <div className='list-blog'>
                        <div className='item-blog px-3'>
                            {arrBlogs && arrBlogs.length > 0 ?
                                arrBlogs.map((item, index) => {
                                    let date = moment(item.createdAt).utc("+07:00").format("LLLL")
                                    return (
                                        <div className='item-blog-container'>
                                            <div className='item-blog-content'>
                                                <div className='img-blog' style={{ backgroundImage: `url(${item.image})` }}
                                                    onClick={() => this.openPreviewImage(item.image)}
                                                >
                                                </div>
                                                <div className='content-blog'
                                                    onClick={() => this.handleClickViewBlog(item.id)}
                                                >
                                                    <h3 className='title-item-blog'>{item.title}</h3>
                                                    <div className='short-des-blog'>{item.shortDes}</div>
                                                    <div className='date-blog'>{date}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                                :
                                <div className='no-data'>Không có bài đăng bạn tìm kiếm!</div>
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
                <HomeFooter />
            </>
        );
    }

}

const mapStateToProps = state => {
    return {
        listBlogs: state.admin.blogs,
        listSubject: state.admin.subjects
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllBlogs: (data) => dispatch(actions.fetchAllBlogs(data)),
        fetchAllcodeSubjects: () => dispatch(actions.fetchAllcodeSubjects())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListBlogs));
