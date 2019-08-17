Component({
    data: {
        selected: 0,
        "selectedColor": "#8d3cff",
        "backgroundColor": "#ffffff",
        "color": "#c7c7c7",
        list: [{
            "selectedIconPath": "/images/tab/home-on.png",
            "pagePath": "/pages/home/home",
            "text": "广场",
            "iconPath": "/images/tab/home.png"
        }, {
            "selectedIconPath": "/images/tab/discovery-on.png",
            "pagePath": "/pages/discovery/discovery",
            "text": "发现",
            "iconPath": "/images/tab/discovery.png"
        }, {
            "selectedIconPath": "/images/tab/addition.png",
            "pagePath": "/pages/addition/addition",
            "iconPath": "/images/tab/addition.png"
        }, {
            "selectedIconPath": "/images/tab/store-on.png",
            "pagePath": "/pages/store/store",
            "text": "商城",
            "iconPath": "/images/tab/store.png"
        }, {
            "selectedIconPath": "/images/tab/user-on.png",
            "pagePath": "/pages/user/user",
            "text": "我的",
            "iconPath": "/images/tab/user.png"
        }]
    },
    attached() {},
    methods: {
        switchTab(e) {
            const data = e.currentTarget.dataset
            const url = data.path
            wx.switchTab({
                url
            })
            this.setData({
                selected: data.index
            })
            console.log(data)
        }
    }
})