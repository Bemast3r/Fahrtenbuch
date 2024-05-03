import Spinner from 'react-bootstrap/Spinner'


const Loading = () => {
  return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: "white" }}>
          <Spinner animation="grow" />
      </div>
  );
};


export default Loading;