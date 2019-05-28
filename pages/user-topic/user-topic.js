import {
    TopicModel
} from '../../models/topic.js'

const Topic = new TopicModel();

Page({

    data: {
        topicList: [],
        loading: false
    },

    onLoad: function(options) {
        this.getFollowedTopic();
    },

    getFollowedTopic(event) {
        this.setData({
            loading: true
        })
        Topic.getFollowedTopic().then(res => {
            this.setData({
                loading: false,
                topicList: res
            })
        })
    },

    onPullDownRefresh: function() {
        wx.showNavigationBarLoading();
        this.setData({
            topicList: []
        })
        this.getFollowedTopic();
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


    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})