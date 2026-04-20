import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Profile from './pages/Profile';
import SavedEvents from './pages/SavedEvents';
import Messages from './pages/Messages';
import { SavedEventsProvider } from './context/SavedEventsContext';
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <UserProvider>
      <SavedEventsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="profile" element={<Profile />} />
              <Route path="saved" element={<SavedEvents />} />
              <Route path="messages" element={<Messages />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SavedEventsProvider>
    </UserProvider>
  );
}

export default App;
