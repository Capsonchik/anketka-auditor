import { createSlice } from '@reduxjs/toolkit';
import type { IUser } from '../types/user.types';
import { userApi } from '../api/user.api';

/**
 * Состояние сущности пользователя
 */
export interface UserState {
  /** Данные текущего пользователя */
  data: IUser | null;
  /** Флаг авторизации */
  isAuthenticated: boolean;
}

const initialState: UserState = {
  data: null,
  isAuthenticated: false,
};

/**
 * Redux слайс для управления состоянием пользователя
 * 
 * @description
 * Содержит экшены и редюсеры для работы с данными пользователя.
 * Интегрирован с RTK Query через extraReducers.
 */
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    /**
     * Очистить данные пользователя (при выходе из системы)
     */
    clearUser: (state) => {
      state.data = null;
      state.isAuthenticated = false;
    },
    
    /**
     * Установить данные пользователя
     * 
     * @param action - Данные пользователя
     */
    setUser: (state, action) => {
      state.data = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      /**
       * Обработка успешного получения данных пользователя
       */
      .addMatcher(userApi.endpoints.getMe.matchFulfilled, (state, action) => {
        state.data = action.payload;
        state.isAuthenticated = true;
      })
      /**
       * Обработка ошибки получения данных пользователя
       */
      .addMatcher(userApi.endpoints.getMe.matchRejected, (state) => {
        state.data = null;
        state.isAuthenticated = false;
      });
  },
});

/**
 * Экшены слайса пользователя
 */
export const { clearUser, setUser } = userSlice.actions;

/**
 * Редюсер пользователя
 */
export const userReducer = userSlice.reducer;

/**
 * Селекторы для работы с состоянием пользователя
 */
export const userSelectors = {
  /**
   * Получить данные текущего пользователя
   * 
   * @example
   * const user = userSelectors.data(state);
   */
  data: (state: { user: UserState }) => state.user.data,
  
  /**
   * Проверить авторизацию пользователя
   * 
   * @example
   * const isAuth = userSelectors.isAuthenticated(state);
   */
  isAuthenticated: (state: { user: UserState }) => state.user.isAuthenticated,
  
  /**
   * Получить ID пользователя
   * 
   * @example
   * const userId = userSelectors.id(state);
   */
  id: (state: { user: UserState }) => state.user.data?.id ?? null,
  
  /**
   * Получить имя пользователя (username)
   * 
   * @example
   * const username = userSelectors.username(state);
   */
  username: (state: { user: UserState }) => state.user.data?.username ?? '',
  
  /**
   * Получить email пользователя
   * 
   * @example
   * const email = userSelectors.email(state);
   */
  email: (state: { user: UserState }) => state.user.data?.email ?? '',
  
  /**
   * Получить полное имя пользователя (фамилия имя)
   * 
   * @example
   * const fullName = userSelectors.fullName(state);
   */
  fullName: (state: { user: UserState }) => {
    const { data } = state.user;
    if (!data) return '';
    return `${data.last_name} ${data.first_name}`.trim();
  },
  
  /**
   * Получить роль пользователя
   * 
   * @example
   * const role = userSelectors.role(state);
   */
  role: (state: { user: UserState }) => state.user.data?.role ?? '',
  
  /**
   * Проверить, является ли пользователь менеджером
   * 
   * @example
   * const isManager = userSelectors.isManager(state);
   */
  isManager: (state: { user: UserState }) => state.user.data?.is_manager ?? false,
};
