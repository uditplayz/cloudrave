import FileUpload from './components/FileUpload'; // Import the component
import './App.css'; // This is for your main app styles

function App() {
  return (
    <div>
      <h1>My Cloud Storage App</h1>
      
      {/* This will FileUpload component.
        we still need to set up login to get an 'authToken'.
      */}
      <FileUpload />
    </div>
  );
}

export default App;