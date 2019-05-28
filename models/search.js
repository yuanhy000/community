import {
    HTTP
} from '../utils/http.js'

class SearchModel extends HTTP {
  
    searchArticle(name, page, size) {
        return this.request({
            url: 'search/article',
            method: 'POST',
            data: {
                'name': name,
                'page': page,
                'size': size
            }
        })
    }

    searchQuestion(name, page, size) {
        return this.request({
            url: 'search/question',
            method: 'POST',
            data: {
                'name': name,
                'page': page,
                'size': size
            }
        })
    }

    searchTopic(name, page, size) {
        return this.request({
            url: 'search/topic',
            method: 'POST',
            data: {
                'name': name,
                'page': page,
                'size': size
            }
        })
    }

    searchUser(name, page, size) {
        return this.request({
            url: 'search/user',
            method: 'POST',
            data: {
                'name': name,
                'page': page,
                'size': size
            }
        })
    }
}

export {
    SearchModel
}