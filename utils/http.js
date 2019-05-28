const app = getApp();
import {
    config
} from '../config.js'

import {
    Token
} from 'token.js'

const tips = {
    1: '',
    999: '',
    10001: 'Token已过期或Token无效',
    20000: ''
}

class HTTP {
    request({
        url,
        data = {},
        method = 'GET'
    }) {
        return new Promise((resolve, reject) => {
            wx.request({
                url: config.api_base_url + url,
                method: method,
                data: data,
                header: {
                    'Content-Type': 'application/json',
                    'token': wx.getStorageSync('token')
                },
                success: (res) => {
                    let code = res.statusCode.toString();
                    if (code.startsWith('2')) {
                        resolve(res.data);
                    } else {
                        reject(res.data);
                        if (code == '401') {
                            const token = new Token();
                            token.getToken(getApp().globalData.loginCode).then(res => {
                                this.request({
                                    url: url,
                                    method: method,
                                    data: data
                                });
                            })
                        }
                        // let errorCode = res.data.errorCode;
                        // this._show_error(errorCode);
                    }
                },
                fail: (err) => {
                    reject();
                    this._show_error(1);
                }
            })
        })
    }


    _show_error(errorCode) {
        if (!errorCode) {
            errorCode = 1;
        }
        const tip = tips[errorCode];
        wx.showToast({
            title: tip ? tip : tips[1],
            icon: 'none',
            duration: 2000,
            mask: false,
        })
    }
}

export {
    HTTP
}