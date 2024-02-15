import { EditOutlined, LogoutOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { Avatar, Button, Card, message, Form, Input } from 'antd';
import  { useAuth } from './../../AuthContext';
import { useNavigate } from 'react-router-dom';
import CustomModel from '../customer/components/CustomModel';
const { Meta } = Card;

export default function Profile(){
    const {logout} = useAuth();
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const [info, setInfo] = useState({
        name : '',
        _id : '',
        email : ''
    })
    const [visible, setVisible] = useState(false)

    React.useEffect(()=>{
        fetch('http://localhost:3500/api/_e/profile', {credentials : "include"})
        .then(resp => resp.json())
        .then(data => setInfo(data.info))
        .catch(error => console.log(error))
    },[])

    function employeeLogout(){
        logout()
        navigate('/')
    }

    async function updatePassword(values){
        if(values.newPassword !== values.confirmNewPassword){
            message.error('The new password must match the re-entered password.')
        }else{
            delete values.confirmNewPassword
            fetch('http://localhost:3500/api/_e/profile/update_password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body : JSON.stringify(values),
                credentials : 'include'
            })
            .then(resp => resp.json())
            .then(data => {
                if(data.success){
                    message.success(data.message)
                    form.resetFields()
                    setVisible(false)
                }else{
                    message.error(data.message)
                    throw Error(data.message)
                }
            })
            .catch(error => {
                message.error(error.message)
            })
        }
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Card
                hoverable
                style={{ width: 400, marginTop: 100 }}
                actions={[
                    <div onClick={() => setVisible(true)}><EditOutlined/> Change Password</div>,
                    <div onClick={() => employeeLogout()}><LogoutOutlined/> Logout</div>,
                ]}
            >
                <Meta
                    avatar={<Avatar shape='square'>{info.name.charAt(0)}</Avatar>}
                    title={info.name}
                    description={
                        <>
                            <p>Name: {info.name}</p>
                            <p>Email: {info.email}</p>
                        </>
                    }
                />
            </Card>
            <CustomModel isVisible={visible} closeModel={() => setVisible(false)} >
                <h2 style={{textAlign : 'center', margin : '4vh'}}>Update Password</h2>
                <Form
                    form={form}
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    style={{
                        maxWidth: 600,
                    }}
                    onFinish={ (values)=> updatePassword(values) }
                    autoComplete="off"
                >
                    <Form.Item
                        label="Current Password"
                        name="currentPassword"
                        rules={[
                            {
                            required: true,
                            message: 'Please input your password!',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="New Password"
                        name="newPassword"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="Re Enter Password"
                        name="confirmNewPassword"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </CustomModel>
        </div>
    );
}
