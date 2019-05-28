import {
    SearchModel
} from '../../models/search.js'

import {
    UserModel
} from '../../models/user.js'

const Search = new SearchModel();
const User = new UserModel();

Page({

    data: {
        currentTab: 0,
        tabInfo: ['内容', '话题', '主题', '用户'],
        name: '',
        pageIndex: 1,
        isAll: false,
        loading: false,
        searchResult: false,
        articleList: [],
        questionList: [],
        topicList: [],
        userList: [],
        swiperArticleHeight: 400,
        swiperQuestionHeight: 400,
        swiperTopicHeight: 400,
        swiperUserHeight: 400,
    },

    onLoad: function(options) {

    },

    onUser(event) {
        let userID = event.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/user-detail/user-detail?id=' + userID
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
        for (let i = 0; i < this.data.articleList.length; i++) {
            if (this.data.articleList[i].id == id) {
                if (this.data.articleList[i].type == 'Daily') {
                    wx.navigateTo({
                        url: '/pages/daily/daily?id=' + id
                    })
                } else if (this.data.articleList[i].type == 'Video') {
                    wx.navigateTo({
                        url: '/pages/video/video?id=' + id
                    })
                } else if (this.data.articleList[i].type == 'Photo') {
                    wx.navigateTo({
                        url: '/pages/photo/photo?id=' + id
                    })
                }
            }
        }
    },

    onDelete(event) {
        this.setData({
            name: ''
        })
    },


    onCancel(event) {
        this.setData({
            name: ''
        })
        this.init();
    },

    onConfirm: function(event) {
        let name = event.detail.value;
        this.setData({
            name: name
        })
        if (name) {
            this.init();
            if (this.data.currentTab == 0) {
                this.searchArticle(name);
            } else if (this.data.currentTab == 1) {
                this.searchQuestion(name);
            } else if (this.data.currentTab == 2) {
                this.searchTopic(name);
            } else if (this.data.currentTab == 3) {
                this.searchUser(name);
            }
        } else {
            this.data.search = false;
            this.data.pageIndex = 1;
            this.data.topicInfo = [];
            this.setData({
                search: false
            })
            this.getTopic();
        }
    },

    followUser(event) {
        let behaviour = event.currentTarget.dataset.behaviour;
        let id = event.currentTarget.dataset.id;
        let index = event.currentTarget.dataset.index;
        let temp = "userList[" + index + "].isFollow";
        let value = !this.data.userList[index].isFollow;
        this.setData({
            [temp]: value
        })
        User.followUser(id, behaviour);
    },

    searchArticle(name) {
        if (this.isLocked()) {
            return
        }
        if (!this.data.isAll) {
            this.locked();
            this.getSwiperArticleHeight();
            Search.searchArticle(name, this.data.pageIndex, 8).then(res => {
                if (res.data.length > 0) {
                    this.data.articleList.push.apply(this.data.articleList, res.data);
                    this.setData({
                        articleList: this.data.articleList,
                        searchResult: true
                    })
                    // storage.put('topic', this.data.topicInfo, 600)
                } else {
                    this.setData({
                        isAll: true,
                        searchResult: true
                    })
                    this.data.isAll = true;
                    this.data.pageIndex = 0;
                    // storage.put('topicNum', this.data.topicInfo.length, 600);
                }
                this.unLocked();
                this.data.pageIndex++;
                this.getSwiperArticleHeight();
            })
        }
    },

    searchQuestion(name) {
        if (this.isLocked()) {
            return
        }
        if (!this.data.isAll) {
            this.locked();
            this.getSwiperQuestionHeight();
            Search.searchQuestion(name, this.data.pageIndex, 6).then(res => {
                if (res.data.length > 0) {
                    this.data.questionList.push.apply(this.data.questionList, res.data);
                    this.setData({
                        questionList: this.data.questionList,
                        searchResult: true
                    })
                    // storage.put('topic', this.data.topicInfo, 600)
                } else {
                    this.setData({
                        isAll: true,
                        searchResult: true
                    })
                    this.data.isAll = true;
                    this.data.pageIndex = 0;
                    // storage.put('topicNum', this.data.topicInfo.length, 600);
                }
                this.unLocked();
                this.data.pageIndex++;
                this.getSwiperQuestionHeight();
            })
        }
    },

    searchTopic(name) {
        if (this.isLocked()) {
            return
        }
        if (!this.data.isAll) {
            this.locked();
            this.getSwiperTopicHeight();
            Search.searchTopic(name, this.data.pageIndex, 8).then(res => {
                if (res.data.length > 0) {
                    this.data.topicList.push.apply(this.data.topicList, res.data);
                    this.setData({
                        topicList: this.data.topicList,
                        searchResult: true
                    })
                    // storage.put('topic', this.data.topicInfo, 600)
                } else {
                    this.setData({
                        isAll: true,
                        searchResult: true
                    })
                    this.data.isAll = true;
                    this.data.pageIndex = 0;
                    // storage.put('topicNum', this.data.topicInfo.length, 600);
                }
                this.unLocked();
                this.data.pageIndex++;
                this.getSwiperTopicHeight();
            })
        }
    },

    searchUser(name) {
        if (this.isLocked()) {
            return
        }
        if (!this.data.isAll) {
            this.locked();
            this.getSwiperUserHeight();
            Search.searchUser(name, this.data.pageIndex, 8).then(res => {
                if (res.data.length > 0) {
                    this.data.userList.push.apply(this.data.userList, res.data);
                    this.setData({
                        userList: this.data.userList,
                        searchResult: true
                    })
                    // storage.put('topic', this.data.topicInfo, 600)
                } else {
                    this.setData({
                        isAll: true,
                        searchResult: true
                    })
                    this.data.isAll = true;
                    this.data.pageIndex = 0;
                    // storage.put('topicNum', this.data.topicInfo.length, 600);
                }
                this.unLocked();
                this.data.pageIndex++;
                this.getSwiperTopicHeight();
            })
        }
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

    getSwiperQuestionHeight() {
        const query = wx.createSelectorQuery()
        query.select('.item-container-question').boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec(res => {
            this.setData({
                swiperQuestionHeight: res[0].height
            })
        })
    },

    getSwiperTopicHeight() {
        const query = wx.createSelectorQuery()
        query.select('.item-container-topic').boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec(res => {
            this.setData({
                swiperTopicHeight: res[0].height
            })
        })
    },

    getSwiperUserHeight() {
        const query = wx.createSelectorQuery()
        query.select('.item-container-user').boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec(res => {
            this.setData({
                swiperUserHeight: res[0].height
            })
        })
    },

    swiperTab: function(event) {
        let currentTab = event.detail.current;
        this.setData({
            currentTab: currentTab,
            pageIndex: 1,
            searchResult: false,
            isAll: false,
            loading: false,
            articleList: [],
            questionList: [],
            topicList: [],
            userList: [],
        });
        if (currentTab == 0) {
            if (this.data.name != '') {
                this.searchArticle(this.data.name)
            }
        } else if (currentTab == 1) {
            if (this.data.name != '') {
                this.searchQuestion(this.data.name)
            }
        } else if (currentTab == 2) {
            if (this.data.name != '') {
                this.searchTopic(this.data.name)
            }
        } else if (currentTab == 3) {
            if (this.data.name != '') {
                this.searchUser(this.data.name)
            }
        }
    },

    clickTab: function(e) {
        if (this.data.currentTab === e.target.dataset.current) {
            return false;
        } else {
            this.setData({
                currentTab: e.target.dataset.current
            })
        }
    },

    init() {
        this.setData({
            pageIndex: 1,
            searchResult: false,
            isAll: false,
            loading: false,
            articleList: [],
            questionList: [],
            topicList: [],
            userList: [],
        });
    },

    isLocked() {
        return this.data.loading ? true : false;
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

    onPullDownRefresh: function() {
        wx.showNavigationBarLoading();
        this.init();
        if (this.data.currentTab == 0) {
            if (this.data.name != '') {
                this.searchArticle(this.data.name);
            }
        } else if (this.data.currentTab == 1) {
            if (this.data.name != '') {
                this.searchQuestion(this.data.name);
            }
        } else if (this.data.currentTab == 2) {
            if (this.data.name != '') {
                this.searchTopic(this.data.name);
            }
        } else if (this.data.currentTab == 3) {
            if (this.data.name != '') {
                this.searchUser(this.data.name);
            }
        }
        setTimeout(function() {
            wx.showToast({
                title: '刷新成功',
                icon: 'success',
                duration: 1500,
                mask: false,
            })
            wx.hideNavigationBarLoading();
            wx.stopPullDownRefresh();
        }, 1000);
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        if (this.data.currentTab == 0) {
            if (this.data.name != '') {
                this.searchArticle(this.data.name);
            }
        } else if (this.data.currentTab == 1) {
            if (this.data.name != '') {
                this.searchQuestion(this.data.name);
            }
        } else if (this.data.currentTab == 2) {
            if (this.data.name != '') {
                this.searchTopic(this.data.name);
            }
        } else if (this.data.currentTab == 3) {
            if (this.data.name != '') {
                this.searchUser(this.data.name);
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
    }
})