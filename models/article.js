import {
    HTTP
} from '../utils/http.js'

class ArticleModel extends HTTP {

    getRecommendArticle(page, size) {
        return this.request({
            url: 'article/recommend',
            method: 'POST',
            data: {
                'page': page,
                'size': size
            }
        })
    }

    getUpdateArticle(page, size) {
        return this.request({
            url: 'article/update',
            method: 'POST',
            data: {
                'page': page,
                'size': size
            }
        })
    }


    getFollowArticle(page, size) {
        return this.request({
            url: 'article/follow',
            method: 'POST',
            data: {
                'page': page,
                'size': size
            }
        })
    }

    voteForArticle(id, index) {
        return this.request({
            url: 'article/vote',
            method: 'POST',
            data: {
                'article_id': id,
                'index': index
            }
        })
    }


    voteForComment(id, index) {
        return this.request({
            url: 'comment/vote',
            method: 'POST',
            data: {
                'comment_id': id,
                'index': index
            }
        })
    }

    getOne(id) {
        return this.request({
            url: 'article/one',
            method: 'POST',
            data: {
                'id': id
            }
        })
    }

    postComment(article_id, comment) {

        return this.request({
            url: 'article/comment/post',
            method: 'POST',
            data: {
                'article_id': article_id,
                'comment': comment
            }
        })
    }

    getTopPhoto(days, page, size) {
        return this.request({
            url: 'photo/top/days',
            method: 'POST',
            data: {
                'days': days,
                'page': page,
                'size': size
            }
        })
    }

    getRecommendPhoto(page, size) {
        return this.request({
            url: 'photo/recommend',
            method: 'POST',
            data: {
                'page': page,
                'size': size
            }
        })
    }

    getRecommendVideo(page, size) {
        return this.request({
            url: 'video/recommend',
            method: 'POST',
            data: {
                'page': page,
                'size': size
            }
        })
    }

}

export {
    ArticleModel
}