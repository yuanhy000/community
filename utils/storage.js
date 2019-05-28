const dtime = '_deadtime'
class StorageModel {

    put(k, v, t) {
        wx.setStorageSync(k, v)
        let seconds = parseInt(t);
        if (seconds > 0) {
            let timestamp = Date.parse(new Date());
            timestamp = timestamp / 1000 + seconds;
            wx.setStorageSync(k + dtime, timestamp + "")
        } else {
            wx.removeStorageSync(k + dtime)
        }
    }

    get(k, def) {
        let deadtime = parseInt(wx.getStorageSync(k + dtime))
        if (deadtime) {
            if (parseInt(deadtime) < Date.parse(new Date()) / 1000) {
                if (def) {
                    return def;
                } else {
                    return;
                }
            }
        }
        let res = wx.getStorageSync(k);
        if (res) {
            return res;
        } else {
            return def;
        }
    }

    remove(k) {
        wx.removeStorageSync(k);
        wx.removeStorageSync(k + dtime);
    }

    clear() {
        wx.clearStorageSync();
    }
}


export {
    StorageModel
}