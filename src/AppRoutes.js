import React from 'react';
import { Routes, Route } from 'react-router-dom';
// Pages
import { StreamingIndex } from 'pages/StreamingPage/StreamingIndex';
const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/*" element={<StreamingIndex />} />
        </Routes>
    );
};

export default AppRoutes;
