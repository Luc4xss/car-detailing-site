import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
// 1. Importar as ferramentas do TanStack Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Settings from "./pages/Settings/Settings";
import AdminPanel from "./pages/AdminPanel/AdminPanel";
import Budgets from "./pages/Budgets/Budgets";

// 2. Criar o cliente FORA da função do componente (para não resetar o cache no re-render)
const queryClient = new QueryClient();

function App() {
  return (
    // 3. Envolver tudo com o Provider
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Login />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/admin/panel" element={<AdminPanel />} />
          <Route path="/budgets/panel" element={<Budgets />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;