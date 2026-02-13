import { BrowserRouter } from "react-router-dom";

import "normalize.css";
import { Toaster } from "sonner";
import { SWRConfig } from "swr";

import { AuthContextProvider } from "@contexts/AuthContext";
import { TablesSchemaContextProvider } from "@contexts/TablesSchemaContext";

import MainLayout from "./MainLayout";
import Router from "./Router";

const SWR_CONFIG = {
  keepPreviousData: true,
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
} as const;

function App() {
  return (
    <BrowserRouter>
      <SWRConfig value={SWR_CONFIG}>
        <AuthContextProvider>
          <TablesSchemaContextProvider>
            <MainLayout>
              <Router />
            </MainLayout>
          </TablesSchemaContextProvider>
        </AuthContextProvider>
      </SWRConfig>
      <Toaster position="top-center" richColors />
    </BrowserRouter>
  );
}

export default App;
