import {
    ArticleModel
} from '../../models/article.js'

import {
    TopicModel
} from '../../models/topic.js'

const Article = new ArticleModel();
const Topic = new TopicModel();

Page({

    data: {
        currentTab: 1,
        tabInfo: ['关注', '推荐', '广场'],
        articleFollowList: [],
        articleRecommendList: [],
        articleUpdateList: [],
        topicList: [],
        pageIndex: 1,
        isAll: false,
        loading: false,
        swiperFollowHeight: 1200,
        swiperRecommendHeight: 1200,
        swiperUpdateHeight: 1200,
        isFirst: true,
        articleResult: false,
        articleID: 0
    },

    onShow: function(options) {
        this.getFollowedTopic();
        this.getRecommend();
    },

    onTopic(event) {
        let topicID = event.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/topic/topic?id=' + topicID
        })
    },

    onAllTopic(event) {
        wx.navigateTo({
            url: '/pages/user-topic/user-topic'
        })
    },


    getFollowedTopic(event) {
        Topic.getFollowedTopic().then(res => {
            this.setData({
                topicList: res
            })
        })
    },

    getFollow: function() {
        this.getArticle('Follow');
    },

    getRecommend: function() {
        this.getArticle('Recommend');
    },

    getUpdate: function() {
        this.getArticle('Update');
    },

    getArticle: function(typeName) {
        if (this.isLocked()) {
            return
        }
        if (!this.data.isAll) {
            this.locked();
            if (typeName == 'Recommend') {
                this.getSwiperRecommendHeight();
                Article.getRecommendArticle(this.data.pageIndex, 6).then(res => {
                    this.setArticleInfo(res, typeName);
                })
            } else if (typeName == 'Update') {
                this.getSwiperUpdateHeight();
                Article.getUpdateArticle(this.data.pageIndex, 6).then(res => {
                    this.setArticleInfo(res, typeName);
                })
            } else if (typeName == 'Follow') {
                this.getSwiperFollowHeight();
                Article.getFollowArticle(this.data.pageIndex, 6).then(res => {
                    this.setArticleInfo(res, typeName);
                })
            }
        }
    },

    setArticleInfo(res, typeName) {
        if (res.data.length > 0) {
            if (typeName == 'Recommend') {
                this.data.articleRecommendList.push.apply(this.data.articleRecommendList, res.data);
                this.setData({
                    articleRecommendList: this.data.articleRecommendList,
                    isFirst: false,
                    articleResult: true
                })
                this.getSwiperRecommendHeight();
            } else if (typeName == 'Follow') {
                this.data.articleFollowList.push.apply(this.data.articleFollowList, res.data);
                this.setData({
                    articleFollowList: this.data.articleFollowList,
                    isFirst: false,
                    articleResult: true
                })
                this.getSwiperFollowHeight();
            } else if (typeName == 'Update') {
                this.data.articleUpdateList.push.apply(this.data.articleUpdateList, res.data);
                this.setData({
                    articleUpdateList: this.data.articleUpdateList,
                    isFirst: false,
                    articleResult: true
                })
                this.getSwiperUpdateHeight();
            }
        } else {
            this.data.isAll = true;
            this.data.pageIndex = 1;
            this.setData({
                articleResult: true
            })
        }
        this.unLocked();
        this.data.pageIndex++;
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

    getSwiperRecommendHeight() {
        const query = wx.createSelectorQuery()
        query.select('.item-container-recommend').boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec(res => {
            this.setData({
                swiperRecommendHeight: res[0].height
            })
        })
    },

    getSwiperUpdateHeight() {
        const query = wx.createSelectorQuery()
        query.select('.item-container-update').boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec(res => {
            this.setData({
                swiperUpdateHeight: res[0].height
            })
        })
    },

    swiperTab: function(event) {
        let currentTab = event.detail.current;
        this.setData({
            currentTab: currentTab,
            articleFollowList: [],
            articleRecommendList: [],
            articleUpdateList: [],
            topicList: [],
            pageIndex: 1,
            isAll: false,
            articleResult: false
        });
        if (currentTab == 0) {
            this.getFollow();
        } else if (currentTab == 1) {
            this.getRecommend();
        } else if (currentTab == 2) {
            this.getUpdate();
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

    onShare(event) {
        let id = event.detail.id;
        this.data.articleID = id;
        this.onShareAppMessage(id);
    },

    onArticle(event) {
        let id = event.detail.id;
        let articleList = [];
        if (this.data.currentTab == 0) {
            articleList = this.data.articleFollowList;
        } else if (this.data.currentTab == 1) {
            articleList = this.data.articleRecommendList;
        } else if (this.data.currentTab == 2) {
            articleList = this.data.articleUpdateList;
        }
        for (let i = 0; i < articleList.length; i++) {
            if (articleList[i].id == id) {
                if (articleList[i].type == 'Daily') {
                    wx.navigateTo({
                        url: '/pages/daily/daily?id=' + id
                    })
                } else if (articleList[i].type == 'Video') {
                    wx.navigateTo({
                        url: '/pages/video/video?id=' + id
                    })
                } else if (articleList[i].type == 'Photo') {
                    wx.navigateTo({
                        url: '/pages/photo/photo?id=' + id
                    })
                }
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

    onReachBottom: function() {
        if (this.data.currentTab == 0) {
            this.getFollow();
        } else if (this.data.currentTab == 1) {
            this.getRecommend();
        } else if (this.data.currentTab == 2) {
            this.getUpdate();
        }
    },

    onPullDownRefresh: function() {
        wx.showNavigationBarLoading()
        this.setData({
            articleFollowList: [],
            articleRecommendList: [],
            articleUpdateList: [],
            topicList: [],
            pageIndex: 1,
            isAll: false,
            loading: false,
            isFirst: true,
            articleResult: false
        })
        if (this.data.currentTab == 0) {
            this.getFollow();
        } else if (this.data.currentTab == 1) {
            this.getFollowedTopic();
            this.getRecommend();
        } else if (this.data.currentTab == 2) {
            this.getUpdate();
        }
        setTimeout(function() {
            wx.hideNavigationBarLoading()
            wx.stopPullDownRefresh()
            wx.showToast({
                title: '刷新成功',
                mask: true
            })
        }, 1000);
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
            }
        }
        return {
            title: '分享给你',
            path: '/page/home/home'
        }
    }
})