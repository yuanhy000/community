import {
    TopicModel
} from '../../models/topic.js'

import {
    StorageModel
} from '../../utils/storage.js'

import {
    SearchModel
} from '../../models/search.js'

const Topic = new TopicModel();
const storage = new StorageModel();
const Search = new SearchModel();

Component({

    properties: {
        more: {
            type: String,
            observer: 'getTopic'
        }
    },

    data: {
        topicInfo: [],
        pageIndex: 1,
        isAll: false,
        loading: false,
        search: false,
        keyName: '',
        searchResult: null
    },

    attached: function() {
        this.getTopic();
    },

    methods: {

        inputChange: function(event) {
            const name = event.currentTarget.dataset.name;
            let inputName = event.detail.value;
            this.setData({
                [name]: inputName,
                keyName: inputName
            })
            if (inputName) {
                Search.searchTopic(inputName,this.data.pageIndex,80).then(res => {
                    this.data.search = true;
                    if (res.data.length != 0) {
                        this.setData({
                            topicInfo: res.data,
                            search: true,
                            searchResult: true
                        })
                    } else {
                        this.data.searchResult = false;
                        this.setData({
                            searchResult: false
                        })
                    }
                    this.setData({
                        topicInfo: res.data,
                        search: true
                    })
                })
            } else {
                this.data.search = false;
                this.data.pageIndex = 1;
                this.data.topicInfo = [];
                this.setData({
                    search: false
                })
                this.getTopic();
            }
        },

        getHilightStrArray: function(str, key) {
            return str.replace(new RegExp(`${key}`, 'g'), `%%${key}%%`).split('%%');
        },

        cancelChoose(event) {
            this.triggerEvent('cancel', {
                chooseTopic: false
            }, {});
        },

        chooseTopic(event) {
            const id = event.currentTarget.dataset.id;
            this.triggerEvent('getSelectTopic', {
                id: id,
                chooseTopic: false,
                from: 'dispaly'
            }, {});
        },

        getSelectTopic(event) {
            // const id = event.currentTarget.dataset.id;
            let topicID = event.detail.id;
            this.triggerEvent('getSelectTopic', {
                id: topicID,
                chooseTopic: false,
                from: 'search'
            }, {});
        },
        
        getTopic() {
            if (this.data.search) {
                return
            }
            let result = this.getInfoFromStorage();
            if (!result) {
                this.getInfoFromSever();
            }
        },

        getInfoFromStorage() {
            if (storage.get('topic') && storage.get('topic').length == storage.get('topicNum')) {
                this.setData({
                    topicInfo: storage.get('topic'),
                    isAll: true
                })
                this.data.isAll = true;
                return true;
            } else {
                return false;
            }
        },

        getInfoFromSever() {
            if (this.isLocked()) {
                return
            }
            if (!this.data.isAll) {
                this.locked();
                Topic.getTopicInfo(this.data.pageIndex, 9).then(res => {
                    if (res.data.length > 0) {
                        this.data.topicInfo.push.apply(this.data.topicInfo, res.data);
                        this.setData({
                            topicInfo: this.data.topicInfo
                        })
                        storage.put('topic', this.data.topicInfo, 600)
                    } else {
                        this.setData({
                            isAll: true
                        })
                        this.data.isAll = true;
                        this.data.pageIndex = 0;
                        storage.put('topicNum', this.data.topicInfo.length, 600);
                    }
                    this.unLocked();
                    this.data.pageIndex++;
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
        }
    }
})