export interface DatabaseInterface {
  getUser: Function;
}

const database: DatabaseInterface = {
  getUser: function () {},
};

export default database;
