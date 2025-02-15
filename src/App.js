import logo from './logo.svg';
import ostv from './ostv.png'
import './App.css';
import Tv from './Tv.js';
import { initializeApp } from "firebase/app";
import { getStorage, ref, listAll, uploadBytes, getDownloadURL } from "firebase/storage";
import react from 'react';

const firebaseConfig = {
  apiKey: "AIzaSyDdvmlYE1K1ABaxtQFY8cP0bg40px5Ye28",
  authDomain: "mems-c39f6.firebaseapp.com",
  projectId: "mems-c39f6",
  storageBucket: "mems-c39f6.appspot.com",
  messagingSenderId: "513012563483",
  appId: "1:513012563483:web:5079ef4abac4da434242be"
};

class App extends react.Component {

  constructor(props) {
    super(props);
    const app = initializeApp(firebaseConfig);
    this.storage = getStorage(app);

    this.state = {
      file: null,
      uploadedUrl: '',
      loading: false,
      memDate: '',
      text: '',
      showUpload: false
    };

    // console.log(app)
    // const storage = getStorage();
    // const listRef = ref(storage, '/');

    // res = await listRef.listAll();
    // res.items.forEach((itemRef) => {
    // // All the items under listRef.
    // console.log("item", itemRef);
    // });
  }
  componentDidMount() {
    document.title = "Rittida"
  }

  uploadImage = async () => {
    try {
      if (!this.state.file) {
        alert('Please select a file first');
        return;
      }

      this.setState({ loading: true });

      const filename = `/${Date.now()}-${this.state.file.name}`;
      const storageRef = ref(this.storage, filename);

      const metadata = {
        contentType: this.state.file.type,
        customMetadata: {
          memDate: this.state.memDate,
          text: this.state.text
        }
      };

      // Upload file to Firebase with metadata
      const snapshot = await uploadBytes(storageRef, this.state.file, metadata);
      const downloadURL = await getDownloadURL(snapshot.ref);

      this.setState({
        uploadedUrl: downloadURL,
        file: null,
        memDate: '',
        text: '',
        loading: false
      });

      // Reset the file input
      document.getElementById('fileInput').value = '';
      alert('Upload successful!');
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Upload failed. Please try again.');
      this.setState({ loading: false });
    }
  };

  handleFileChange = (e) => {
    if (e.target.files[0]) {
      this.setState({ file: e.target.files[0] });
    }
  };

  toggleView = () => {
    this.setState(prevState => ({
      showUpload: !prevState.showUpload
    }));
  };

  render() {
    return (
      <div className="App min-h-screen w-full bg-cream border-solid border-2 border-indigo-600
      flex flex-col items-center relative p-4 min-w-[1280px]" >
        <button
          onClick={this.toggleView}
          className="fixed top-4 right-4 p-2 bg-blue-500 text-white rounded z-50"
        >
          {this.state.showUpload ? 'Show TV' : 'Show Upload'}
        </button>

        {this.state.showUpload ? (
          <div className="w-full max-w-md mt-16 space-y-4">
            <div>
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={this.handleFileChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <input
                type="text"
                value={this.state.memDate}
                onChange={(e) => this.setState({ memDate: e.target.value })}
                placeholder="Enter date"
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <textarea
                value={this.state.text}
                onChange={(e) => this.setState({ text: e.target.value })}
                placeholder="Enter text description"
                className="w-full p-2 border rounded h-24"
              />
            </div>

            <button
              onClick={this.uploadImage}
              disabled={this.state.loading}
              className="w-full p-2 bg-blue-500 text-white rounded"
            >
              {this.state.loading ? 'Uploading...' : 'Upload Image'}
            </button>

            {this.state.uploadedUrl && (
              <div className="mt-4 break-words">
                <p>Uploaded successfully!</p>
                <p>URL: {this.state.uploadedUrl}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full flex justify-center mt-8 min-w-[1280px]">
            <Tv />
          </div>
        )}
      </div>
    );
  }
}

export default App;
