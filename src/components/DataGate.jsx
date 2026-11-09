import { useEntitiesContext } from '../context/useEntitiesContext.js';
import StatusMessage from './StatusMessage.jsx';

// Показывает содержимое страницы только когда данные загружены
function DataGate({ children }) {
  const { loading, error, reloadEntities } = useEntitiesContext();

  if (loading) return <StatusMessage type="loading" text="Загрузка сериалов…" />;

  if (error) {
    return (
      <StatusMessage
        type="error"
        text={`Ошибка загрузки: ${error}`}
        actionLabel="Повторить"
        onAction={reloadEntities}
      />
    );
  }

  return children;
}

export default DataGate;
