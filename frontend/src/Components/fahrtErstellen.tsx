import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import "./fahrtErstellen.css";

const fahrtErstellen = () => {
  return (
    <div className="form-wrapper">
      <div className="form-container">
        <Form>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridFahrer" className="form-group">
              <Form.Label className="form-label">Fahrer</Form.Label>
              <Form.Control type="text" placeholder="Fahrer" className="form-control" />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridKennzeichen" className="form-group">
              <Form.Label className="form-label">Kennzeichen</Form.Label>
              <Form.Control type="text" placeholder="Kennzeichen" className="form-control" />
            </Form.Group>
          </Row>

          <Form.Group className="mb-3 form-group" controlId="formGridLenkzeit">
            <Form.Label className="form-label">Lenkzeit</Form.Label>
            <Form.Control type="number" placeholder="Lenkzeit" className="form-control" />
          </Form.Group>

          <Form.Group className="mb-3 form-group" controlId="formGridArbeitszeit">
            <Form.Label className="form-label">Arbeitszeit</Form.Label>
            <Form.Control type="number" placeholder="Arbeitszeit" className="form-control" />
          </Form.Group>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridKilometerstand" className="form-group">
              <Form.Label className="form-label">Kilometerstand</Form.Label>
              <Form.Control type="number" className="form-control" />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridKilometerende" className="form-group">
              <Form.Label className="form-label">Kilometerende</Form.Label>
              <Form.Control type="number" className="form-control" />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridPause" className="form-group">
              <Form.Label className="form-label">Pause</Form.Label>
              <Form.Control type="number" className="form-control" />
            </Form.Group>
          </Row>

          <Form.Group className="mb-3 form-group" controlId="formGridCheckbox">
            <Form.Check type="checkbox" label="Check me out" className="checkbox-label" />
          </Form.Group>

          <Button variant="primary" type="submit" className="submit-button">
            Absenden
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default fahrtErstellen;
