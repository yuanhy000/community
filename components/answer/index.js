import {
    QuestionModel
} from '../../models/question.js'

import {
    UserModel
} from '../../models/user.js'

const Question = new QuestionModel();
const User = new UserModel();

Component({
    properties: {
        answerInfo: {
            type: Object
        }
    },

    data: {
        answerInfo: {}
    },
    attached() {
        this.data.answerInfo = this.properties.answerInfo;
    },

    methods: {
        onAnswer(event) {
            this.triggerEvent('onAnswer', {
                id: this.properties.answerInfo.id
            }, {});
        },

        onLike(event) {
            let behavior = event.detail.behavior;
            let index = behavior == 'like' ? 1 : -1;
            Question.voteForAnswer(this.data.answerInfo.id, index).then(res => {
                // this.getOneArticle(this.data.articleID);
            });
        },

        onUser(event) {
            let userID = event.currentTarget.dataset.id;
            wx.navigateTo({
                url: '/pages/user-detail/user-detail?id=' + userID
            })
        },

        onQuestion(event) {
            wx.navigateTo({
                url: '/pages/question/question?id=' + this.data.answerInfo.questions.id
            })
        },

        followUser(event) {
            let behaviour = event.currentTarget.dataset.behaviour;
            let temp = "answerInfo.isFollow";
            let value = !this.data.answerInfo.isFollow;
            this.setData({
                [temp]: value
            })
            User.followUser(this.data.answerInfo.users.id, behaviour);
        }
    }
})