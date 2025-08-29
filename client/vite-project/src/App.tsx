import AppRoutes from './router/AppRoutes'
import Mainlayout from './layouts/layout';
function App() {

  return (
    <>
      {/* <Router> */}
        <Mainlayout>
          <AppRoutes />
        </Mainlayout>
      {/* </Router> */}
    </>
  )
}

export default App
