import React, { Component } from 'react'
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import './login.less'
import logo from '../../assets/images/logo.png'
import {reqLogin} from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import {Redirect} from 'react-router-dom'

//登录的路由组件
export default class Login extends Component {
    formRef = React.createRef();

    handleSubmit = (e)=>{
        //阻止事件的默认行为
        e.preventDefault();
        //得到form对象
        const form = this.formRef.current;
        //获取表单的输入数据
        const values = form.getFieldsValue();
        console.log(values)
    }

    onFinish = async (values)=>{
        //console.log('Received values of form: ', values);
        const {username,password} = values;

        // reqLogin(username,password).then(response=>{
        //     console.log("成功了",response.data)
        // }).catch(error=>{
        //     console.log("失败了",error)
        // })

        //使用async await简化代码
        //try {
            const result = await reqLogin(username,password);
            //console.log("请求成功",response.data)
            //const result = response.data;
            
            //保存user
            memoryUtils.user = result.data; //保存在内存中
            storageUtils.saveUser(result.data); //保存到local中

            if(result.status === 0){
                message.success("登陆成功！")
                this.props.history.replace('/');
            }else{
                message.error(result.msg)
            }
        // } catch(error) {
        //     console.log("请求失败",error)
        //     alert(error.message)
        // }
        
    };

    //对密码进行自定义校验
    validatePWD = (rule,value)=>{
        if(!value){
            return Promise.reject('密码必须输入');
        }else if(value.length<4){
            return Promise.reject('密码长度不能小于4位');
        }else if(value.length>12){
            return Promise.reject('密码长度不能大于12位');
        }else if(!/^[a-zA-Z0-9_]+$/.test(value)){
            return Promise.reject('密码必须是英文、数字或下划线组成');
        }else{
            return Promise.resolve();
        }
    }

    render() {
        //如果用户已经登录，自动跳转到管理界面
        const user = memoryUtils.user;
        if(user && user._id){
            return <Redirect to="/" />
        }

        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo" />
                    <h1>React项目：后台管理系统</h1>
                </header>
                <section className="login-content">
                    <h2>用户登录</h2>
                    <Form
                        onFinish={this.onFinish}
                        name="normal_login"
                        className="login-form"
                        ref={this.formRef}
                        >
                        <Form.Item
                            name="username"
                            rules={[     //声明式验证，直接使用别人定义好的验证规则进行验证
                            {
                                required: true,
                                message: '用户名必须输入',
                                whitespace:true
                            },
                            {
                                min:4,
                                message:'用户名至少4位'
                            },
                            {
                                max:12,
                                message:'用户名最多12位'
                            },
                            {
                                pattern:/^[a-zA-Z0-9_]+$/,
                                message:'用户名必须是英文、数字或下划线组成'
                            }
                            ]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                            {
                                validator:this.validatePWD
                            },
                            ]}
                        >
                            <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="密码"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                            登录
                            </Button>
                        </Form.Item>
                        </Form>
                </section>
            </div>
        )
    }
}

/*
高阶函数
一类特别的函数 1 接收函数类型的参数 2 返回值是函数
常见高阶函数：定时器setTimeOut和setInterval,Promise,数组遍历相关(forEach,filter,map,reduce,find,findIndex),函数对象的bind()
高阶函数更具动态，更加具有扩展性

高阶组件
本质就是一个函数 接收一个组件，返回一个新组件，新组件内部渲染被包装，包装组件会向被包装组件传入特定属性
作用：扩展组件的功能
高阶组件也是一个高阶函数，接收一个组件函数，返回时一个新的组件函数
*/

/*
包装Form组件，生成一个新的组件:Form(login)
新组件会向Form组件传递一个强大的对象属性：form

1 前台表单验证
2 收集表单输入数据

accenture
15724501909@163.com
ZMlh1306120226
*/

/*
async和await
1作用  简化promise对象的使用：不用再使用.then来指定成功/失败的回调函数
       以同步编码方式(没有回调函数了)实现异步流程
2哪里用await  在返回promise的表达式的左侧写await：不想要promise，想要promise异步执行的成功的value数据
3哪里用async  await所在的函数(最近的)定义的左侧写async
*/