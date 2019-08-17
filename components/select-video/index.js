import {
    uploadVideo
} from '../../utils/uploadFile.js'

import {
    StorageModel
} from '../../utils/storage.js'

const util = require('../../utils/util.js');
const storage = new StorageModel();


Component({
    /**
     * 组件的属性列表  
     */
    properties: {
        videoInfo: {
            type: Object
        },
        isSelect: {
            type: Boolean,
            value: false
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        videoInfo: {},
        isSelect: false,
        tempFilePath: ''
    },

    methods: {

        selectVideo() {
            wx.chooseVideo({
                sourceType: ['album', 'camera'],
                maxDuration: 60,
                camera: 'back',
                success: (res) => {
                    this.setData({
                        tempFilePath: res.tempFilePath
                    })
                    this.getImageUrl(res.tempFilePath);
                }
            })
        },

        getImageUrl(tempFilePath) {
            let nowTime = util.formatTime(new Date());
            wx.showLoading({
                title: '上传中 ',
                mask: true
            })
            uploadVideo(tempFilePath, 'videos/' + nowTime + '/')
                .then(res => {
                    this.setData({
                        videoInfo: {
                            'videoUrl': res,
                            'videoCoverUrl': res + '?x-oss-process=video/snapshot,t_100,f_jpg,w_800,h_600,m_fast'
                        },
                        isSelect: true
                    })
                    this.triggerEvent('getVideoInfo', {
                        videoInfo: this.data.videoInfo
                    }, {});
                    wx.hideLoading();
                }).catch(res => {
                    wx.hideLoading();
                })
        },

        closeOption(event) {
            this.setData({
                videoInfo: {},
                isSelect: false
            })
            this.triggerEvent('clearVideoInfo', {
                videoInfo: this.data.videoInfo
            }, {});
        }
    }
})