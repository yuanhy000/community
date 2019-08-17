Component({

    properties: {
        datas: {
            type: Object,
            observer: "propertyDataChange"
        },
        keyName: {
            type: String
        }
    },

    data: {

    },

    methods: {
        chooseTopic(event) {
            const id = event.currentTarget.dataset.id;
            this.triggerEvent('getSelectTopic', {
                id: id,
                chooseTopic: false
            }, {});
        },

        propertyDataChange: function(newVal) {
            let topicName = this.getHilightStrArray(newVal.name, this.properties.keyName)
            this.setData({
                topic: newVal,
                topicName: topicName
            })
        },

        getHilightStrArray: function(str, key) {
            return str.replace(new RegExp(`${key}`, 'g'), `%%${key}%%`).split('%%');
        }
    }
})