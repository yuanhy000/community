import {
    TopicModel
} from '../../models/topic.js'

import {
    QuestionModel
} from '../../models/question.js'

import {
    ArticleModel
} from '../../models/article.js'

const Topic = new TopicModel();
const Question = new QuestionModel();
const Article = new ArticleModel();

Page({
    data: {
        currentTab: 0,
        tabInfo: ['推荐', '摄影', '话题', '视频'],
        topQuestion: [],
        topicInfo: [],
        photoList: [],
        questionList: [],
        videoList: [],
        pageIndex: 1,
        isAll: false,
        loading: false,
        swiperHeight: 1200,
        swiperPhotoHeight: 1200,
        swiperQuestionHeight: 1200,
        swiperVideoHeight: 1200,
        topWeekPhoto: {},
        topMonthPhoto: {},
    },

    onLoad: function(options) {
        this.getTopQuestion();
        this.getTopicInfoFromSever();
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

    onQuestion(event) {
        let questionID = event.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/question/question?id=' + questionID
        })
    },

    onLike(event) {
        let behavior = event.detail.behavior;
        let articleID = event.currentTarget.dataset.id;
        let index = behavior == 'like' ? 1 : -1;
        Article.voteForArticle(articleID, index)
    },

    onPhoto(event) {
        let articleID = event.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/photo/photo?id=' + articleID
        })
    },

    onRankPhoto(event) {
        let behavior = event.currentTarget.dataset.behavior;
        wx.navigateTo({
            url: '/pages/rank-photo/rank-photo?behavior=' + behavior
        })
    },

    onArticle(event) {
        let id = event.detail.id;
        wx.navigateTo({
            url: '/pages/video/video?id=' + id
        })
    },

    onSearch(event) {
        wx.switchTab({
            url: '/pages/search/search'
        })
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

    getTopPhoto() {
        Article.getTopPhoto(7, 1, 1).then(res => {
            this.setData({
                topWeekPhoto: res.data[0]
            })
        })
        Article.getTopPhoto(30, 1, 1).then(res => {
            this.setData({
                topMonthPhoto: res.data[0]
            })
        })
    },

    getTopQuestion() {
        Question.getTopQuestion().then(res => {
            this.setData({
                topQuestion: res.data
            })
        })
    },

    getRecommendQuestion() {
        if (this.isLocked()) {
            return
        }
        if (!this.data.isAll) {
            this.locked();
            this.getSwiperQuestionHeight();
            Question.getRecommendQuestion(this.data.pageIndex, 6).then(res => {
                if (res.data.length > 0) {
                    this.data.questionList.push.apply(this.data.questionList, res.data);
                    this.setData({
                        questionList: this.data.questionList
                    })
                    // storage.put('topic', this.data.topicInfo, 600)
                } else {
                    this.setData({
                        isAll: true
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

    getRecommendPhoto() {
        if (this.isLocked()) {
            return
        }
        if (!this.data.isAll) {
            this.locked();
            this.getSwiperPhotoHeight();
            Article.getRecommendPhoto(this.data.pageIndex, 12).then(res => {
                if (res.data.length > 0) {
                    this.data.photoList.push.apply(this.data.photoList, res.data);
                    this.setData({
                        photoList: this.data.photoList
                    })
                    // storage.put('topic', this.data.topicInfo, 600)
                } else {
                    this.setData({
                        isAll: true
                    })
                    this.data.isAll = true;
                    this.data.pageIndex = 0;
                    // storage.put('topicNum', this.data.topicInfo.length, 600);
                }
                this.unLocked();
                this.data.pageIndex++;
                this.getSwiperPhotoHeight();

            })
        }
    },

    getRecommendVideo() {
        if (this.isLocked()) {
            return
        }
        if (!this.data.isAll) {
            this.locked();
            this.getSwiperVideoHeight();
            Article.getRecommendVideo(this.data.pageIndex, 6).then(res => {
                if (res.data.length > 0) {
                    this.data.videoList.push.apply(this.data.videoList, res.data);
                    this.setData({
                        videoList: this.data.videoList
                    })
                    // storage.put('topic', this.data.topicInfo, 600)
                } else {
                    this.setData({
                        isAll: true
                    })
                    this.data.isAll = true;
                    this.data.pageIndex = 0;
                    // storage.put('topicNum', this.data.topicInfo.length, 600);
                }
                this.unLocked();
                this.data.pageIndex++;
                this.getSwiperVideoHeight();

            })
        }
    },

    getTopicInfoFromSever() {
        if (this.isLocked()) {
            return
        }
        if (!this.data.isAll) {
            this.locked();
            this.getSwiperHeight();
            Topic.getTopicInfo(this.data.pageIndex, 12).then(res => {
                if (res.data.length > 0) {
                    this.data.topicInfo.push.apply(this.data.topicInfo, res.data);
                    this.setData({
                        topicInfo: this.data.topicInfo
                    })
                    // storage.put('topic', this.data.topicInfo, 600)
                } else {
                    this.setData({
                        isAll: true
                    })
                    this.data.isAll = true;
                    this.data.pageIndex = 0;
                    // storage.put('topicNum', this.data.topicInfo.length, 600);
                }
                this.unLocked();
                this.data.pageIndex++;
                this.getSwiperHeight();

            })
        }
    },

    getSwiperHeight() {
        const query = wx.createSelectorQuery()
        query.select('.item-container').boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec(res => {
            this.setData({
                swiperHeight: res[0].height
            })
        })
    },

    getSwiperPhotoHeight() {
        const query = wx.createSelectorQuery()
        query.select('.item-container-photo').boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec(res => {
            this.setData({
                swiperPhotoHeight: res[0].height
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

    getSwiperVideoHeight() {
        const query = wx.createSelectorQuery()
        query.select('.item-container-video').boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec(res => {
            this.setData({
                swiperVideoHeight: res[0].height
            })
        })
    },

    swiperTab: function(event) {
        let currentTab = event.detail.current;
        this.setData({
            currentTab: currentTab,
            articleList: [],
            topQuestion: [],
            topicInfo: [],
            photoList: [],
            questionList: [],
            videoList: [],
            topWeekPhoto: {},
            topMonthPhoto: {},
            pageIndex: 1,
            isAll: false
        });
        if (currentTab == 0) {
            this.getTopQuestion();
            this.getTopicInfoFromSever();
        } else if (currentTab == 1) {
            this.getTopPhoto();
            this.getRecommendPhoto();
        } else if (currentTab == 2) {
            this.getRecommendQuestion();
        } else if (currentTab == 3) {
            this.getRecommendVideo();
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

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        if (this.data.currentTab == 0) {
            this.getTopicInfoFromSever();
        } else if (this.data.currentTab == 1) {
            this.getRecommendPhoto();
        } else if (this.data.currentTab == 2) {
            this.getRecommendQuestion();
        } else if (this.data.currentTab == 3) {
            this.getRecommendVideo();
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
            }
        }
        return {
            title: '分享给你',
            path: '/page/discovery/discovery'
        }
    }
})