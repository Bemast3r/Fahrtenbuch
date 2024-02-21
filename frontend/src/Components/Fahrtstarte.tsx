import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import "./home.css";

const Home = () => {
  return (
    <div className='button-container'>
      <h1 className='title'>Home</h1>
      <Link to="/fahrt-erstellen">
        <Button variant="primary" size="lg">Fahrt erstellen</Button>
      </Link>
      <Link to="/fahrt-bearbeiten">
        <Button variant="primary" size="lg">Fahrt bearbeiten</Button>
      </Link>
    </div>
  );
};

export default Home;
