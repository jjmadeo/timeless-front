/* eslint-disable react/prop-types */


const AgendaSelector = ({ agendas, onSelect }) => {
  return (
    <div>
      <h2>Selecciona una Agenda</h2>
      <ul>
        {agendas.map((agenda) => (
          <li key={agenda.id} onClick={() => onSelect(agenda)}>
            {agenda.agendaName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AgendaSelector;