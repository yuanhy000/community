import {
    QuestionModel
} from '../../models/question.js'

import {
    UserModel
} from '../../models/user.js'

const Question = new QuestionModel();
const User = new UserModel();

Page({

    data: {
        answerInfo: {},
        posting: false,
        answerID: 0
    },

    onLoad: function(options) {
        this.data.answerID = options.id;
        this.getOneAnswer(options.id);

    },

    getOneAnswer(id) {
        Question.getOneAnswer(id).then(res => {
            this.setData({
                answerInfo: res
            })
        })
    },

    followUser(event) {
        let behaviour = event.currentTarget.dataset.behaviour;
        let temp = "answerInfo.isFollow";
        let value = !this.data.answerInfo.isFollow;
        this.setData({
            [temp]: value
        })
        User.followUser(this.data.answerInfo.users.id, behaviour);
    },

    onQuestion(event) {
        wx.navigateTo({
            url: '/pages/question/question?id=' + this.data.answerInfo.questions.id
        })
    },
    
    onLike(event) {
        let behavior = event.detail.behavior;
        let index = behavior == 'like' ? 1 : -1;
        Question.voteForAnswer(this.data.answerID, index).then(res => {
            this.getOneAnswer(this.data.answerID);
        });
    },

    contentChange(event) {
        const name = event.currentTarget.dataset.name;
        let content = event.detail.value;
        this.setData({
            [name]: content
        })
    },

    submit(event) {

        Question.postComment(this.data.answerID, this.data.content).then(res => {
            let temp = "answerInfo.comments";
            let tempNum = "answerInfo.comments_count";
            this.setData({
                posting: false,
                [temp]: res,
                [tempNum]: this.data.answerInfo.comments_count + 1
            })
            wx.showToast({
                title: "评论成功",
                mask: true
            })
        })
    },

    cancle(event) {
        this.setData({
            posting: false
        })
    },

    onFakePost(event) {
        this.setData({
            posting: true
        })
    },

    onPullDownRefresh: function() {
        wx.showNavigationBarLoading()
        this.getOneAnswer(this.data.answerID);
        setTimeout(function() {
            wx.hideNavigationBarLoading()
            wx.stopPullDownRefresh()
        }, 1500);
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})