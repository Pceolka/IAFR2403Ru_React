// Чистый reducer списка сериалов: без fetch, localStorage и других побочных эффектов.
// Каждое действие возвращает новый объект состояния и новые массивы/объекты записей.

export const ENTITY_ACTIONS = {
  LOAD_START: 'LOAD_START',
  LOAD_SUCCESS: 'LOAD_SUCCESS',
  LOAD_ERROR: 'LOAD_ERROR',
  ADD_ENTITY: 'ADD_ENTITY',
  UPDATE_ENTITY: 'UPDATE_ENTITY',
  REMOVE_ENTITY: 'REMOVE_ENTITY',
};

export const initialEntitiesState = {
  entities: [],
  loading: true,
  error: null,
};

export function entitiesReducer(state, action) {
  switch (action.type) {
    case ENTITY_ACTIONS.LOAD_START:
      return { ...state, loading: true, error: null };

    case ENTITY_ACTIONS.LOAD_SUCCESS:
      return { entities: action.payload, loading: false, error: null };

    case ENTITY_ACTIONS.LOAD_ERROR:
      return { ...state, loading: false, error: action.payload };

    case ENTITY_ACTIONS.ADD_ENTITY:
      // новая запись — в начало списка (новый массив, исходный не меняется)
      return { ...state, entities: [action.payload, ...state.entities] };

    case ENTITY_ACTIONS.UPDATE_ENTITY: {
      const { id, changes } = action.payload;
      return {
        ...state,
        entities: state.entities.map((entity) =>
          entity.id === id ? { ...entity, ...changes, id } : entity,
        ),
      };
    }

    case ENTITY_ACTIONS.REMOVE_ENTITY:
      return {
        ...state,
        entities: state.entities.filter((entity) => entity.id !== action.payload),
      };

    default:
      return state;
  }
}
