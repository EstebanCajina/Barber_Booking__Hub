import React from 'react';

interface Person {
  id: number;
  name: string;
  age: number;
  email: string;
}

interface Props {
  people: Person[];
}

const PeopleTable: React.FC<Props> = ({ people }: Props) => {
  return (
    <table className="table table-striped table-bordered border-info">
      <thead className='table table-dark'>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Age</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {people.map(person => (
          <tr key={person.id}>
            <td>{person.id}</td>
            <td>{person.name}</td>
            <td>{person.age}</td>
            <td>{person.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default PeopleTable;
