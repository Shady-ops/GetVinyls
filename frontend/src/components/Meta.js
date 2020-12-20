import React from 'react'
import { Helmet } from 'react-helmet'

const Meta = ({ title, description, keywords }) => {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name='description' content={description} />
            <meta name='keyword' content={keywords} />
        </Helmet>
    )
}

Meta.defaultProps ={
    title: 'Welcome to our VinylShop',
    description: 'Find the best vinyls for the cheapest prices',
    keywords: 'Vinyls music vinyl disc'
}

export default Meta
