import {
    HTTP
} from '../utils/http.js'

class TopicModel extends HTTP {

    getTopicInfo(page, size) {
        return this.request({
            url: 'topic/get',
            method: 'POST',
            data: {
                'page': page,
                'size': size
            }
        })
    }

    getTopicById(id) {
        return this.request({
            url: 'topic/getOne',
            method: 'POST',
            data: {
                'id': id
            }
        })
    }

    followTopic(topic_id, behaviour) {
        return this.request({
            url: 'topic/follow',
            method: 'POST',
            data: {
                'topic_id': topic_id,
                'behaviour': behaviour
            }
        })
    }

    getRecommendArticle(topicID, page, size) {
        return this.request({
            url: 'topic/article',
            method: 'POST',
            data: {
                'topicID': topicID,
                'page': page,
                'size': size
            }
        })
    }

    getRecommendQuestion(topicID, page, size) {
        return this.request({
            url: 'topic/question',
            method: 'POST',
            data: {
                'topicID': topicID,
                'page': page,
                'size': size
            }
        })
    }
    
    getFollowedTopic() {
        return this.request({
            url: 'topic/getFollowed',
            method: 'POST',
            data: {}
        })
    }
}

export {
    TopicModel
}