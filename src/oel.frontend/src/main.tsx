import { Toaster } from 'sonner'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import './index.css'

import MainLayout from '@/layouts/MainLayout'
import Beers from '@/pages/Beers'
import BeerLogs from '@/pages/BeerLogs'
import NotFound from '@/pages/NotFound'
import Home from '@/pages/Home'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>

      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path='beers' element={<Beers />} />
            <Route path='logs' element={<BeerLogs />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>

      <Toaster position='top-center' />
      <ReactQueryDevtools initialIsOpen={false} buttonPosition='top-right' />
    </QueryClientProvider>
  </StrictMode>,
)
