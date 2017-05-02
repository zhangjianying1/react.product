
import superagent from 'superagent';
import publicUtil from './publicUtil.js';
import {loading, setError} from '../config/action';

let bBtn = true;
const requests = [];
/**
 * ajax
 * 每次加载信息都会显示加载loading
 */
 class Request {
    constructor(props){
        this.dispatch = (props && props.dispatch) || function(){};
        this.requests = [];
    }
    postOnce(obj){

        if (!bBtn) {
            return;
        }
        bBtn = false;
        // 加载中
        this.dispatch(loading(0));


        let json = JSON.stringify({
            cmd: obj.cmd,
            func: obj.func,
            machId: 0,
            token: publicUtil.store.getData('token') || '',
            msg: obj.data || {}
        });



        superagent.post('http://192.168.1.106:3300/h5/interface' || '/h5/interface').set('Content-Type', 'application/x-www-form-urlencoded').send({msg: json})
            .on('error', (e) => {
                this.dispatch(loading(2));
                bBtn = true;
            })
            .then((res) => {

            if (res.ok) {
                let body = res.body;

                if (body.code === '0000') {
                    obj.success(body.result);
                } else if (body.code == '1046' || body.code == '0999') {
                    obj.success(body.code);
                } else  if (body.code == '0008') {
                    publicUtil.store.setData('token', '');
                } else {
                    obj.success(body.result);
                    this.dispatch(setError({prompt: true, msg: body.msg}));
                }

                // 完成
                this.dispatch(loading(1));
            } else {
                // 失败
                this.dispatch(loading(2));
            };
            bBtn = true;
        })




    }

    /**
     * 串行请求
     * @param obj
     */
    serialPost(obj){

        let json = JSON.stringify({
            cmd: obj.cmd,
            func: obj.func,
            machId: 0,
            token: publicUtil.store.getData('token') || '',
            msg: obj.data || {}
        });

        if (bBtn) {
            this.dispatch(loading('00'));
            bBtn = false;
            superagent.post('http://192.168.1.106:3300/h5/interface' || '/h5/interface').set('Content-Type', 'application/x-www-form-urlencoded').send({msg: json})
                .on('error', (e) => {
                    this.dispatch(loading('22'));
                    bBtn = true;
                })
                .then((res) => {



                if (res.ok) {
                    let body = res.body;


                    if (body.code === '0000') {
                        obj.success(body.result);
                    } else if (body.code == '0008') {


                        publicUtil.store.setData('token', '');

                        location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx3b428b4b935fa86b&redirect_uri=" + encodeURIComponent('http://' +
                                location.host + location.hash) + "&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect";

                    } else {

                        // 登录
                        if (obj.func == 'weixin') {
                            location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx3b428b4b935fa86b&redirect_uri=" + encodeURIComponent('http://' +
                                    location.host + location.hash) + "&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect";
                        } else {
                            this.dispatch(setError({prompt: true, msg: body.msg}));
                        }

                    }

                };
                this.dispatch(loading(1));
                bBtn = true;

                    // 有其他请求
                if (requests.length > 0) {
                    this.serialPost(requests.splice(0, 1)[0]);
                }
            })

        } else {

            requests.push(obj);
        }


    }

}

export default Request