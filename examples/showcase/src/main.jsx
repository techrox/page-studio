// Entry point — mounts the React tree under the AntD App wrapper so
// AntdApp.useApp() (which PageStudio calls internally for toasts) resolves.
// The brand-aware <ConfigProvider> lives inside <App> so colorPrimary can
// switch when the user picks a different brand.

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App as AntdApp } from 'antd'

import App from './App.jsx'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AntdApp>
        <App />
      </AntdApp>
    </BrowserRouter>
  </React.StrictMode>,
)
