import {
    HTTP
} from '../utils/http.js'

class UserModel extends HTTP {

    submitUserInfo(data) {
        return this.request({
            url: 'user/info/set',
            method: 'POST',
            data: data
        })
    }

    getUserInfo() {
        return this.request({
            url: 'user/info/get',
            method: 'POST'
        })
    }

    followUser(user_id, behaviour) {
        return this.request({
            url: 'user/follow',
            method: 'POST',
            data: {
                'user_id': user_id,
                'behaviour': behaviour
            }
        })
    }

    getUserByID(user_id) {
        return this.request({
            url: 'user/getById',
            method: 'POST',
            data: {
                'user_id': user_id
            }
        })
    }

    getUserArticle(user_id, type, page, size) {
        return this.request({
            url: 'user/article',
            method: 'POST',
            data: {
                'user_id': user_id,
                'type': type,
                'page': page,
                'size': size
            }
        })
    }

    getUserQuestion(user_id, page, size) {
        return this.request({
            url: 'user/question',
            method: 'POST',
            data: {
                'user_id': user_id,
                'page': page,
                'size': size
            }
        })
    }

    getUserFollowTopic(user_id) {
        return this.request({
            url: 'user/follow/topic',
            method: 'POST',
            data: {
                'user_id': user_id
            }
        })
    }

    getUserFollowQuestion(user_id, page, size) {
        return this.request({
            url: 'user/follow/question',
            method: 'POST',
            data: {
                'user_id': user_id,
                'page': page,
                'size': size
            }
        })
    }

    getUserFollowUser(user_id, page, size) {
        return this.request({
            url: 'user/follow/user',
            method: 'POST',
            data: {
                'user_id': user_id,
                'page': page,
                'size': size
            }
        })
    }

    getUserFans(user_id, page, size) {
        return this.request({
            url: 'user/follow/fans',
            method: 'POST',
            data: {
                'user_id': user_id,
                'page': page,
                'size': size
            }
        })
    }
}

export {
    UserModel
}