import { Routes, Route } from "react-router-dom"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from "../pages/index"
import NotFound from "../pages/404"
import NamePage from "@/pages/names/[name]"
const ArweaveRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/names/:name" element={<NamePage />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
)

export default ArweaveRoutes
