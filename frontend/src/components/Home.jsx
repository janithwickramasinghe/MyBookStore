import { useNavigate } from 'react-router-dom';


const  Home = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h2>Welcome to the Home Page!!!</h2>


      <div>
        <button onClick={() => navigate('/complete-profile')}>
            Complete Profile
        </button>
      </div>

    </div>
  );
}

export default Home;
