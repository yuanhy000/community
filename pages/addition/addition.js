import {
    AdditionModel
} from '../../models/addition.js'

const Addition = new AdditionModel();
Page({

    data: {
        ArticleCountInfo: []
    },

    onLoad: function(options) {
        Addition.getArticleCount().then(res => {
            this.setData({
                ArticleCountInfo: res
            })
        })
    },

    additionDaliy(event) {
        wx.navigateTo({
            url: '/pages/addition-daily/addition-daily'
        })
    },

    additionPhoto(event) {
        wx.navigateTo({
            url: '/pages/addition-photo/addition-photo'
        })
    },

    additionVideo(event) {
        wx.navigateTo({
            url: '/pages/addition-video/addition-video'
        })
    },

    additionQuestion(event) {
        wx.navigateTo({
            url: '/pages/addition-question/addition-question'
        })
    },


    onShareAppMessage: function() {

    }
})