import { Routes, Route } from "react-router";
import { Home } from "../pages/Home";
import { History } from "../pages/History";
import { DefaultLayout } from "../layouts/DefaultLayout";


export function Router() {
    return (
        <Routes>
            <Route path="/" element={<DefaultLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/history" element={<History />} />
            </Route>

            {/* <Route path="/admin" element={<AdminLayout/>}> //se tivessemos um layout para admin, e aí para acessar products seria /admin/products na url
                <Route path="/products" element={Products}/>
            </Route> */}
        </Routes>
    )
}