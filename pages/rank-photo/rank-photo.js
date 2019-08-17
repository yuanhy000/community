import {
    ArticleModel
} from '../../models/article.js'
const Article = new ArticleModel();

Page({

    data: {
        currentTab: 0,
        tabInfo: ['周榜单', '月榜单'],
        photoList: [],
        pageIndex: 1,
        isAll: false,
        loading: false,
        days: 7
    },

    onLoad: function(options) {
        let behavior = options.behavior;
        if (behavior == 30) {
            this.data.days = 30;
            this.setData({
                currentTab: 1
            })
        }
        this.getPhoto(behavior);
    },

    onPhoto(event) {
        let articleID = event.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/photo/photo?id=' + articleID
        })
    },

    onLike(event) {
        let behavior = event.detail.behavior;
        let articleID = event.currentTarget.dataset.id;
        let index = behavior == 'like' ? 1 : -1;
        Article.voteForArticle(articleID, index)
    },

    getPhoto(days) {
        if (this.isLocked()) {
            return
        }
        if (!this.data.isAll) {
            this.locked();
            this.getSwiperHeight();
            Article.getTopPhoto(days, this.data.pageIndex, 12).then(res => {
                if (res.data.length > 0) {
                    this.data.photoList.push.apply(this.data.photoList, res.data);
                    this.setData({
                        photoList: this.data.photoList
                    })
                    // storage.put('topic', this.data.topicInfo, 600)
                } else {
                    this.setData({
                        isAll: true
                    })
                    this.data.isAll = true;
                    this.data.pageIndex = 0;
                    // storage.put('topicNum', this.data.topicInfo.length, 600);
                }
                this.unLocked();
                this.data.pageIndex++;
                this.getSwiperHeight();
            })
        }
    },

    getSwiperHeight() {
        const query = wx.createSelectorQuery()
        query.select('.item-container').boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec(res => {
            this.setData({
                swiperHeight: res[0].height
            })
        })
    },

    swiperTab: function(event) {
        let currentTab = event.detail.current;
        this.setData({
            currentTab: currentTab,
            photoList: [],
            pageIndex: 1,
            isAll: false
        });
        if (currentTab == 0) {
            this.getPhoto(7);
        } else if (currentTab == 1) {
            this.getPhoto(30);
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
    isLocked() {
        return this.data.loading ? true : false;
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
            photoList: [],
            pageIndex: 1,
            isAll: false,
            loading: false
        })
    },

    onPullDownRefresh: function() {
        wx.showNavigationBarLoading();
        this.init();
        if (this.data.currentTab == 0) {
            this.getPhoto(7);
        } else
        if (this.data.currentTab == 1) {
            this.getPhoto(30);
        }
        setTimeout(function() {
            wx.hideNavigationBarLoading();
            wx.stopPullDownRefresh();
        }, 1000);

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        this.getPhoto(this.data.days);
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})