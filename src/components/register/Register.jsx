import { Link } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button'
import { Container } from "react-bootstrap";

function Register() {

  const handleSignUp = (e) => {
    e.preventDefault();
  }

  return (
    <Container className="p-5 "  >
            <Row className="justify-content-center">
              <Col sm={6}>
                <h1 className="text-center">Sign up</h1>
                <Link to={"/login"}>
                    <p className="text-center">Have an account? </p>
                </Link>
                <Form onSubmit={handleSignUp}>
                    <Form.Group
                        className="mb-3"
                        controlId="username"
                    >
                        <Form.Label className="text-start">Username</Form.Label>
                        <Form.Control type="text" />
                    </Form.Group>
                    <Form.Group
                        className="mb-3"
                        controlId="email"
                    >
                        <Form.Label className="text-start">Email</Form.Label>
                        <Form.Control type="email" />
                    </Form.Group>
                    <Form.Group
                        className="mb-3"
                        controlId="password"
                    >
                        <Form.Label className="text-start ms-0">Password</Form.Label>
                        <Form.Control type="password" rows={3} />
                    </Form.Group>
                    <Button type="submit">
                      Sign up
                    </Button>
                </Form>
              </Col>
            </Row>
        </Container>
  )
}

export default Register;