import './App.css';
import PDFViewer from './components/PDFViewer';

function App() {
  return (
    <div className="App">
      <PDFViewer url={"https://www.aeee.in/wp-content/uploads/2020/08/Sample-pdf.pdf"}/>
    </div>
  );
}

export default App;
