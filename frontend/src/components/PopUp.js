import React, { useState } from 'react'
import { Alert, Button } from 'react-bootstrap'

const PopUp = () => {
    const [show, setShow] = useState(true);

  return (
    <>
      <Alert show={show} variant="primary">
        <Alert.Heading>Hey, merci pour votre visite!</Alert.Heading>
        <p>
        Ce site s'intègre dans le cadre d'un projet académique. Les produits proposés sont fictifs. Merci pour votre compréhension. 
        </p>
        <hr />
        <div className="d-flex justify-content-end">
          <Button onClick={() => setShow(false)} variant="outline-primary">
            Cliquez ici pour sortir
          </Button>
        </div>
      </Alert>
    </>
  );
}

export default PopUp
