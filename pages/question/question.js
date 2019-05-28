import {
    QuestionModel
} from '../../models/question.js'

const Question = new QuestionModel();

Page({


    data: {
        questionID: 0,
        currentTab: 0,
        tabInfo: ['热度', '时间'],
        questionInfo: [],
        answerList: [],
        pageIndex: 1,
        isAll: false,
        loading: false,
        scroll_top: 0,
        questionHeight: 0,
        answerResult: false
    },


    // onLoad: function(options) {
    //     const questionID = options.id;
    //     this.data.questionID = questionID;
    //     Question.getQuestionByID(questionID).then(res => {
    //         this.setData({
    //             questionInfo: res,
    //         })
    //         this.getQuestionHright();
    //     })
    //     this.getRecommendAnswer(questionID);
    // },

    onShow: function() {
        this.init();
        var that = this;
        let pages = getCurrentPages();
        let currPage = pages[pages.length - 1];
        this.data.questionID = currPage.options.id;
        Question.getQuestionByID(currPage.options.id).then(res => {
            this.setData({
                questionInfo: res,
            })
            this.getQuestionHright();
        })
        this.getRecommendAnswer(currPage.options.id);
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

    followQuestion(event) {
        let behaviour = event.currentTarget.dataset.behaviour;
        let temp = "questionInfo.isFollow";
        let temp2 = "questionInfo.likes";
        let value = !this.data.questionInfo.isFollow;
        let value2 = this.data.questionInfo.likes + parseInt(behaviour);
        this.setData({
            [temp]: value,
            [temp2]: value2
        })
        Question.followQuestion(this.data.questionInfo.id, behaviour);
    },

    getRecommendAnswer(questionID) {
        this.getAnswer('Recommend', questionID);
    },

    getUpdateAnswer(questionID) {
        this.getAnswer('Update', questionID);
    },

    getAnswer: function(typeName, questionID) {
        if (this.isLocked()) {
            return
        }
        if (!this.data.isAll) {
            this.locked();
            if (!this.data.isFirst) {
                this.getSwiperHright();
            }
            if (typeName == 'Recommend') {
                Question.getRecommendAnswer(questionID, this.data.pageIndex, 6).then(res => {
                    this.setAnswerInfo(res);
                })
            } else if (typeName == 'Update') {
                Question.getUpdateAnswer(questionID, this.data.pageIndex, 6).then(res => {
                    this.setAnswerInfo(res);
                })
            }
        }
    },

    setAnswerInfo(res) {
        if (res.data.length > 0) {
            this.data.answerList.push.apply(this.data.answerList, res.data);
            this.setData({
                answerList: this.data.answerList,
                isFirst: false,
                answerResult: true
            })
        } else {
            this.data.isAll = true;
            this.data.pageIndex = 1;
            this.setData({
                answerResult: true
            })
        }
        this.unLocked();
        this.getSwiperHright();
        this.data.pageIndex++;
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

    getQuestionHright() {
        const query = wx.createSelectorQuery()
        query.select('.question-info').boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec(res => {
            this.setData({
                questionHeight: res[0].height
            })
        })
    },

    swiperTab: function(event) {
        let currentTab = event.detail.current;
        this.setData({
            currentTab: currentTab,
            answerList: [],
            pageIndex: 1,
            isAll: false,
            answerResult: false
        });
        if (currentTab == 0) {
            this.getRecommendAnswer(this.data.questionID);
        } else if (currentTab == 1) {
            this.getUpdateAnswer(this.data.questionID);
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

    onAnswer(event) {
        wx.navigateTo({
            url: '/pages/addition-answer/addition-answer?id=' +
                this.data.questionID + '&topic_id=' + this.data.questionInfo.topics[0].id
        })
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

    init() {
        this.setData({
            currentTab: 0,
            tabInfo: ['热度', '时间'],
            questionInfo: [],
            answerList: [],
            pageIndex: 1,
            isAll: false,
            loading: false,
            answerResult: false
        })
    },

    onPullDownRefresh: function() {

    },

    onReachBottom: function() {
        if (this.data.currentTab == 0) {
            this.getRecommendAnswer(this.data.questionID);

        } else if (this.data.currentTab == 1) {
            this.getUpdateAnswer(this.data.questionID);
        }
    },

    onShareAppMessage: function(res) {
        if (res.from === 'button') {
            let articleID = res.target.dataset.articleid;
            let type = res.target.dataset.type;
            if (type == 'answer') {
                return {
                    title: '前往 id= ' + articleID + ' 的回答',
                    path: '/pages/answer/answer?id=' + articleID
                }
            }
        }
    }
})