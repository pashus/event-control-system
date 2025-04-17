import { Admin, Resource } from "react-admin";
import jsonServerProvider from "ra-data-json-server";

const dataProvider = jsonServerProvider('https://jsonplaceholder.typicode.com');

function App() {
    return (
        <Admin dataProvider={dataProvider}>
            <Resource name="" />
        </Admin>
    )
}

export default App