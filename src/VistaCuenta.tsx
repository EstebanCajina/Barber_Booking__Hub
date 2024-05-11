import React from 'react';
import PeopleTable from './TablaPersona';
import UpdatePerson from './ActualizarUsuario';

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

interface Person {
  id: number;
  name: string;
  age: number;
  email: string;
}
const user = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
  };

interface Props {
  people: Person[];
}

const App: React.FC = () => {
    const people = [
      { id: 1, name: 'John', age: 30, email: 'john@example.com' },
      { id: 2, name: 'Jane', age: 25, email: 'jane@example.com' },
      { id: 3, name: 'Doe', age: 35, email: 'doe@example.com' }
    ];
  return (
    <div>
      <h1>People List</h1>
      <Tabs defaultActiveKey="peopleTable" id="people-tabs" className="mb-3">
        <Tab eventKey="peopleTable" title="People Table">
          <PeopleTable people={people} />
        </Tab>
        <Tab eventKey="otherTab" title="Other Tab">
        
        <UpdatePerson user={user} />

        </Tab>
      </Tabs>
    </div>
  );
}

export default App;
