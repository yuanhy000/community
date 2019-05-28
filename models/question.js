import {
    HTTP
} from '../utils/http.js'

class QuestionModel extends HTTP {

    getTopQuestion(size) {
        return this.request({
            url: 'question/top',
            method: 'GET'
        })
    }

    getQuestionByID(id) {
        return this.request({
            url: 'question/getOne',
            method: 'POST',
            data: {
                'id': id
            }
        })
    }

    getRecommendQuestion(page, size) {
        return this.request({
            url: 'question/recommend',
            method: 'POST',
            data: {
                'page': page,
                'size': size
            }
        })
    }

    getRecommendAnswer(id, page, size) {
        return this.request({
            url: 'answer/recommend',
            method: 'POST',
            data: {
                'id': id,
                'page': page,
                'size': size
            }
        })
    }

    getUpdateAnswer(id, page, size) {
        return this.request({
            url: 'answer/update',
            method: 'POST',
            data: {
                'id': id,
                'page': page,
                'size': size
            }
        })
    }

    voteForAnswer(id, index) {
        return this.request({
            url: 'answer/vote',
            method: 'POST',
            data: {
                'answer_id': id,
                'index': index
            }
        })
    }

    followQuestion(question_id, behaviour) {
        return this.request({
            url: 'question/follow',
            method: 'POST',
            data: {
                'question_id': question_id,
                'behaviour': behaviour
            }
        })
    }

    getOneAnswer(id) {
        return this.request({
            url: 'answer/one',
            method: 'POST',
            data: {
                'id': id
            }
        })
    }

    postComment(answer_id, comment) {

        return this.request({
            url: 'answer/comment/post',
            method: 'POST',
            data: {
                'answer_id': answer_id,
                'comment': comment
            }
        })
    }


}

export {
    QuestionModel
}