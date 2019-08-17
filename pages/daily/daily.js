import {
    ArticleModel
} from '../../models/article.js'

import {
    UserModel
} from '../../models/user.js'

const Article = new ArticleModel();
const User = new UserModel();

Page({

    data: {
        articleInfo: {},
        posting: false,
        articleID: 0
    },

    onLoad: function(options) {
        this.data.articleID = options.id;
        this.getOneArticle(options.id);

    },

    onUser(event) {
        let userID = event.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/user-detail/user-detail?id=' + userID
        })
    },
     
    getOneArticle(id) {
        Article.getOne(id).then(res => {
            this.setData({
                articleInfo: res
            })
            console.log(res);
        })
    },

    followUser(event) {
        let behaviour = event.currentTarget.dataset.behaviour;
        let temp = "articleInfo.isFollow";
        let value = !this.data.articleInfo.isFollow;
        this.setData({
            [temp]: value
        })
        User.followUser(this.data.articleInfo.users.id, behaviour);
    },

    onLike(event) {
        let behavior = event.detail.behavior;
        let index = behavior == 'like' ? 1 : -1;
        Article.voteForArticle(this.data.articleID, index).then(res => {
            this.getOneArticle(this.data.articleID);
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

        Article.postComment(this.data.articleID, this.data.content).then(res => {
            let temp = "articleInfo.comments";
            let tempNum = "articleInfo.comments_count";
            this.setData({
                posting: false,
                [temp]: res,
                [tempNum]: this.data.articleInfo.comments_count + 1
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
        this.getOneArticle(this.data.articleID);
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