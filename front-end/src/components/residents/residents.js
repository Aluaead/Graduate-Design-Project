import React, { Component } from 'react';
import { Table,  Icon, Layout,Input,Modal,Button} from 'antd';
import {HashRouter as Router,Route,Link,NavLink,Redirect} from 'react-router-dom';
import 'whatwg-fetch';
import Forms from './addResident';

const {Search} = Input;


class Resident extends Component {
    constructor(props){
        super(props);
        this.state = { 
            dataSource:[],
            visible: false,
         };
        this.columns = [
            {
              title: '房主基本信息',
              dataIndex: 'user_name',
              key: 'name',
              render: text => <a>{text}</a>,
            },
            {
              title: '电话号码',
              dataIndex: 'user_phone',
              key: 'number',
            },
            {
              title: '地址',
              dataIndex: 'user_address',
              key: 'address',
            },
            {
                title: '购房时间',
                dataIndex: 'user_time_purchase',
                key: 'time',
            },
            {
                title: '合同',
                dataIndex: 'user_contract',
                key: 'contract',
            },
            {
              title: '操作',
              key: 'action',
              render: (text, record,index) => (
                <span >
                    <NavLink 
                        style={{padding:10}} 
                        to={{pathname:'/detail/'+index}}>
                     <Button type="primary" ghost
                            size="small">
                      查看
                      </Button>
                    </NavLink>
                    <NavLink 
                        style={{padding:10}} 
                        to={{pathname:'/modify/'+index}}>
                     <Button type="primary" ghost
                            size="small">
                      修改
                      </Button>
                    </NavLink>
                    <Button type="danger" ghost size="small" onClick={this.onDelete.bind(this,this.state.dataSource[index].user_id,index)}>删除</Button>
                </span>
              ),
            },
          ];
    }

    componentDidMount(){
        fetch('/userInfo', {
            method: "GET",
            mode: "cors",
            headers:{
                'Content-Type': 'application/json',
                'Accept':'Access-Control-Allow-Origin'
            },
            
        }).then(response => response.json())
            .then(result => {
                this.setState({dataSource:result.data})
                // console.log(this.state.dataSource);
            }).catch(function (e) {
            console.log("fetch fail");
        });
      }

    showModal = () => {
        this.setState({
          visible: true,
        });
      };
    
    handleOk = (e) => {    
        fetch('/userInfo/insertone', {
            method: "POST",
            mode: "cors",
            headers:{
                'Content-Type': 'application/json',
                'Accept':'Access-Control-Allow-Origin'
            },
            body:JSON.stringify({
                　'name':this.formRef.getItemsValue().name,
                　'idenity' : this.formRef.getItemsValue().idenity,
                  'phone':this.formRef.getItemsValue().number,
                  'homeowners':this.formRef.getItemsValue().family,
                  'address':this.formRef.getItemsValue().address,
                  'contract':this.formRef.getItemsValue().contract,
               　　}),
            
        }).then(response => response.json())
            .then(result => {
                // console.log(this.state.dataSource);
            }).catch(function (e) {
            console.log("fetch fail");
        });
        this.setState({
            visible: false,
        });
        setTimeout(()=>{
            fetch('/userInfo', {
                method: "GET",
                mode: "cors",
                headers:{
                    'Content-Type': 'application/json',
                    'Accept':'Access-Control-Allow-Origin'
                },
                
            }).then(response => response.json())
                .then(result => {
                    this.setState({dataSource:result.data})
                    // console.log(this.state.dataSource);
                }).catch(function (e) {
                console.log("fetch fail");
            });
        },100)
    };
    
    handleCancel = (e) => {
        console.log(e);
        this.setState({
          visible: false,
        });
    };
    
    // 删除表格列
    onDelete(id,index){
        console.log(id,index);
        const dataSource = [...this.state.dataSource];
        dataSource.splice(index, 1);//index为获取的索引，后面的 1 是删除几行
        fetch('/userInfo/del',{
            method:'POST',
            mode: "cors",
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                　　'user_id' : id
               　　}),
        }).then(respose=>respose.json())
            .then(result=>{
                // console.log(result);
            }).catch(function(e){
                console.log("fetch fail");
            })
        this.setState({ dataSource });
    }
    
    render() { 
        
        return ( 
            // <li>单元</li>
            <Layout>
                <div style={{
                    marginTop:12,
                    borderBottom:'1px solid #bbb',
                    paddingBottom:5,
                    fontSize:14,
                    color:'#607D8B'}}>
                <span>小区住户信息</span>
                <a style={{float: 'right', marginRight: '55px'}} onClick={this.showModal}>添加信息</a>
                <Modal title="修改信息"
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        okText="保存"
                        cancelText="取消"
                    >
                        <Forms
                            wrappedComponentRef={(form) => this.formRef = form}      
                        />
                    </Modal>
                </div>
                <div style={{marginTop:15}}>
                    <Search
                    placeholder="input search text"
                    onSearch={value => console.log(value)}
                    style={{ width: 200 }}
                    />
                    
                </div>
                <Table 
                    columns={this.columns} 
                    dataSource={this.state.dataSource} 
                    style={{marginTop:20}}  
                />
            </Layout>
            
         );
    }
}
 
export default Resident;