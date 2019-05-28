import {
    random
} from '../../utils/common.js'

import {
    StorageModel
} from '../../utils/storage.js'

import {
    TopicModel
} from '../../models/topic.js'

import {
    AdditionModel
} from '../../models/addition.js'


const storage = new StorageModel();
const Topic = new TopicModel();
const Addition = new AdditionModel();

Page({

    data: {
        focus: false,
        isMax: false,
        more: '',
        selectImageList: [],
        imageUrlList: [],
        selectImageNumber: 9,
        isFirst: true,
        questionID: 0
    },

    onLoad: function(options) {
        this.setData({
            questionID: options.id,
            topicID: options.topic_id
        })
    },

    contentChange(event) {
        const name = event.currentTarget.dataset.name;
        let content = event.detail.value;
        this.setData({
            [name]: content
        })
    },

    getImageList(event) {
        let imageUrlList = event.detail.imageUrlList;
        let selectImageList = event.detail.selectImageList;
        this.setData({
            imageUrlList: imageUrlList,
            selectImageList: selectImageList,
            isFirst: false
        })
    },

    submit(event) {
        let submitInfo = this.prepareInfo();
        let result = this.checkBeforeSubmit(submitInfo);
        if (result) {
            Addition.submitAnswerInfo(submitInfo).then(res => {
                wx.showToast({
                    title: "回复成功",
                    mask: true
                })
                setTimeout(function() {
                    wx.navigateBack({
                        delta: 1
                    })
                }, 1000);

            }).catch(res => {
                this.showMessage('消息提示', '回复失败，请稍后从试', false)
            })
        }
    },

    checkBeforeSubmit(submitInfo) {
        if (submitInfo.content == null && submitInfo.imageUrl.length == 0) {
            this.showMessage('回复须知', '回复内容不能能为空', false);
            return false;
        }
        return true;
    },

    prepareInfo() {
        let submitInfo = {
            imageUrl: this.data.imageUrlList,
            content: this.data.content,
            questionID: this.data.questionID,
            topicID: this.data.topicID
        }
        return submitInfo;
    },

    showMessage: function(title, content, change) {
        wx.showModal({
            title: title,
            content: content,
            showCancel: false,
            success: res => {
                if (change) {
                    wx.navigateTo({
                        url: ''
                    });
                }
            }
        });
    },

    init() {
        this.setData({
            focus: false,
            isMax: false,
            more: '',
            selectImageList: [],
            imageUrlList: [],
            isFirst: true
        })
    },

    onPullDownRefresh: function() {

        wx.showNavigationBarLoading() //在标题栏中显示加载
        this.init();
        setTimeout(function() {
            wx.hideNavigationBarLoading() //完成停止加载
            wx.stopPullDownRefresh() //停止下拉刷新
        }, 1500);
    },

    onReachBottom() {
        this.setData({
            more: random(16)
        })
    },

    onShareAppMessage: function() {

    }
})