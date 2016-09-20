import Sequelize from 'sequelize';

const Conn = new Sequelize(
  'orders_report',
  'albert',
  'sydneytools123',
  {
    dialect: 'postgres',
    host: 'localhost'
  }
);

const Order = Conn.define('order', {
  orderNumber: {
    type: Sequelize.STRING,
  },
  status: {
    type: Sequelize.STRING
  },
  createdAt: {
    type: Sequelize.STRING
  }
});
const Parcel = Conn.define('parcel', {
  trackingNumber: {
    type: Sequelize.STRING,
  },
  status: {
    type: Sequelize.STRING
  },
  deliveryTime: {
    type: Sequelize.INTEGER
  },
  orderId: {
    type: Sequelize.INTEGER
  },
  logisticId: {
    type: Sequelize.INTEGER
  },
});
const Logistic = Conn.define('logistic', {
  name: {
    type: Sequelize.STRING,
  }
});
//relationships
Order.hasMany(Parcel);
Parcel.belongsTo(Order);
Logistic.hasMany(Parcel);
Parcel.belongsTo(Logistic);

export function getOrder(id) {
  return Order.findOne({
    where:{id: id}
  });
}
export default Conn;
// export function getOrder(id) {
//   return Order.id;
// }
