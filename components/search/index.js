import {
    SearchModel
} from '../../models/search.js'

const search = new SearchModel()

Component({

    properties: {
        more: {
            type: String,
            observer: 'getProductBySearch'
            //属性值改变时执行函数
        }
    },

    data: {
        productList: [],
        historyWords: [],
        hotWords: [],
        searching: false,
        searchName: '',
        pageIndex: 1,
        loading: false,
        isAll: false,
        loadingCenter: false,
        isFirst: true
    },

    attached() {
        this.initialize();
        // const hotWords = keywordModel.getHot()
        // hotWords.then(res => {
        //     this.setData({
        //         hotWords: res.hot
        //     })
        // })
    },

    methods: {
        getProductBySearch: function() {
            if (this.isLocked()) {
                return
            }
            if (!this.data.isAll) {
                this.setLoadingStatus();
                search.searchProduct(this.data.pageIndex, 10, this.data.searchName)
                    .then(res => {
                        if (res.data.length > 0) {
                            this.data.productList.push
                                .apply(this.data.productList, res.data);
                            this.setData({
                                productList: this.data.productList
                            })
                        } else {
                            this.data.isAll = true;
                            this.data.pageIndex = 1;
                        }
                        this.unLocked();
                        this.hideLoadingCenter();
                        this.data.pageIndex++;
                    })
            }
        },

        setLoadingStatus: function() {
            if (this.data.isFirst) {
                this.data.isFirst = false;
                this.data.loadingCenter = true;
            } else {
                this.locked();
            }
        },

        isLocked: function() {
            return this.data.loading ? true : false
        },

        locked: function() {
            this.data.loading = true;
            this.setData({
                loading: true
            })
        },

        unLocked: function() {
            this.data.loading = false;
            this.setData({
                loading: false
            })
        },

        onCancel: function(event) {
            this.triggerEvent('cancel', {}, {})
            this.initialize()
        },

        onDelete: function(event) {
            this.closeResult()
            this.initialize()
        },

        onConfirm: function(event) {
            this.showResult()
            this.showLoadingCenter()
            this.initialize()
            const searchName = event.detail.value || event.detail.text
            //输入文本，点击文本
            this.setData({
                searchName: searchName
            })
            this.getProductBySearch();
            search.addToHistory(searchName);
        },

        initialize: function() {
            const historyWords = search.getHistory();
            this.setData({
                historyWords: historyWords,
                productList: [],
                pageIndex: 1,
                isAll: false,
                loading: false
            })
        },

        showLoadingCenter: function() {
            this.setData({
                loadingCenter: true
            })
        },

        hideLoadingCenter: function() {
            this.setData({
                loadingCenter: false
            })
        },

        showResult: function() {
            this.setData({
                searching: true
            })
        },

        closeResult() {
            this.setData({
                searching: false,
                searchName: ''
            })
        }
    }
})