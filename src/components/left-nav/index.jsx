import React, { Component } from 'react'
import {Link,withRouter} from 'react-router-dom'
import { Menu } from 'antd';
import logo from '../../assets/images/logo.png'
import './index.less'
import menuList from '../../config/menuConfig'

const { SubMenu } = Menu;

class LeftNav extends Component {
    /*
    根据menu的数据数组生成对应的标签数组
    使用map() + 递归调用
    */
    // getMenuNodes = (menuList)=>{
    //     return menuList.map(item=>{
    //         /*
    //         <Menu.Item key="1" icon={<HomeOutlined />}>
    //             <Link to="/home">首页</Link>
    //         </Menu.Item>

    //         <SubMenu key="sub1" icon={<AppstoreOutlined />} title="商品">
    //             <Menu.Item key="5" icon={<BarsOutlined />}><Link to="/category">品类管理</Link></Menu.Item>
    //             <Menu.Item key="6" icon={<ToolOutlined />}><Link to="/product">商品管理</Link></Menu.Item>
    //         </SubMenu>
    //         */
    //         if(!item.children){
    //             return (
    //                 <Menu.Item key={item.key} icon={item.icon}>
    //                     <Link to={item.key}>{item.title}</Link>
    //                 </Menu.Item>
    //             )
    //         }else{
    //             return (
    //                 <SubMenu key={item.key} icon={item.icon} title={item.title}>
    //                     {this.getMenuNodes(item.children)}
    //                 </SubMenu>
    //             )
    //         }
             
    //     })
    // }

    /*
    根据menu的数据数组生成对应的标签数组
    使用reduce() + 递归调用
    */
   getMenuNodes = (menuList)=>{
    //得到当前请求的请求路径
    const path = this.props.location.pathname;
    return menuList.reduce((pre,item)=>{
        if(!item.children){
            pre.push((
                <Menu.Item key={item.key} icon={item.icon}>
                    <Link to={item.key}>{item.title}</Link>
                </Menu.Item>
            ))
        }else{
            
            //查找一个与当前请求路径匹配的子item
            const cItem = item.children.find(cItem=>
                cItem.key === path
            )
            //如果存在，说明当前item的子列表需要打开
            if(cItem){
                this.openKey = item.key
            }
            
            pre.push((
                <SubMenu key={item.key} icon={item.icon} title={item.title}>
                    {this.getMenuNodes(item.children)}
                </SubMenu>
            ))
        }
        return pre   //不要忘记return这块
        },[])
    }
    //在第一次render之前执行一次
    //为第一个render准备数据(必须同步的)
    UNSAFE_componentWillMount(){
        this.menuNodes = this.getMenuNodes(menuList);
    }

    render() {
        //得到当前请求的请求路径
        const path = this.props.location.pathname;
        const openKey = this.openKey;

        return (
            <div className="left-nav">
                <Link to="/" className="left-nav-header">
                    <img src={logo} alt="logo" />
                    <h1>硅谷后台</h1>
                </Link>
                <Menu
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                    mode="inline"
                    theme="dark"
                    >
                    {/* <Menu.Item key="1" icon={<HomeOutlined />}>
                        <Link to="/home">首页</Link>
                    </Menu.Item>
                    <SubMenu key="sub1" icon={<AppstoreOutlined />} title="商品">
                        <Menu.Item key="5" icon={<BarsOutlined />}><Link to="/category">品类管理</Link></Menu.Item>
                        <Menu.Item key="6" icon={<ToolOutlined />}><Link to="/product">商品管理</Link></Menu.Item>
                    </SubMenu>
                    <Menu.Item key="2" icon={<UserOutlined />}>
                        <Link to="/user">用户管理</Link>
                    </Menu.Item>
                    <Menu.Item key="3" icon={<SafetyCertificateOutlined />}>
                        <Link to="/role">角色管理</Link>
                    </Menu.Item>
                    <SubMenu key="sub2" icon={<AreaChartOutlined />} title="图形图表">
                        <Menu.Item key="7" icon={<BarChartOutlined />}><Link to="/bar">柱形图</Link></Menu.Item>
                        <Menu.Item key="8" icon={<LineChartOutlined />}><Link to="/line">折线图</Link></Menu.Item>
                        <Menu.Item key="9" icon={<PieChartOutlined />}><Link to="pie">饼图</Link></Menu.Item>
                    </SubMenu>
                    <Menu.Item key="4" icon={<WindowsOutlined />}>
                        订单管理
                    </Menu.Item> */}
                    {this.menuNodes}
                    </Menu>
            </div>
        )
    }
}
/*
withRouter高阶组件
包装非路由组件，返回一个新的组件
新的组件向非路由组件传递三个属性：history,location,match
*/
export default withRouter(LeftNav)