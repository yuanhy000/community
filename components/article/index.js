import {
    UserModel
} from '../../models/user.js'

const User = new UserModel();

Component({
    properties: {
        articleInfo: {
            type: Object
        }
    },

    data: {
        articleInfo: {}
    },
    attached() {
        this.data.articleInfo = this.properties.articleInfo;
    },

    methods: {
        voteFor(event) {
            const id = event.currentTarget.dataset.id
            let index = 0;
            if (this.properties.articleInfo.isVote) {
                index = -1;
            } else {
                index = 1;
            }
            this.triggerEvent('voteFor', {
                id: this.properties.articleInfo.id,
                index: index
            }, {});
        },

        onArticle(event) {
            this.triggerEvent('onArticle', {
                id: this.properties.articleInfo.id
            }, {});
        },

        onUser(event) {
            let userID = event.currentTarget.dataset.id;
            wx.navigateTo({
                url: '/pages/user-detail/user-detail?id=' + userID
            })
        },

        followUser(event) {
            let behaviour = event.currentTarget.dataset.behaviour;
            let temp = "articleInfo.isFollow";
            let value = !this.data.articleInfo.isFollow;
            this.setData({
                [temp]: value
            })
            User.followUser(this.data.articleInfo.users.id, behaviour);
        },

        onTopic(event) {
            let topicID = event.currentTarget.dataset.id;
            wx.navigateTo({
                url: '/pages/topic/topic?id=' + topicID
            })
        },

        // onShare(event) {
        //     this.triggerEvent('onShare', {
        //         id: this.properties.articleInfo.id
        //     }, {});
        // }
    }
})