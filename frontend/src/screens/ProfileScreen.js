import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col, Table } from 'react-bootstrap'
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getUserDetails, updateUserProfile } from '../actions/userActions'
import { ListMyOrders } from "../actions/orderActions";

const ProfileScreen = ({ location, history }) => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState(null)

    const dispatch = useDispatch()

    const userDetails = useSelector(state => state.userDetails)
    const { loading, error, user } = userDetails

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const userUpdateProfile = useSelector(state => state.userUpdateProfile)
    const { success } = userUpdateProfile

    const orderListMy = useSelector(state => state.orderListMy)
    const { loading: loadingOrders, error: errorOrders, orders } = orderListMy

    useEffect(()=>{
        if(!userInfo) {
            history.push('/login')
        } else {
            if (!user.name) {
                dispatch(getUserDetails('profile'))
                dispatch(ListMyOrders())
            } else {
                setName(user.name)
                setEmail(user.email)
            }
        }
    },[dispatch, history, userInfo, user])

    const submitHandler = (e) => {
        e.preventDefault()

        if(password !== confirmPassword) {
            setMessage('Passwords do not match')
        } else {
            dispatch(updateUserProfile({ id: user._id, name, email, password }))
        }
    }

    return (
        <Row>
            <Col >
                <h2>Profil Utilisateur</h2>
                {message && <Message variant='danger'> { message } </Message>}
                {error && <Message variant='danger'> { error } </Message>}
                {success && <Message variant='success'>Profil mis à jour</Message>}
                {loading && <Loader/>}
                <Form onSubmit={submitHandler}>

                    <Form.Group controlId='name'>
                        <Form.Label>Nom et Prénom</Form.Label>
                        <Form.Control
                            type='name'
                            placeholder='Nom et Prénom'
                            value={name}
                            onChange={e => setName(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='email'>
                        <Form.Label>Adresse Email</Form.Label>
                        <Form.Control
                            type='email'
                            placeholder='Adresse Email'
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='password'>
                        <Form.Label>Mot de passe</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Mot de passe'
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='confirmPassword'>
                        <Form.Label>Confirmer mot de passe</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Confirmer mot de passe'
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Button type='submit' variant='primary'>
                    Mettre à jour
                    </Button>
                </Form>
            </Col>
            <Col>
             <h2>Mes Commandes</h2>
             {loadingOrders ? <Loader /> : errorOrders ? <Message variant='danger'> {errorOrders} </Message> : (
                 <Table striped bordered hover responsive className='table-sm'>
                     <thead>
                         <tr>
                             <th>ID</th>
                             <th>DATE</th>
                             <th>TOTAL</th>
                             <th>PAYÉ</th>
                             <th>DÉLIVERÉ</th>
                             <th></th>
                         </tr>
                     </thead>
                     <tbody>
                         {orders.map((order) => (
                             <tr key={order._id}>
                                 <td> {order._id} </td>
                                 <td> {order.createdAt.substring(0, 10)} </td>
                                 <td> {order.totalPrice} </td>
                                 <td>
                                     {order.isPaid ? (
                                         order.paidAt.substring(0, 10)
                                     ) : (
                                         <i className='fas fa-times' style={{ color: 'red' }}></i>
                                     )}
                                 </td>
                                 <td>
                                     {order.isDelivered ? (
                                         order.deliveredAt.substring(0, 10)
                                     ) : (
                                         <i className='fas fa-times' style={{ color: 'red' }}></i>
                                     )}
                                 </td>
                                 <td>
                                     <LinkContainer to={`/order/${order._id}`} >
                                         <Button variant='light' className='btn-sm'>Détails</Button>
                                     </LinkContainer>
                                 </td>
                             </tr>
                         ))}
                     </tbody>
                 </Table>
             )}
            </Col>
        </Row>
    )
}

export default ProfileScreen
