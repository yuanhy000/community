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
        videoInfo: {},
        focus: false,
        chooseTopic: false,
        more: '',
        topicInfo: null,
        confirmTopic: false,
        isFirst: true
    },

    onLoad: function(options) {

    },

    contentChange(event) {
        const name = event.currentTarget.dataset.name;
        let content = event.detail.value;
        this.setData({
            [name]: content
        })
    },

    titleChange(event) {
        const name = event.currentTarget.dataset.name;
        let title = event.detail.value;
        this.setData({
            [name]: title
        })
    },

    getVideoInfo(event) {
        let videoInfo = event.detail.videoInfo;
        this.setData({
            isFirst: false,
            videoInfo: videoInfo
        })
    },
    clearVideoInfo(event) {
        this.setData({
            videoInfo: {},
            isFirst: true
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
            Addition.submitVideoInfo(submitInfo).then(res => {
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

    prepareInfo() {
        let submitInfo = {
            topicInfo: this.data.topicInfo,
            videoInfo: this.data.videoInfo,
            title: this.data.title,
            content: this.data.content,
            type: 'Video'
        }
        return submitInfo;
    },

    checkBeforeSubmit(submitInfo) {
        if (submitInfo.title == null) {
            this.showMessage('发布须知', '标题必须填写', false);
            return false;
        }
        if (submitInfo.videoInfo == {}) {
            this.showMessage('发布须知', '选择一个视频再发布哦', false);
            return false;
        }
        if (submitInfo.topicInfo == null) {
            this.showMessage('发布须知', '最好选择个主题再发布', false);
            return false;
        }
        return true;
    },

    init() {
        this.setData({
            focus: false,
            chooseTopic: false,
            more: '',
            topicInfo: null,
            confirmTopic: false,
            videoInfo: {},
            isFirst: true
        })
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
    onPullDownRefresh: function() {
        wx.showNavigationBarLoading()
        this.init();
        setTimeout(function() {
            wx.hideNavigationBarLoading()
            wx.stopPullDownRefresh()
        }, 1500);
    },

    onReachBottom: function() {
        this.setData({
            more: random(16)
        })
    },

    onShareAppMessage: function() {

    }
})