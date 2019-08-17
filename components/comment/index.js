import {
    ArticleModel
} from '../../models/article.js'

const Article = new ArticleModel();

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        commentInfo: {
            type: Object
        },
        commentsCount: {
            type: Number
        }
    },

    data: {

    },

    methods: {

        onLike(event) {
            let commentID = event.currentTarget.dataset.id;
            let behavior = event.detail.behavior;
            let index = behavior == 'like' ? 1 : -1;
            Article.voteForComment(commentID, index);
        },
    }
})