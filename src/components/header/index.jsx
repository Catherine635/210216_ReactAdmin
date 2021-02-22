import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {formatDate} from '../../utils/dateUtils'
import {reqWeather} from '../../api'
import menuList from '../../config/menuConfig'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import LinkButton from '../link-button'
import './index.less'

const { confirm } = Modal;

class Header extends Component {
    state={
        currentTime:formatDate(Date.now()),  //当前时间字符串
        dayPictureUrl:'',   //天气图片url
        weather:''   //天气的文本
    }
    getTime=()=>{
        //每隔一秒获取当前时间，并更新状态数据currentTime
        this.intervalID = setInterval(()=>{
            const currentTime = formatDate(Date.now());
            this.setState({currentTime})
        },1000)
    }
    getWeather= async ()=>{
        //调用接口请求函数获取数据
        const {dayPictureUrl,weather} = await reqWeather("北京");
        this.setState({dayPictureUrl,weather})
    }
    getTitle=()=>{
        //得到当前请求路径
        const path = this.props.location.pathname;
        let title;
        menuList.forEach(item=>{
            if(item.key === path){  //如果当前item对象的key与path一样，item的title就是需要显示的title
                title = item.title;
            }else if(item.children){
                //在所有子item中查找匹配的
                const cItem = item.children.find(cItem=>(cItem.key===path))
                //如果有值才说明有匹配的
                if(cItem){
                    //取出他的title
                    title = cItem.title;
                }
            }
        })
        return title;
    }
    logout=()=>{
        //显示确认框
        confirm({
            icon: <ExclamationCircleOutlined />,
            content: '确定退出吗？',
            onOk: ()=>{
                //删除保存的user数据
                storageUtils.removeUser();
                memoryUtils.user = {};
                //跳转到login
                this.props.history.replace('/login');
            },
            onCancel() {
              console.log('Cancel');
            },
          });
    }

    /*
    第一次render()之后执行一次
    一般在此执行异步操作：发ajax请求/启动定时器
    */
    componentDidMount(){
        //获取当前时间
        this.getTime();
        //获取当前天气
        this.getWeather();
    }
    //当前组件卸载之前调用
    componentWillUnmount(){
        clearInterval(this.intervalID)
    }
    render() {
        const {currentTime,dayPictureUrl,weather} = this.state;
        //得到当前需要显示的title
        const title = this.getTitle();
        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎，{memoryUtils.user.username}</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt="weather" />
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)