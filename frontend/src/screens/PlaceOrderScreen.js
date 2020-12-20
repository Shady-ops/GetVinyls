import React, { useEffect } from 'react'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import CheckoutSteps from '../components/CheckoutSteps'
import { createOrder } from "../actions/orderActions";

const PlaceOrderScreen = ({ history }) => {

    const dispatch = useDispatch()

    const cart = useSelector((state) => state.cart)

    // Calculate prices
    const addDecimals = (x) => {
        return (Math.round(x * 100) / 100).toFixed(2)
    }
    cart.itemsPrice = addDecimals(cart.cartItems.reduce((acc, item) => acc + item.price * item.qty,0))

    cart.shippingPrice = addDecimals(cart.itemsPrice > 60 ? 0 : 10)

    cart.taxPrice = addDecimals(Number((0.18 * cart.itemsPrice).toFixed(2)))

    cart.totalPrice = (Number(cart.itemsPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice)).toFixed(2)

    const orderCreate = useSelector(state => state.orderCreate)
    const { order, success, error } = orderCreate

    useEffect(()=>{
        if(success) {
            history.push(`/order/${order._id}`)
        }
        // eslint-disable-next-line
    }, [history, success])

    const placeOrderHandler = () => {
        dispatch(createOrder({
            orderItems: cart.cartItems,
            shippingAddress: cart.shippingAddress,
            paymentMethod: cart.paymentMethod,
            itemsPrice: cart.itemsPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice
        }))
    }

    return (
        <>
            <CheckoutSteps step1 step2 step3 step4 />   
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Livraison</h2>
                            <p>
                                <strong>Adresse:</strong>
                                {cart.shippingAddress.address}, {cart.shippingAddress.ciry} {' '}
                                {cart.shippingAddress.postalCode}, {' '} {cart.shippingAddress.country}
                            </p>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Méthode de Paiement</h2>
                            {cart.paymentMethod}
                        </ListGroup.Item>

                        <ListGroup.Item>
                    <h2>Article Commandés</h2>
                    {cart.cartItems.length === 0 ? (
                        <Message>Votre Panier est Vide</Message>
                    ) : (
                        <ListGroup variant='flush'>
                        {cart.cartItems.map((item, index) => (
                            <ListGroup.Item key={index}>
                            <Row>
                                <Col md={1}>
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fluid
                                    rounded
                                />
                                </Col>
                                <Col>
                                <Link to={`/product/${item.product}`}>
                                    {item.name}
                                </Link>
                                </Col>
                                <Col md={4}>
                                {item.qty} x {item.price}{' '}DT = {addDecimals(item.qty * item.price)}{' '}DTx 
                                </Col>
                            </Row>
                            </ListGroup.Item>
                        ))}
                        </ListGroup>
                    )}
                    </ListGroup.Item>
                </ListGroup>
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Resumé des Commandes</h2>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                            <Col>Articles</Col>
                            <Col>{cart.itemsPrice}{' '}DT</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                            <Col>Livraison</Col>
                            <Col>{cart.shippingPrice}{' '}DT</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                            <Col>Taxe</Col>
                            <Col>{cart.taxPrice}{' '}DT</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                            <Col>Total</Col>
                            <Col>{cart.totalPrice}{' '}DT</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            {error && <Message variant='danger'>{error}</Message>}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Button
                            type='button'
                            className='btn-block'
                            disabled={cart.cartItems === 0}
                            onClick={placeOrderHandler}
                            >
                            Continuer
                            </Button>
                        </ListGroup.Item>
                        </ListGroup>
                    </Card>
                    </Col>
            </Row> 
        </>
    )
}

export default PlaceOrderScreen
