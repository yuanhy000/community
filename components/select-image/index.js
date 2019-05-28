import {
    uploadFile
} from '../../utils/uploadFile.js'

const util = require('../../utils/util.js');

Component({
    properties: {
        imageNumber: {
            type: Number
        },
        isSelect: {
            type: Boolean,
            value: false
        },
        selectImageList: {
            type: Array
        }
    },
    data: {
        selectImageList: [],
        imageUrlList: [],
        isMax: false,
        isSelect: false,
    },
    methods: {
        selectImage(event) {
            const selectNum = this.data.selectImageList.length;
            const num = this.properties.imageNumber - selectNum;
            num != 0 && wx.chooseImage({
                count: num,
                success: (res) => {
                    let tempFilePaths = res.tempFilePaths;
                    let newList = this.data.selectImageList;
                    for (let i = 0; i < tempFilePaths.length; i++) {
                        newList.push(tempFilePaths[i]);
                    }
                    newList.length == this.properties.imageNumber ? this.setData({
                        isMax: true
                    }) : null;
                    this.setData({
                        selectImageList: newList,
                        isSelect: true
                    })
                    this.getImageUrl();
                    this.triggerEvent('getImageList', {
                        imageUrlList: this.data.imageUrlList,
                        selectImageList: this.data.selectImageList
                    }, {});
                }
            })
        },

        getImageUrl() {
            let nowTime = util.formatTime(new Date());
            for (let i = this.data.imageUrlList.length; i < this.data.selectImageList.length; i++) {
                wx.showLoading({
                    title: '上传中 ' + (i + 1) + ' / ' + this.data.selectImageList.length,
                    mask: true
                })
                uploadFile(this.data.selectImageList[i], 'images/' + nowTime + '/')
                    .then(res => {
                        this.data.imageUrlList.push(res);
                        wx.hideLoading();
                    }).catch(res => {
                        wx.hideLoading();
                    })
            }
        },

        closeOption(e) {
            const {
                index
            } = e.currentTarget.dataset;
            let imagelist = this.data.selectImageList;
            let imageUrl = this.data.imageUrlList;
            imagelist.splice(index, 1);
            imageUrl.splice(index, 1);
            this.data.imageUrlList = imageUrl;
            this.setData({
                selectImageList: imagelist,
                imageUrlList: imageUrl,
                isShow: true,
                isMax: false,
                isSelect: false
            })
            this.triggerEvent('getImageList', {
                imageUrlList: this.data.imageUrlList,
                selectImageList: this.data.selectImageList
            }, {});
        }
    }
})