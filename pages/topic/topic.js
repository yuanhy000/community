import {
    TopicModel
} from '../../models/topic.js'

import {
    ArticleModel
} from '../../models/article.js'

const Article = new ArticleModel();
const Topic = new TopicModel();

Page({

    data: {
        topicID: 0,
        topicInfo: [],
        topicHeight: 220,
        scroll_top: 0,
        currentTab: 0,
        tabInfo: ['动态', '话题'],
        pageIndex: 1,
        isAll: false,
        loading: false,
        articleList: [],
        answerList: [],
        swiperHeight: 400,
        swiperAnswerHeight: 400,
    },

    onLoad: function(options) {
        const id = options.id;
        this.data.topicID = id;
        Topic.getTopicById(id).then(res => {
            this.setData({
                topicInfo: res,
            })
            this.getTopicHright();
        })
        // this.getRecommendQuestion(id);
        this.getRecommendArticle(id);
    },

    voteFor(event) {
        let index = event.detail.index;
        let id = event.detail.id;
        for (let i = 0; i < this.data.articleList.length; i++) {
            if (this.data.articleList[i].id == id) {
                let voteValue = !this.data.articleList[i].isVote;
                let voteTemp = "articleList[" + i + "].isVote";
                let likeCounts = this.data.articleList[i].likes + index;
                let likeTrmp = "articleList[" + i + "].likes"
                this.setData({
                    [voteTemp]: voteValue,
                    [likeTrmp]: likeCounts
                })
            }
        }
        Article.voteForArticle(id, index)
    },

    getRecommendArticle(topicID) {
        this.getTopic('Article', topicID);
    },

    getRecommendQuestion(topicID) {
        this.getTopic('Question', topicID);
    },

    getTopic: function(typeName, topicID) {
        if (this.isLocked()) {
            return
        }
        if (!this.data.isAll) {
            this.locked();
            if (!this.data.isFirst) {
                this.getSwiperHright();
            }
            if (typeName == 'Article') {
                Topic.getRecommendArticle(topicID, this.data.pageIndex, 6).then(res => {
                    this.setTopicInfo(res, 'Article');
                })
            } else if (typeName == 'Question') {
                Topic.getRecommendQuestion(topicID, this.data.pageIndex, 6).then(res => {
                    this.setTopicInfo(res, 'Question');
                })
            }
        }
    },

    setTopicInfo(res, type) {
        if (res.data.length > 0) {
            if (type == 'Article') {
                this.data.articleList.push.apply(this.data.articleList, res.data);
                this.setData({
                    articleList: this.data.articleList,
                    isFirst: false
                })
                this.getSwiperHright();
            } else if (type == 'Question') {
                this.data.answerList.push.apply(this.data.answerList, res.data);
                this.setData({
                    answerList: this.data.answerList,
                    isFirst: false
                })
                this.getSwiperAnswerHright();
            }
        } else {
            this.data.isAll = true;
            this.data.pageIndex = 1;
        }
        this.unLocked();
        this.data.pageIndex++;
    },

    followTopic(event) {
        let behaviour = event.currentTarget.dataset.behaviour;
        let temp = "topicInfo.isFollow";
        let temp2 = "topicInfo.followers_count";
        let value = !this.data.topicInfo.isFollow;
        let value2 = this.data.topicInfo.followers_count + parseInt(behaviour);
        this.setData({
            [temp]: value,
            [temp2]: value2
        })
        Topic.followTopic(this.data.topicID, behaviour);
    },

    onPageScroll: function(e) {
        this.setData({
            'scroll_top': e.scrollTop
        })
    },

    getSwiperHright() {
        const query = wx.createSelectorQuery()
        query.select('.item-container').boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec(res => {
            this.setData({
                swiperHeight: res[0].height
            })
        })
    },

    getSwiperAnswerHright() {
        const query = wx.createSelectorQuery()
        query.select('.item-container-answer').boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec(res => {
            this.setData({
                swiperAnswerHeight: res[0].height
            })
        })
    },

    getTopicHright() {
        const query = wx.createSelectorQuery()
        query.select('.head-container').boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec(res => {
            this.setData({
                topicHeight: res[0].height
            })
        })
    },

    swiperTab: function(event) {
        let currentTab = event.detail.current;
        this.setData({
            currentTab: currentTab,
            answerList: [],
            articleList: [],
            pageIndex: 1,
            isAll: false,
            swiperHeight: 400,
            swiperAnswerHeight: 400
        });
        if (currentTab == 0) {
            this.getRecommendArticle(this.data.topicID);
        } else if (currentTab == 1) {
            this.getRecommendQuestion(this.data.topicID);
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

    onAnswerDetail(event) {
        let id = event.detail.id;
        wx.navigateTo({
            url: '/pages/answer/answer?id=' + id
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
    onShow: function() {

    },

    onPullDownRefresh: function() {

    },

    onReachBottom: function() {
        if (this.data.currentTab == 0) {
            this.getRecommendArticle(this.data.topicID);
        } else if (this.data.currentTab == 1) {
            this.getRecommendQuestion(this.data.topicID);
        }
    },

    onShareAppMessage: function() {

    }
})