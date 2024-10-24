// RefContext.js
import React, { createContext, useRef, useContext } from 'react';

// Context 생성
const RefContext = createContext(null);

// Context Provider 컴포넌트
export const RefProvider = ({ children }) => {
    // useRef를 Context에서 관리
    const swiperRef = useRef(null);

    return (
        <RefContext.Provider value={{ swiperRef }}>
            {children}
        </RefContext.Provider>
    );
};

// Context를 사용하기 위한 커스텀 훅
export const useRefContext = () => {
    return useContext(RefContext);
};
