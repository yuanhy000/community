// components/question/index.js
Component({

    properties: {
        questionInfo: {
            type: Object
        }
    },

    attached() {
        this.data.questionInfo = this.properties.questionInfo;
    },
    data: {

    },

    methods: {
        onQuestion(event) {
            let questionID = event.currentTarget.dataset.id;
            wx.navigateTo({
                url: '/pages/question/question?id=' + questionID
            })
        },
        
        onTopic(event) {
            let topicID = event.currentTarget.dataset.id;
            wx.navigateTo({
                url: '/pages/topic/topic?id=' + topicID
            })
        }
    }
})