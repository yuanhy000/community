import {
    UserModel
} from '../../models/user.js'
const User = new UserModel();
Page({
    data: {
        authorized: false,
        userInfo: null,
        userDetail: null,
        userID: 0,
        userInfo: [],
        tabInfo: ['发布', '关注'],
        subTabArticleInfo: ['日常', '摄影', '视频', '话题'],
        subTabFollowInfo: ['主题', '话题', '用户', '粉丝'],
        currentTab: 0,
        currentArticleSubTab: 0,
        currentFollowSubTab: 0,
        dailyList: [],
        photoList: [],
        videoList: [],
        answerList: [],
        topicList: [],
        questionList: [],
        userList: [],
        fansList: [],
        pageIndex: 1,
        isAll: false,
        loading: false,
        articleResult: false,
        followResult: false,
        swiperArticleHeight: 400,
        swiperFollowHeight: 400,
        userHeight: 420,
        scroll_top: 0
    },
    onLoad: function(options) {
        this.userAuthorized();
        this.getUserInfoFromSever();
    },
    onGetUserInfo(event) {
        const userInfo = event.detail.userInfo
        console.log(userInfo)
        if (userInfo) {
            this.setData({
                userInfo: userInfo,
                authorized: true,
            })
            console.log(userInfo)
            User.submitUserInfo({
                nickName: userInfo.nickName,
                avatarUrl: userInfo.avatarUrl,
                sex: userInfo.gender
            }).then(res => {
                this.getUserInfoFromSever();
            });
            this.getUserInfoFromSever();
        }
    },
    getUserInfoFromSever() {
        User.getUserInfo().then(res => {
            console.log(res);
            this.setData({
                userDetail: res,
                userID: res.id
            })
            this.getArticle('Daily', res.id);
            this.getUserHeight();
        })
    },
    userAuthorized() {
        wx.getSetting({
            success: data => {
                if (data.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        success: data => {
                            this.setData({
                                authorized: true,
                                userInfo: data.userInfo
                            })
                        }
                    })
                }
            }
        })
    },
    onPageScroll: function(e) {
        this.setData({
            'scroll_top': e.scrollTop
        })
    },
    onAnswerDetail(event) {
        let id = event.detail.id;
        wx.navigateTo({
            url: '/pages/answer/answer?id=' + id
        })
    },
    onTopic(event) {
        let topicID = event.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/topic/topic?id=' + topicID
        })
    },
    onArticle(event) {
        let id = event.detail.id;
        let type = event.currentTarget.dataset.type;
        if (type == 'Daily') {
            wx.navigateTo({
                url: '/pages/daily/daily?id=' + id
            })
        } else if (type == 'Video') {
            wx.navigateTo({
                url: '/pages/video/video?id=' + id
            })
        } else if (type == 'Photo') {
            wx.navigateTo({
                url: '/pages/photo/photo?id=' + id
            })
        }
    },
    onUser(event) {
        let userID = event.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/user-detail/user-detail?id=' + userID
        })
    },
    getUserHeight() {
        const query = wx.createSelectorQuery()
        query.select('.head-container').boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec(res => {
            this.setData({
                userHeight: res[0].height
            })
        })
    },
    getUserInfo(userID) {
        User.getUserByID(userID).then(res => {
            this.setData({
                userInfo: res
            })
        })
    },
    getArticle: function(typeName, topicID) {
        if (this.isLocked()) {
            return
        }
        if (!this.data.isAll) {
            this.locked();
            this.getSwiperArticleHeight();
            if (typeName == 'Daily') {
                User.getUserArticle(this.data.userID, 'Daily', this.data.pageIndex, 6).then(res => {
                    this.setArticleInfo(res, 'Daily');
                })
            } else if (typeName == 'Photo') {
                User.getUserArticle(this.data.userID, 'Photo', this.data.pageIndex, 6).then(res => {
                    this.setArticleInfo(res, 'Photo');
                })
            } else if (typeName == 'Video') {
                User.getUserArticle(this.data.userID, 'Video', this.data.pageIndex, 6).then(res => {
                    this.setArticleInfo(res, 'Video');
                })
            } else if (typeName == 'Question') {
                User.getUserQuestion(this.data.userID, this.data.pageIndex, 6).then(res => {
                    this.setArticleInfo(res, 'Question');
                })
            }
        }
    },
    getFollow: function(typeName, topicID) {
        if (this.isLocked()) {
            return
        }
        if (!this.data.isAll) {
            this.locked();
            this.getSwiperFollowHeight();
            if (typeName == 'Topic') {
                User.getUserFollowTopic(this.data.userID).then(res => {
                    this.setFollowInfo(res, 'Topic');
                })
            } else if (typeName == 'Question') {
                User.getUserFollowQuestion(this.data.userID, this.data.pageIndex, 6).then(res => {
                    this.setFollowInfo(res, 'Question');
                })
            } else if (typeName == 'User') {
                User.getUserFollowUser(this.data.userID, this.data.pageIndex, 10).then(res => {
                    this.setFollowInfo(res, 'User');
                })
            } else if (typeName == 'Fans') {
                User.getUserFans(this.data.userID, this.data.pageIndex, 10).then(res => {
                    this.setFollowInfo(res, 'Fans');
                })
            }
        }
    },
    setArticleInfo(res, type) {
        if (res.data.length > 0) {
            if (type == 'Daily') {
                this.data.dailyList.push.apply(this.data.dailyList, res.data);
                this.setData({
                    dailyList: this.data.dailyList,
                    isFirst: false,
                    articleResult: true
                })
            } else if (type == 'Photo') {
                this.data.photoList.push.apply(this.data.photoList, res.data);
                this.setData({
                    photoList: this.data.photoList,
                    isFirst: false,
                    articleResult: true
                })
            } else if (type == 'Video') {
                this.data.videoList.push.apply(this.data.videoList, res.data);
                this.setData({
                    videoList: this.data.videoList,
                    isFirst: false,
                    articleResult: true
                })
            } else if (type == 'Question') {
                this.data.answerList.push.apply(this.data.answerList, res.data);
                this.setData({
                    answerList: this.data.answerList,
                    isFirst: false,
                    articleResult: true
                })
            }
        } else {
            this.data.isAll = true;
            this.data.pageIndex = 1;
            this.setData({
                articleResult: true
            })
        }
        this.unLocked();
        this.getSwiperArticleHeight();
        this.data.pageIndex++;
    },
    setFollowInfo(res, type) {
        if (res.data.length > 0) {
            if (type == 'Topic') {
                this.data.topicList.push.apply(this.data.topicList, res.data);
                this.setData({
                    topicList: this.data.topicList,
                    isFirst: false,
                    articleResult: true
                })
            } else if (type == 'Question') {
                this.data.questionList.push.apply(this.data.questionList, res.data);
                this.setData({
                    questionList: this.data.questionList,
                    isFirst: false,
                    articleResult: true
                })
            } else if (type == 'User') {
                this.data.userList.push.apply(this.data.userList, res.data);
                this.setData({
                    userList: this.data.userList,
                    isFirst: false,
                    articleResult: true
                })
            } else if (type == 'Fans') {
                this.data.fansList.push.apply(this.data.fansList, res.data);
                this.setData({
                    fansList: this.data.fansList,
                    isFirst: false,
                    articleResult: true
                })
            }
        } else {
            this.data.isAll = true;
            this.data.pageIndex = 1;
            this.setData({
                articleResult: true
            })
        }
        this.unLocked();
        this.getSwiperFollowHeight();
        this.data.pageIndex++;
    },
    getSwiperArticleHeight() {
        const query = wx.createSelectorQuery()
        query.select('.item-container-article').boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec(res => {
            this.setData({
                swiperArticleHeight: res[0].height
            })
        })
    },
    getSwiperFollowHeight() {
        const query = wx.createSelectorQuery()
        query.select('.item-container-follow').boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec(res => {
            this.setData({
                swiperFollowHeight: res[0].height
            })
        })
    },
    swiperTab: function(event) {
        let currentTab = event.detail.current;
        this.setData({
            currentTab: currentTab,
            articleResult: false
        });
        if (currentTab == 0) {
            this.getArticle('Daily', this.data.userID);
        } else if (currentTab == 1) {
            this.getFollow('Topic', this.data.userID);
        }
    },
    clickTab: function(event) {
        if (this.data.currentTab === event.target.dataset.current) {
            return false;
        } else {
            this.setData({
                currentTab: event.target.dataset.current
            })
        }
    },
    clickArticleSubTab: function(event) {
        let currentTab = event.target.dataset.current;
        if (this.data.currentArticleSubTab === currentTab) {
            return false;
        } else {
            this.setData({
                currentArticleSubTab: currentTab,
                dailyList: [],
                photoList: [],
                videoList: [],
                answerList: [],
                pageIndex: 1,
                isAll: false,
                loading: false,
                articleResult: false
            })
            if (currentTab == 0) {
                this.getArticle('Daily', this.data.userID);
            } else if (currentTab == 1) {
                this.getArticle('Photo', this.data.userID);
            } else if (currentTab == 2) {
                this.getArticle('Video', this.data.userID);
            } else if (currentTab == 3) {
                this.getArticle('Question', this.data.userID);
            }
        }
    },
    clickFollowSubTab: function(event) {
        let currentTab = event.target.dataset.current;
        if (this.data.currentFollowSubTab === currentTab) {
            return false;
        } else {
            this.setData({
                currentFollowSubTab: currentTab,
                topicList: [],
                questionList: [],
                userList: [],
                fansList: [],
                pageIndex: 1,
                isAll: false,
                loading: false,
                followResult: false,
                articleResult: false
            })
            if (currentTab == 0) {
                this.getFollow('Topic', this.data.userID);
            } else if (currentTab == 1) {
                this.getFollow('Question', this.data.userID);
            } else if (currentTab == 2) {
                this.getFollow('User', this.data.userID);
            } else if (currentTab == 3) {
                this.getFollow('Fans', this.data.userID);
            }
        }
    },
    isLocked() {
        return this.data.loading ? true : false
    },
    locked() {
        this.data.loading = true;
        this.setData({
            loading: true
        })
    },
    unLocked() {
        this.data.loading = false;
        this.setData({
            loading: false
        })
    },
    onPullDownRefresh: function() {},
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        if (this.data.currentTab == 0) {
            if (this.data.currentArticleSubTab == 0) {
                this.getArticle('Daily', this.data.userID);
            } else if (this.data.currentArticleSubTab == 1) {
                this.getArticle('Photo', this.data.userID);
            } else if (this.data.currentArticleSubTab == 2) {
                this.getArticle('Video', this.data.userID);
            } else if (this.data.currentArticleSubTab == 3) {
                this.getArticle('Question', this.data.userID);
            }
        } else if (this.data.currentTab == 1) {
            if (this.data.currentFollowSubTab == 0) {
                // this.getFollow('Topic', this.data.userID);
            } else if (this.data.currentFollowSubTab == 1) {
                this.getFollow('Question', this.data.userID);
            } else if (this.data.currentFollowSubTab == 2) {
                this.getFollow('User', this.data.userID);
            } else if (this.data.currentFollowSubTab == 3) {
                this.getFollow('Fans', this.data.userID);
            }
        }
    },
    onShareAppMessage: function(res) {
        if (res.from === 'button') {
            let articleID = res.target.dataset.articleid;
            let type = res.target.dataset.type;
            if (type == 'Daily') {
                return {
                    title: '前往 id= ' + articleID + ' 的文章',
                    path: '/pages/daily/daily?id=' + articleID
                }
            } else if (type == 'Photo') {
                return {
                    title: '前往 id= ' + articleID + ' 的文章',
                    path: '/pages/photo/photo?id=' + articleID
                }
            } else if (type == 'Video') {
                return {
                    title: '前往 id= ' + articleID + ' 的文章',
                    path: '/pages/video/video?id=' + articleID
                }
            } else if (type == 'answer') {
                return {
                    title: '前往 id= ' + articleID + ' 的回答',
                    path: '/pages/answer/answer?id=' + articleID
                }
            }
        }
        return {
            title: '分享给你',
            path: '/page/user-detail/user-detail?id=' + this.data.articleID
        }
    }
})