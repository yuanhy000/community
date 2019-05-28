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
        chooseTopic: false,
        more: '',
        topicInfo: null,
        confirmTopic: false,
        selectImageList: [],
        imageUrlList: [],
        selectImageNumber: 9,
        isFirst: true
    },

    onLoad: function(options) {},

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

    changeTopic(event) {
        this.setData({
            chooseTopic: true
        })
    },

    cancel(event) {
        this.setData({
            chooseTopic: event.detail.chooseTopic
        })
    },

    getSelectTopic(event) {
        let topicID = event.detail.id;
        this.setData({
            chooseTopic: event.detail.chooseTopic
        })
        this.data.flag = false;
        let result = this.getTopicFromStorage(topicID);
        if (!result) {
            Topic.getTopicById(topicID).then(res => {
                this.setData({
                    topicInfo: {
                        id: res[0].id,
                        name: res[0].name
                    },
                    confirmTopic: true
                })
            })
        }
    },

    getTopicFromStorage(topicID) {
        let topicInfo = storage.get('topic');
        for (let i = 0; i < topicInfo.length; i++) {
            if (topicInfo[i].id == topicID) {
                this.setData({
                    topicInfo: {
                        id: topicID,
                        name: topicInfo[i].name
                    },
                    confirmTopic: true
                })
                return true
            }
        }
        return false;
    },

    submit(event) {
        let submitInfo = this.prepareInfo();
        let result = this.checkBeforeSubmit(submitInfo);
        if (result) {
            Addition.submitDailyInfo(submitInfo).then(res => {
                wx.showToast({
                    title: "发布成功",
                    mask: true
                })
                setTimeout(function() {
                    wx.navigateBack({
                        delta: 1
                    })
                }, 1000);
            }).catch(res => {
                this.showMessage('消息提示', '发布失败，请稍后从试', false)
            })
        }
    },

    checkBeforeSubmit(submitInfo) {
        if (submitInfo.content == null && submitInfo.imageUrl.length == 0) {
            this.showMessage('发布须知', '发布内容不能能为空', false);
            return false;
        }
        if (submitInfo.topicInfo == null) {
            this.showMessage('发布须知', '最好选择个主题再发布', false);
            return false;
        }
        return true;
    },

    prepareInfo() {
        let submitInfo = {
            topicInfo: this.data.topicInfo,
            imageUrl: this.data.imageUrlList,
            title: null,
            content: this.data.content,
            type: 'Daily'
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
            chooseTopic: false,
            more: '',
            topicInfo: null,
            confirmTopic: false,
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