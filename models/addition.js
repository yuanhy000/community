import {
    HTTP
} from '../utils/http.js'

class AdditionModel extends HTTP {

    getArticleCount() {
        return this.request({
            url: 'article/count',
            method: 'GET'
        })
    }

    submitDailyInfo(info) {
        return this.request({
            url: 'addition/daily',
            method: 'POST',
            data: {
                'info': info
            }
        })
    }

    submitPhotoInfo(info) {
        return this.request({
            url: 'addition/photo',
            method: 'POST',
            data: {
                'info': info
            }
        })
    }

    submitVideoInfo(info) {
        return this.request({
            url: 'addition/video',
            method: 'POST',
            data: {
                'info': info
            }
        })
    }

    submitQuestionInfo(info) {
        return this.request({
            url: 'addition/question',
            method: 'POST',
            data: {
                'info': info
            }
        })
    }

    submitAnswerInfo(info) {
        return this.request({
            url: 'addition/answer',
            method: 'POST',
            data: {
                'info': info
            }
        })
    }

}

export {
    AdditionModel
}