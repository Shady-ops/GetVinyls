import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom' 
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { listProductsDetails, updateProduct } from '../actions/productActions'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'

const ProductEditScreen = ({ match, history }) => {
    const productId = match.params.id

    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [image, setImage] = useState('')
    const [brand, setBrand] = useState('')
    const [category, setCategory] = useState('')
    const [countInStock, setCountInStock] = useState(0)
    const [description, setDescription] = useState('')
    const [uploading, setUploading] = useState(false)
    const [metaDescription, setMetaDescription] = useState('')
    const [metaTitle, setMetaTitle] = useState('')

    const dispatch = useDispatch()

    const productDetails = useSelector(state => state.productDetails)
    const { loading, error, product } = productDetails

    const productUpdate = useSelector(state => state.productUpdate)
    const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = productUpdate

    useEffect(()=>{
        if(successUpdate) {
            dispatch({ type: PRODUCT_UPDATE_RESET })
            history.push('/admin/productlist')
        } else {
            if(!product.name || product._id !== productId) {
                dispatch(listProductsDetails(productId))
            } else {
                setName(product.name)
                setPrice(product.price)
                setImage(product.image)
                setBrand(product.brand)
                setCategory(product.category)
                setCountInStock(product.countInStock)
                setDescription(product.description)
                setMetaDescription(product.metaDescription)
                setMetaTitle(product.metaTitle)
            }
        }
    },[dispatch, productId, history, product, successUpdate])

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('image', file)
        setUploading(true)

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }

            const { data } = await axios.post('/api/upload', formData, config)
            setImage(data)
            setUploading(false)
        } catch (error) {
            console.error(error)
            setUploading(false)
        }
    }

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateProduct({
            _id: productId,
            name,
            price,
            image,
            brand,
            category,
            description,
            countInStock,
            metaDescription,
            metaTitle
        }))
    }

    return (
        <>
            <Link to='/admin/productlist' className='btn btn-light my-3'>
                Précédent
            </Link>
        
            <FormContainer>
                <h1>Modifier Article</h1>
                {loadingUpdate && <Loader />}
                {errorUpdate && <Message variant='danger'> {errorUpdate} </Message>}
                {loading ? <Loader /> : error ? <Message variant='danger'> {error} </Message> : 
                (
                <Form onSubmit={submitHandler}>

                    <Form.Group controlId='name'>
                        <Form.Label>Nom</Form.Label>
                        <Form.Control
                            type='name'
                            placeholder='Nom'
                            value={name}
                            onChange={e => setName(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='price'>
                        <Form.Label>Prix</Form.Label>
                        <Form.Control
                            type='number'
                            placeholder='Prix'
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='image'>
                    <Form.Label>Image</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Image url'
                            value={image}
                            onChange={e => setImage(e.target.value)}
                        ></Form.Control>
                        <Form.File
                            id='image-file'
                            label='Choisir un fichier'
                            custom
                            onChange={uploadFileHandler}></Form.File>
                            {uploading && <Loader />}
                    </Form.Group>

                    <Form.Group controlId='brand'>
                    <Form.Label>Brand</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Brand'
                            value={brand}
                            onChange={e => setBrand(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='countInStock'>
                        <Form.Label>Quantité</Form.Label>
                        <Form.Control
                            type='number'
                            placeholder='Quantité'
                            value={countInStock}
                            onChange={e => setCountInStock(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    
                    <Form.Group controlId='category'>
                    <Form.Label>Categorie</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Categorie'
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='description'>
                    <Form.Label>Description</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Description'
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='metaDescription'>
                    <Form.Label>Meta Description</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Meta Description'
                            value={metaDescription}
                            onChange={e => setMetaDescription(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='metaTitle'>
                    <Form.Label>Meta Title</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Meta Title'
                            value={metaTitle}
                            onChange={e => setMetaTitle(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Button type='submit' variant='primary'>
                    Modifier
                    </Button>
                </Form>

                )}
                
            </FormContainer>
        </>
    )
}

export default ProductEditScreen
